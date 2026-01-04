"use client";

import type { PersonDirectionResult, DirectionResult } from "@/core/application/dtos/direction";
import type { DirectionStatus, DirectionKey } from "@/core/domain/direction";
import { useI18n } from "@/shared/lib/i18n";

interface DirectionTableProps {
  person: PersonDirectionResult;
}

// 方角の表示順序
const directionOrder: DirectionKey[] = [
  "south",
  "southwest",
  "west",
  "northwest",
  "north",
  "northeast",
  "east",
  "southeast",
];

// 月の表示順序（2月〜翌1月）
const monthOrder = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "1"];

// ステータスから表示文字を取得
function getStatusSymbol(status: DirectionStatus): string {
  switch (status) {
    case "good":
      return "◯";
    case "bad":
      return "×";
    default:
      return "";
  }
}

// ステータスに応じたセルのクラス
function getStatusClass(status: DirectionStatus): string {
  if (status === "good") {
    return "bg-red-100 dark:bg-red-900/30";
  }
  return "";
}

// 方向結果を方向キーでインデックス化
function indexByDirection(directions: DirectionResult[]): Record<DirectionKey, DirectionResult> {
  const result: Partial<Record<DirectionKey, DirectionResult>> = {};
  for (const d of directions) {
    result[d.direction] = d;
  }
  return result as Record<DirectionKey, DirectionResult>;
}

export function DirectionTable({ person }: DirectionTableProps) {
  const { t } = useI18n();
  const yearDirections = indexByDirection(person.directions);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b">
            <th
              className="px-2 py-1 text-left font-medium sticky left-0 bg-background z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.15)]"
              rowSpan={2}
            >
              {t.direction}
            </th>
            <th className="px-2 py-1 text-center font-medium border-l" colSpan={2}>
              {t.yearBoard}
            </th>
            {monthOrder.map((month, idx) => (
              <th
                key={month}
                className={`px-2 py-1 text-center font-medium ${idx === 0 ? "border-l-2 border-l-gray-400" : "border-l"}`}
                colSpan={2}
              >
                {month}
                {t.monthSuffix}
              </th>
            ))}
          </tr>
          <tr className="border-b text-xs text-muted-foreground">
            <th className="px-1 py-1 text-center border-l">{t.honmei}</th>
            <th className="px-1 py-1 text-center">{t.getsumei}</th>
            {monthOrder.flatMap((month, idx) => [
              <th
                key={`${month}-h`}
                className={`px-1 py-1 text-center ${idx === 0 ? "border-l-2 border-l-gray-400" : "border-l"}`}
              >
                {t.honmei}
              </th>,
              <th key={`${month}-g`} className="px-1 py-1 text-center">
                {t.getsumei}
              </th>,
            ])}
          </tr>
        </thead>
        <tbody>
          {directionOrder.map((dirKey) => {
            const yearResult = yearDirections[dirKey];
            return (
              <tr key={dirKey} className="border-b">
                <td className="px-2 py-1 font-medium sticky left-0 bg-background shadow-[2px_0_4px_-2px_rgba(0,0,0,0.15)]">
                  {t.directions[dirKey]}
                </td>
                {/* 年盤 */}
                <td
                  className={`px-1 py-1 text-center border-l ${getStatusClass(yearResult?.honmeiResult.status)}`}
                >
                  {yearResult ? getStatusSymbol(yearResult.honmeiResult.status) : ""}
                </td>
                <td
                  className={`px-1 py-1 text-center ${getStatusClass(yearResult?.getsumeiResult.status)}`}
                >
                  {yearResult ? getStatusSymbol(yearResult.getsumeiResult.status) : ""}
                </td>
                {/* 月盤 */}
                {monthOrder.flatMap((month, idx) => {
                  const monthData = person.months[month];
                  const monthDirections = monthData
                    ? indexByDirection(monthData.directions)
                    : ({} as Record<DirectionKey, DirectionResult>);
                  const monthResult = monthDirections[dirKey];
                  return [
                    <td
                      key={`${month}-h`}
                      className={`px-1 py-1 text-center ${idx === 0 ? "border-l-2 border-l-gray-400" : "border-l"} ${getStatusClass(monthResult?.honmeiResult.status)}`}
                    >
                      {monthResult ? getStatusSymbol(monthResult.honmeiResult.status) : ""}
                    </td>,
                    <td
                      key={`${month}-g`}
                      className={`px-1 py-1 text-center ${getStatusClass(monthResult?.getsumeiResult.status)}`}
                    >
                      {monthResult ? getStatusSymbol(monthResult.getsumeiResult.status) : ""}
                    </td>,
                  ];
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
