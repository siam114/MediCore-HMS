import React from "react";
import { MediCoreLoader } from "@/components/shared";

export default function DoctorsLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/80 dark:bg-slate-950">
      <MediCoreLoader size={64} text="Connecting to Clinical Physician Registry..." />
    </div>
  );
}
