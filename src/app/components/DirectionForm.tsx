"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { personSchema } from "@/modules/presentation/validators/direction";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import { Loader2 } from "lucide-react";
import { calculateDirections } from "@/app/actions";
import { STAR_NAMES, type StarNumber } from "@/modules/domain/shared";
import type {
  DirectionApiResponse,
  PersonDirectionResult,
} from "@/modules/application/dtos/direction";
import { DirectionTable } from "./DirectionTable";
import { useI18n } from "@/app/lib/i18n";

interface PersonInput {
  birthYear: number;
  birthMonth: number;
}

interface FormData {
  targetYear: number;
  persons: PersonInput[];
}

const currentYear = new Date().getFullYear();
const latestYear = currentYear - 9;
const oldestYear = currentYear - 70;
const defaultBirthYear = Math.floor((latestYear + oldestYear) / 2);
const years = Array.from({ length: latestYear - oldestYear + 1 }, (_, i) => latestYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const availableTargetYears = [2026]; // 盤データがある年のみ

const STORAGE_KEY = "houitori-form";

const savedFormSchema = z
  .object({
    targetYear: z.number().int(),
  })
  .merge(personSchema);

type SavedFormData = z.infer<typeof savedFormSchema>;

function loadSavedData(): SavedFormData | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return savedFormSchema.parse(parsed);
    }
  } catch {
    // ignore parse/validation errors
  }
  return null;
}

function saveData(data: SavedFormData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

export function DirectionForm() {
  const { t } = useI18n();
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [result, setResult] = useState<DirectionApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const initializedRef = useRef(false);

  const form = useForm<FormData>({
    defaultValues: {
      targetYear: 2026,
      persons: [{ birthYear: defaultBirthYear, birthMonth: 1 }],
    },
  });

  // localStorageから復元（初回マウント時のみ）
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const saved = loadSavedData();
    if (saved) {
      form.setValue("targetYear", saved.targetYear);
      form.setValue("persons.0.birthYear", saved.birthYear);
      form.setValue("persons.0.birthMonth", saved.birthMonth);
    }
  }, [form]);

  const {
    fields,
    append,
    remove: removeField,
  } = useFieldArray({
    control: form.control,
    name: "persons",
  });

  // 削除時に結果も同期する
  const handleRemove = (index: number) => {
    removeField(index);
    setResult((prev) => {
      if (!prev) return null;
      const newPersons = [...prev.persons];
      newPersons.splice(index, 1);
      return { ...prev, persons: newPersons };
    });
  };

  const targetYear = form.watch("targetYear");
  const persons = form.watch("persons");

  const handleCalculate = async (index: number) => {
    const person = persons[index];
    if (!person || pendingIndex !== null) {
      return;
    }

    setPendingIndex(index);
    setError(null);

    try {
      const response = await calculateDirections({
        targetYear,
        persons: [{ birthYear: person.birthYear, birthMonth: person.birthMonth }],
      });
      if (response.success) {
        setResult((prev) => {
          // 既存の結果または空配列から開始し、正しいインデックスに結果を配置
          const newPersons = prev?.persons ? [...prev.persons] : [];
          newPersons[index] = response.data.persons[0];
          return {
            year: response.data.year,
            persons: newPersons,
          };
        });
      } else {
        setError(response.error);
      }
    } finally {
      setPendingIndex(null);
    }
  };

  // 一人目の入力値をlocalStorageに保存
  const saveFirstPersonData = (
    targetYearVal: number,
    birthYearVal: number,
    birthMonthVal: number
  ) => {
    saveData({
      targetYear: targetYearVal,
      birthYear: birthYearVal,
      birthMonth: birthMonthVal,
    });
  };

  const handleTargetYearChange = (value: string) => {
    const newYear = Number(value);
    form.setValue("targetYear", newYear);
    // 対象年が変わったら結果をクリア（旧年の結果が混在しないように）
    setResult(null);
    const firstPerson = persons[0];
    if (firstPerson) {
      saveFirstPersonData(newYear, firstPerson.birthYear, firstPerson.birthMonth);
    }
  };

  const handleBirthYearChange = (index: number, value: string) => {
    const newBirthYear = Number(value);
    form.setValue(`persons.${index}.birthYear`, newBirthYear);
    // 一人目の場合のみ保存
    if (index === 0) {
      const firstPerson = persons[0];
      if (firstPerson) {
        saveFirstPersonData(targetYear, newBirthYear, firstPerson.birthMonth);
      }
    }
  };

  const handleBirthMonthChange = (index: number, value: string) => {
    const newBirthMonth = Number(value);
    form.setValue(`persons.${index}.birthMonth`, newBirthMonth);
    // 一人目の場合のみ保存
    if (index === 0) {
      const firstPerson = persons[0];
      if (firstPerson) {
        saveFirstPersonData(targetYear, firstPerson.birthYear, newBirthMonth);
      }
    }
  };

  const getStarNameJa = (star: StarNumber) => STAR_NAMES.ja[star];

  // 入力に対応する結果を取得（インデックスベース）
  const getPersonResult = (index: number): PersonDirectionResult | null => {
    if (!result || !result.persons[index]) {
      return null;
    }
    return result.persons[index];
  };

  return (
    <div className="space-y-6">
      {/* 対象年選択 */}
      <div className="space-y-2">
        <Label>{t.targetYear}</Label>
        <Select
          value={String(targetYear)}
          onValueChange={handleTargetYearChange}
          disabled={pendingIndex !== null}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableTargetYears.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
                {t.yearSuffix}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 人物入力 + 結果表示 */}
      {fields.map((field, index) => {
        const person = persons[index];
        if (!person) return null;
        const personResult = getPersonResult(index);

        return (
          <Card key={field.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span>
                  {t.person(index + 1)}
                  {personResult && (
                    <span className="ml-2 font-normal text-muted-foreground">
                      （{getStarNameJa(personResult.honmeiSei)} /{" "}
                      {getStarNameJa(personResult.getsumeiSei)}）
                    </span>
                  )}
                </span>
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(index)}
                    disabled={pendingIndex !== null}
                    className="disabled:opacity-100"
                  >
                    {t.delete}
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="space-y-2">
                  <Label>{t.birthYear}</Label>
                  <Select
                    value={String(person.birthYear)}
                    onValueChange={(v) => handleBirthYearChange(index, v)}
                    disabled={pendingIndex !== null}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder={t.selectPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t.birthMonth}</Label>
                  <Select
                    value={String(person.birthMonth)}
                    onValueChange={(v) => handleBirthMonthChange(index, v)}
                    disabled={pendingIndex !== null}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder={t.selectPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={String(month)}>
                          {month}
                          {t.monthSuffix}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  onClick={() => handleCalculate(index)}
                  disabled={pendingIndex !== null}
                  className="w-20 disabled:opacity-100"
                >
                  {pendingIndex === index ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    t.calculate
                  )}
                </Button>
              </div>

              {/* 結果テーブル（同じカード内） */}
              {personResult && <DirectionTable person={personResult} />}
            </CardContent>
          </Card>
        );
      })}

      {/* 追加ボタン */}
      {fields.length < 5 && (
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ birthYear: defaultBirthYear, birthMonth: 1 })}
          disabled={pendingIndex !== null}
          className="disabled:opacity-100"
        >
          {t.add}
        </Button>
      )}

      {/* エラー表示 */}
      {error && <div className="text-red-600 bg-red-50 p-4 rounded">{error}</div>}
    </div>
  );
}
