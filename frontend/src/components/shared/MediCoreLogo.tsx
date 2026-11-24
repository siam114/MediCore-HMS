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

export interface MediCoreLoaderProps {
  className?: string;
  size?: number;
  text?: string;
}

export function MediCoreLoader({
  className,
  size = 56,
  text = "Loading MediCore...",
}: MediCoreLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3.5 select-none", className)}>
      <div className="relative flex items-center justify-center">
        {/* Pulsing ambient rings */}
        <div
          style={{ width: size + 24, height: size + 24 }}
          className="absolute rounded-full bg-teal-500/15 dark:bg-teal-400/10 animate-ping opacity-60"
        />
        <div
          style={{ width: size + 16, height: size + 16 }}
          className="absolute rounded-full border border-teal-500/30 dark:border-teal-400/20 animate-pulse"
        />
        {/* 3D Glass Logo Emblem */}
        <div className="animate-pulse">
          <MediCoreLogoIcon
            size={size}
            className="filter drop-shadow-[0_4px_16px_rgba(13,148,136,0.35)]"
          />
        </div>
      </div>
      {text && (
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
