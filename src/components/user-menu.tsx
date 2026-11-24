"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth.client"
import { cn } from "@/lib/utils"

type UserMenuProps = {
  name: string
  email: string
  image?: string | null
  role?: string | null
}

function roleLabel(role?: string | null) {
  if (role === "vendor") return "Restaurant owner"
  if (role === "admin") return "Administrator"
  return "Pizza lover"
}

export function UserMenu({ name, email, image, role }: UserMenuProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  const onSignOut = async () => {
    setSigningOut(true)
    await authClient.signOut()
    setOpen(false)
    setSigningOut(false)
    toast.add({ type: "success", title: "Signed out", description: "See you at the next slice." })
    router.push("/")
    router.refresh()
  }

  return (
    <div ref={containerRef} className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-xl border border-black/10 bg-white py-1.5 pr-2.5 pl-1.5 text-sm font-medium text-ink outline-none transition-colors hover:bg-black/[0.03] focus-visible:ring-3 focus-visible:ring-ring/40"
      >
        <UserAvatar name={name} image={image} />
        <span className="max-w-28 truncate">{name.split(" ")[0]}</span>
        <ChevronDown
          className={cn("size-3.5 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-[calc(100%+0.6rem)] right-0 w-64 overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-1.5 shadow-[0_24px_60px_-24px_rgba(23,19,16,0.4)]"
        >
          <div className="flex items-center gap-3 px-2.5 py-2.5">
            <UserAvatar name={name} image={image} className="size-10" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
              <p className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-brand">
                {roleLabel(role)}
              </p>
            </div>
          </div>

          <div className="my-1 h-px bg-black/[0.06]" />

          <Link
            href="/dashboard"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-black/[0.04] hover:text-ink"
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={onSignOut}
            disabled={signingOut}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-brand/[0.06] hover:text-brand disabled:opacity-60"
          >
            <LogOut className="size-4" />
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      )}
    </div>
  )
}
