import { Check, X } from "lucide-react"
import { passwordChecks } from "@/lib/password"
import { cn } from "@/lib/utils"

export function PasswordChecklist({ password }: { password: string }) {
  return (
    <ul className="grid gap-1.5" aria-label="Password requirements">
      {passwordChecks.map((check) => {
        const passed = check.test(password)

        return (
          <li
            key={check.label}
            className={cn(
              "flex items-center gap-2 text-xs transition-colors",
              passed ? "text-emerald-700" : "text-muted-foreground",
            )}
          >
            {passed ? (
              <Check className="size-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <X className="size-3.5 shrink-0" aria-hidden="true" />
            )}
            {check.label}
          </li>
        )
      })}
    </ul>
  )
}
