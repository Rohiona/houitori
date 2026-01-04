"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { useI18n } from "@/shared/lib/i18n";

export function HelpDialog() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-lg text-blue-600 hover:text-blue-800 hover:underline cursor-pointer dark:text-blue-400 dark:hover:text-blue-300">
          {t.helpLink}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t.helpTitle}</DialogTitle>
        </DialogHeader>
        <DialogBody className="scrollbar-none">
          <div className="space-y-6 text-sm">
            {/* Usage */}
            <section>
              <h3 className="font-bold text-base mb-2">■ {t.helpUsage}</h3>
              <ol className="list-decimal list-inside space-y-1">
                {t.helpUsageItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </section>

            {/* Year Board */}
            <section>
              <h3 className="font-bold text-base mb-2">■ {t.helpYearBoard}</h3>
              <ul className="list-disc list-inside space-y-1">
                {t.helpYearBoardItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Month Board */}
            <section>
              <h3 className="font-bold text-base mb-2">■ {t.helpMonthBoard}</h3>
              <ul className="list-disc list-inside space-y-1">
                {t.helpMonthBoardItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            {/* Results Explanation */}
            <section>
              <h3 className="font-bold text-base mb-2">■ {t.helpResults}</h3>
              <p className="mb-2">{t.helpResultsDescription}</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b bg-muted">
                      <th className="px-2 py-1 text-center">{t.helpTableHonmei}</th>
                      <th className="px-2 py-1 text-center">{t.helpTableGetsumei}</th>
                      <th className="px-2 py-1 text-center">{t.helpTableFortune}</th>
                      <th className="px-2 py-1 text-left">{t.helpTableYearCase}</th>
                      <th className="px-2 py-1 text-left">{t.helpTableMonthCase}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-2 py-1 text-center bg-red-100">◯</td>
                      <td className="px-2 py-1 text-center bg-red-100">◯</td>
                      <td className="px-2 py-1 text-center font-bold text-red-600">
                        {t.fortuneDaikichi}
                      </td>
                      <td className="px-2 py-1">{t.yearDaikichiDesc}</td>
                      <td className="px-2 py-1">{t.monthDaikichiDesc}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-2 py-1 text-center bg-red-100">◯</td>
                      <td className="px-2 py-1 text-center"></td>
                      <td className="px-2 py-1 text-center">{t.fortuneChukichi}</td>
                      <td className="px-2 py-1">{t.yearChukichiDesc}</td>
                      <td className="px-2 py-1">{t.monthChukichiDesc}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-2 py-1 text-center"></td>
                      <td className="px-2 py-1 text-center bg-red-100">◯</td>
                      <td className="px-2 py-1 text-center">{t.fortuneShokichi}</td>
                      <td className="px-2 py-1">{t.yearShokichiDesc}</td>
                      <td className="px-2 py-1">{t.monthShokichiDesc}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-2 py-1 text-center"></td>
                      <td className="px-2 py-1 text-center"></td>
                      <td className="px-2 py-1 text-center">{t.fortuneKyo}</td>
                      <td className="px-2 py-1">{t.yearKyoDesc}</td>
                      <td className="px-2 py-1">{t.monthKyoDesc}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-2 py-1 text-center">×</td>
                      <td className="px-2 py-1 text-center bg-red-100">◯</td>
                      <td className="px-2 py-1 text-center font-bold text-blue-600">
                        {t.fortuneDaikyo}
                      </td>
                      <td className="px-2 py-1">{t.yearDaikyoDesc}</td>
                      <td className="px-2 py-1">{t.monthDaikyoDesc}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-2 py-1 text-center bg-red-100">◯</td>
                      <td className="px-2 py-1 text-center">×</td>
                      <td className="px-2 py-1 text-center font-bold text-blue-600">
                        {t.fortuneDaikyo}
                      </td>
                      <td className="px-2 py-1">{t.yearDaikyoDesc}</td>
                      <td className="px-2 py-1">{t.monthDaikyoDesc}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-2 py-1 text-center">×</td>
                      <td className="px-2 py-1 text-center"></td>
                      <td className="px-2 py-1 text-center font-bold text-blue-600">
                        {t.fortuneDaikyo}
                      </td>
                      <td className="px-2 py-1">{t.yearDaikyoDesc}</td>
                      <td className="px-2 py-1">{t.monthDaikyoDesc}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-2 py-1 text-center"></td>
                      <td className="px-2 py-1 text-center">×</td>
                      <td className="px-2 py-1 text-center font-bold text-blue-600">
                        {t.fortuneDaikyo}
                      </td>
                      <td className="px-2 py-1">{t.yearDaikyoDesc}</td>
                      <td className="px-2 py-1">{t.monthDaikyoDesc}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-2 py-1 text-center">×</td>
                      <td className="px-2 py-1 text-center">×</td>
                      <td className="px-2 py-1 text-center font-bold text-blue-600">
                        {t.fortuneDaikyo}
                      </td>
                      <td className="px-2 py-1">{t.yearDaikyoDesc}</td>
                      <td className="px-2 py-1">{t.monthDaikyoDesc}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
