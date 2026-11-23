import React from "react";
import { cn } from "@/lib/utils";

interface MediCoreLogoIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

export function MediCoreLogoIcon({ className, size = 38, ...props }: MediCoreLogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 drop-shadow-xs select-none", className)}
      {...props}
    >
      <defs>
        {/* Rich Hospital Teal to Emerald Gradient */}
        <linearGradient id="mc-grad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="55%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        {/* Gloss overlay */}
        <linearGradient id="mc-glass" x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.03" />
        </linearGradient>

        {/* Pulse ECG Glow */}
        <linearGradient id="mc-pulse" x1="10" y1="22" x2="34" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f766e" />
          <stop offset="50%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>

      {/* Rounded Hospital Badge Container */}
      <rect width="44" height="44" rx="12" fill="url(#mc-grad)" />

      {/* Subtle Upper Glass Highlight */}
      <path
        d="M0 12C0 5.37258 5.37258 0 12 0H32C38.6274 0 44 5.37258 44 12V18C44 18 33 22 22 22C11 22 0 18 0 18V12Z"
        fill="url(#mc-glass)"
      />

      {/* Outer Border Stroke for authentic badge feel */}
      <rect
        x="0.75"
        y="0.75"
        width="42.5"
        height="42.5"
        rx="11.25"
        stroke="#ffffff"
        strokeOpacity="0.22"
        strokeWidth="1.5"
      />

      {/* Medical Cross Graphic Body */}
      {/* Vertical Arm */}
      <rect x="17" y="8" width="10" height="28" rx="4" fill="#ffffff" />
      {/* Horizontal Arm */}
      <rect x="8" y="17" width="28" height="10" rx="4" fill="#ffffff" />

      {/* The Vital "CORE" - Heartbeat ECG Line cutting dynamically through the cross */}
      <path
        d="M9.5 22H16L18.8 14.5L22.2 29.5L25 19L26.8 22H34.5"
        stroke="url(#mc-pulse)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Vital Core Node */}
      <circle cx="22" cy="22" r="2.2" fill="#0d9488" />
      <circle cx="22" cy="22" r="1.1" fill="#ffffff" />
    </svg>
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
