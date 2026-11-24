import { cn } from "@/lib/utils"

type LogoProps = {
  className?: string
  markClassName?: string
  wordmarkClassName?: string
}

export function Logo({ className, markClassName, wordmarkClassName }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 40 40"
        aria-hidden="true"
        className={cn("size-9 shrink-0 lg:size-10", markClassName)}
      >
        <defs>
          <linearGradient
            id="pizzahub-mark"
            x1="6"
            y1="4"
            x2="34"
            y2="36"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F2A08F" />
            <stop offset="0.55" stopColor="#E06A52" />
            <stop offset="1" stopColor="#C63A2E" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="19" fill="url(#pizzahub-mark)" />
        <circle cx="20" cy="20" r="12.5" fill="#FDF8F2" />
        <circle cx="20" cy="20" r="6.75" fill="#C63A2E" />
      </svg>
      <span
        className={cn(
          "text-[1.55rem] font-semibold tracking-[-0.035em] text-ink lg:text-[1.7rem]",
          wordmarkClassName,
        )}
      >
        PizzaHub
      </span>
    </span>
  )
}
