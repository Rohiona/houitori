"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function HelpDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-lg text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
          使い方・見方
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto scrollbar-none">
        <DialogHeader>
          <DialogTitle>使い方・見方</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 text-sm">
          {/* 使い方 */}
          <section>
            <h3 className="font-bold text-base mb-2">■ 使い方</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>生年月日欄に該当する生年月をご入力ください。</li>
              <li>
                「計算」ボタンを押下すると入力した年と月を元にあなたの吉方位を算出いたします。
              </li>
            </ol>
          </section>

          {/* 年盤の見方 */}
          <section>
            <h3 className="font-bold text-base mb-2">■ 年盤の見方</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>一年（本年2月3日位～翌年1月末まで）通したあなたの吉方位・凶方位を表します。</li>
              <li>年盤は方位を取った場合、その効果が大きく、永く続くのが特徴です。</li>
              <li>引っ越しや、移動距離が500kmを超える旅行など、大きな移動はこちらを参照します。</li>
            </ul>
          </section>

          {/* 月盤の見方 */}
          <section>
            <h3 className="font-bold text-base mb-2">■ 月盤の見方</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>当該月（当月3日～翌月2日位まで）のあなたの吉方位・凶方位を表します。</li>
              <li>
                月盤は年盤に比べると効果は弱いですが、その分移動距離が少なくて済む（150～499km）のが特徴です。
              </li>
              <li>海外旅行や引っ越しを頻繁に行えない方で毎月方位取りをする方に向いています。</li>
            </ul>
          </section>

          {/* 算出結果の見方 */}
          <section>
            <h3 className="font-bold text-base mb-2">■ 算出結果の見方</h3>
            <p className="mb-2">当ツールでは以下の表の様に考えております。</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b bg-muted">
                    <th className="px-2 py-1 text-center">本</th>
                    <th className="px-2 py-1 text-center">月</th>
                    <th className="px-2 py-1 text-center">運勢</th>
                    <th className="px-2 py-1 text-left">年盤の場合</th>
                    <th className="px-2 py-1 text-left">月盤の場合</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-2 py-1 text-center bg-red-100">◯</td>
                    <td className="px-2 py-1 text-center bg-red-100">◯</td>
                    <td className="px-2 py-1 text-center font-bold text-red-600">大吉</td>
                    <td className="px-2 py-1">転居または500km以上の旅行に非常におすすめ</td>
                    <td className="px-2 py-1">150km～499kmまでの旅行に非常におすすめ</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-2 py-1 text-center bg-red-100">◯</td>
                    <td className="px-2 py-1 text-center"></td>
                    <td className="px-2 py-1 text-center">中吉</td>
                    <td className="px-2 py-1">転居または500km以上の旅行にややおすすめ</td>
                    <td className="px-2 py-1">150km～499kmまでの旅行にややおすすめ</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-2 py-1 text-center"></td>
                    <td className="px-2 py-1 text-center bg-red-100">◯</td>
                    <td className="px-2 py-1 text-center">小吉</td>
                    <td className="px-2 py-1">転居または500km以上の旅行に行ってもよい</td>
                    <td className="px-2 py-1">150km～499kmまでの旅行に行ってもよい</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-2 py-1 text-center"></td>
                    <td className="px-2 py-1 text-center"></td>
                    <td className="px-2 py-1 text-center">凶</td>
                    <td className="px-2 py-1">転居または500km以上の旅行に行かない方が良い</td>
                    <td className="px-2 py-1">150km～499kmまでの旅行に行かない方が良い</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-2 py-1 text-center">×</td>
                    <td className="px-2 py-1 text-center bg-red-100">◯</td>
                    <td className="px-2 py-1 text-center font-bold text-blue-600">大凶</td>
                    <td className="px-2 py-1">転居または500km以上の旅行は行ってはいけない</td>
                    <td className="px-2 py-1">150km～499kmまでの旅行は行ってはいけない</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-2 py-1 text-center bg-red-100">◯</td>
                    <td className="px-2 py-1 text-center">×</td>
                    <td className="px-2 py-1 text-center font-bold text-blue-600">大凶</td>
                    <td className="px-2 py-1">転居または500km以上の旅行は行ってはいけない</td>
                    <td className="px-2 py-1">150km～499kmまでの旅行は行ってはいけない</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-2 py-1 text-center">×</td>
                    <td className="px-2 py-1 text-center"></td>
                    <td className="px-2 py-1 text-center font-bold text-blue-600">大凶</td>
                    <td className="px-2 py-1">転居または500km以上の旅行は行ってはいけない</td>
                    <td className="px-2 py-1">150km～499kmまでの旅行は行ってはいけない</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-2 py-1 text-center"></td>
                    <td className="px-2 py-1 text-center">×</td>
                    <td className="px-2 py-1 text-center font-bold text-blue-600">大凶</td>
                    <td className="px-2 py-1">転居または500km以上の旅行は行ってはいけない</td>
                    <td className="px-2 py-1">150km～499kmまでの旅行は行ってはいけない</td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-2 py-1 text-center">×</td>
                    <td className="px-2 py-1 text-center">×</td>
                    <td className="px-2 py-1 text-center font-bold text-blue-600">大凶</td>
                    <td className="px-2 py-1">転居または500km以上の旅行は行ってはいけない</td>
                    <td className="px-2 py-1">150km～499kmまでの旅行は行ってはいけない</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
