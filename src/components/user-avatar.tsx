import { cn } from "@/lib/utils"

type UserAvatarProps = {
  name: string
  image?: string | null
  className?: string
}

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function UserAvatar({ name, image, className }: UserAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand/10 text-[0.7rem] font-semibold text-brand",
        className,
      )}
    >
      {image ? (
        <span
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${image}")` }}
        />
      ) : (
        initialsFor(name)
      )}
    </span>
  )
}
