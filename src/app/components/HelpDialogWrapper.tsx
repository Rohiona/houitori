"use client";

import dynamic from "next/dynamic";

const HelpDialog = dynamic(() => import("./HelpDialog").then((m) => m.HelpDialog), {
  ssr: false,
});

export function HelpDialogWrapper() {
  return <HelpDialog />;
}
