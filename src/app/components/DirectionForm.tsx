"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { calculateDirections } from "@/app/actions";
import { STAR_NAMES, type StarNumber } from "@/modules/domain/shared";
import type {
  DirectionApiResponse,
  PersonDirectionResult,
} from "@/modules/application/dtos/direction";
import { DirectionTable } from "./DirectionTable";

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

export function DirectionForm() {
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [result, setResult] = useState<DirectionApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    defaultValues: {
      targetYear: 2026,
      persons: [{ birthYear: defaultBirthYear, birthMonth: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "persons",
  });

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
          if (!prev) {
            return response.data;
          }
          // 既存の結果に追加/更新
          const newPersons = [...prev.persons];
          newPersons[index] = response.data.persons[0];
          return { ...prev, persons: newPersons };
        });
      } else {
        setError(response.error);
      }
    } finally {
      setPendingIndex(null);
    }
  };

  const handleTargetYearChange = (value: string) => {
    form.setValue("targetYear", Number(value));
  };

  const handleBirthYearChange = (index: number, value: string) => {
    form.setValue(`persons.${index}.birthYear`, Number(value));
  };

  const handleBirthMonthChange = (index: number, value: string) => {
    form.setValue(`persons.${index}.birthMonth`, Number(value));
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
        <Label>対象年</Label>
        <Select value={String(targetYear)} onValueChange={handleTargetYearChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {availableTargetYears.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}年
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
                  {index + 1}人目
                  {personResult && (
                    <span className="ml-2 font-normal text-muted-foreground">
                      （{getStarNameJa(personResult.honmeiSei)} /{" "}
                      {getStarNameJa(personResult.getsumeiSei)}）
                    </span>
                  )}
                </span>
                {index > 0 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                    削除
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="space-y-2">
                  <Label>生年</Label>
                  <Select
                    value={String(person.birthYear)}
                    onValueChange={(v) => handleBirthYearChange(index, v)}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="選択" />
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
                  <Label>生月</Label>
                  <Select
                    value={String(person.birthMonth)}
                    onValueChange={(v) => handleBirthMonthChange(index, v)}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={String(month)}>
                          {month}月
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  onClick={() => handleCalculate(index)}
                  disabled={pendingIndex !== null}
                  className="w-16"
                >
                  {pendingIndex === index ? <Loader2 className="size-4 animate-spin" /> : "計算"}
                </Button>
              </div>

              {/* 結果テーブル（同じカード内） */}
              {personResult && <DirectionTable person={personResult} year={result!.year} />}
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
        >
          ＋ 追加
        </Button>
      )}

      {/* エラー表示 */}
      {error && <div className="text-red-600 bg-red-50 p-4 rounded">{error}</div>}
    </div>
  );
}
