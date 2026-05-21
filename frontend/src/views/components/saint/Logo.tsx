import { cn } from "@/views/lib/utils";

export function Logo({ className, variant = "dark" }: { className?: string; variant?: "dark" | "light" }) {
  const textColor = variant === "light" ? "#EEF6FF" : "#365AA3";

  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width="34"
        height="34"
        viewBox="0 0 68 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="saint-luzia-logo-grad" x1="8" y1="8" x2="58" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5A35C8" />
            <stop offset="1" stopColor="#19C9DE" />
          </linearGradient>
        </defs>

        <path
          d="M47 6C27 8 13 24 13 43C13 54 18 62 27 67C14 63 6 53 6 40C6 22 19 8 47 6Z"
          fill="url(#saint-luzia-logo-grad)"
        />
        <path
          d="M45 19C38 20 34 24 34 29C34 34 38 37 45 40C53 43 57 46 57 52C57 59 51 63 43 63C36 63 31 60 27 55"
          stroke="url(#saint-luzia-logo-grad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        style={{ color: textColor, letterSpacing: "0.14em", fontWeight: 300 }}
        className="text-[1.05rem] leading-none"
      >
        SAINT LUZIA
      </span>
    </div>
  );
}
