"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { useState, useTransition, useEffect, useCallback } from "react";
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
import { calculateDirections } from "@/app/actions";
import { STAR_NAMES, type StarNumber } from "@/modules/domain/shared";
import type { DirectionApiResponse } from "@/modules/application/dtos/direction";

interface PersonInput {
  birthYear: number | null;
  birthMonth: number | null;
}

interface FormData {
  targetYear: number;
  persons: PersonInput[];
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => 1900 + i).reverse();
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const availableTargetYears = [2026]; // 盤データがある年のみ

export function DirectionForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<DirectionApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    defaultValues: {
      targetYear: 2026,
      persons: [{ birthYear: null, birthMonth: null }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "persons",
  });

  const targetYear = form.watch("targetYear");
  const persons = form.watch("persons");

  const triggerCalculation = useCallback(() => {
    // 入力済みの人だけを対象にする
    const validPersons = persons.filter((p) => p.birthYear !== null && p.birthMonth !== null);
    if (validPersons.length === 0) return;

    startTransition(async () => {
      setError(null);
      const response = await calculateDirections({
        targetYear,
        persons: validPersons.map((p) => ({
          birthYear: p.birthYear!,
          birthMonth: p.birthMonth!,
        })),
      });
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error);
        setResult(null);
      }
    });
  }, [targetYear, persons]);

  // 値が変更されたら計算を実行
  useEffect(() => {
    triggerCalculation();
  }, [triggerCalculation]);

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

      {/* 人物入力 */}
      {fields.map((field, index) => {
        const person = persons[index];
        return (
          <Card key={field.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span>{index + 1}人目</span>
                {index > 0 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                    削除
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="space-y-2">
                  <Label>生年</Label>
                  <Select
                    value={person?.birthYear ? String(person.birthYear) : ""}
                    onValueChange={(v) => handleBirthYearChange(index, v)}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="-" />
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
                    value={person?.birthMonth ? String(person.birthMonth) : ""}
                    onValueChange={(v) => handleBirthMonthChange(index, v)}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="-" />
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
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* 追加ボタン */}
      {fields.length < 5 && (
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ birthYear: null, birthMonth: null })}
        >
          ＋ 追加
        </Button>
      )}

      {/* ローディング表示 */}
      {isPending && <div className="text-muted-foreground">計算中...</div>}

      {/* エラー表示 */}
      {error && <div className="text-red-600 bg-red-50 p-4 rounded">{error}</div>}

      {/* 結果表示 */}
      {result && !isPending && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">{result.year}年の結果</h2>
          {result.persons.map((person, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base">
                  {index + 1}人目: 本命星 {getStarNameJa(person.honmeiSei)} / 月命星{" "}
                  {getStarNameJa(person.getsumeiSei)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  方位吉凶テーブルは Step 3 で実装予定
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
