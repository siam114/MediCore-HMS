import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface MediCoreLogoIconProps {
  className?: string;
  size?: number | string;
}

export function MediCoreLogoIcon({ className, size = 40 }: MediCoreLogoIconProps) {
  const numSize = typeof size === "number" ? size : parseInt(size as string, 10) || 40;

  return (
    <div
      style={{ width: numSize, height: numSize }}
      className={cn(
        "relative shrink-0 flex items-center justify-center select-none transition-transform duration-200",
        className
      )}
    >
      <Image
        src="/medicore-logo.png"
        alt="MediCore Hospitals Logo"
        width={numSize * 2}
        height={numSize * 2}
        className="w-full h-full object-contain filter drop-shadow-[0_3px_8px_rgba(13,148,136,0.22)]"
        priority
      />
    </div>
  );
}

export interface MediCoreLogoProps {
  className?: string;
  iconSize?: number | string;
  showSubtitle?: boolean;
  subtitle?: string;
  badgeText?: string;
}

export function MediCoreLogo({
  className,
  iconSize = 40,
  showSubtitle = true,
  subtitle = "Tertiary Care & Research Center",
  badgeText = "HOSPITALS",
}: MediCoreLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5 sm:gap-3 group select-none min-w-0", className)}>
      <MediCoreLogoIcon size={iconSize} className="group-hover:scale-[1.04] transition-transform shrink-0" />
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-base sm:text-xl 2xl:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-50 font-sans truncate">
            MediCore
          </span>
          {badgeText && (
            <span className="rounded bg-teal-50 px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-[10px] font-bold text-teal-700 border border-teal-200 dark:bg-teal-950 dark:border-teal-800 dark:text-teal-300 shrink-0">
              {badgeText}
            </span>
          )}
        </div>
        {showSubtitle && subtitle && (
          <span className="hidden sm:block text-[10px] sm:text-[11px] font-medium text-slate-500 tracking-wide dark:text-slate-400 truncate">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
