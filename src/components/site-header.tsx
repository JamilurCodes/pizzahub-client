"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, Menu, X } from "lucide-react"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Browse menu" },
  { href: "/orders", label: "My orders" },
] as const

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteHeader() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [menuOpen])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-black/[0.06] bg-white/95 backdrop-blur-md transition-shadow duration-300",
        scrolled && "shadow-[0_10px_30px_-18px_rgba(23,19,16,0.45)]",
      )}
    >
      <div className="mx-auto flex h-20 max-w-370 items-center gap-4 px-5 sm:px-8 lg:h-24 lg:gap-8 lg:px-10">
        <Link
          href="/"
          aria-label="PizzaHub home"
          className="shrink-0 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
        >
          <Logo />
        </Link>

        <nav aria-label="Main navigation" className="hidden flex-1 justify-center gap-8 lg:flex xl:gap-12">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-2 text-[0.95rem] font-medium text-ink/70 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 hover:text-ink hover:after:scale-x-100",
                  active && "text-ink after:scale-x-100",
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-4 lg:gap-6">
          <Link
            href="/sign-in"
            className="hidden rounded-md py-2 text-[0.95rem] font-medium text-ink/75 outline-none transition-colors hover:text-ink focus-visible:ring-3 focus-visible:ring-ring/40 sm:inline-flex"
          >
            Sign in
          </Link>

          <Link
            href="/sign-up"
            className="group hidden h-12 items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white shadow-[0_12px_24px_-12px_rgba(198,58,46,0.8)] outline-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_16px_30px_-12px_rgba(198,58,46,0.85)] focus-visible:ring-3 focus-visible:ring-ring/40 sm:inline-flex lg:h-[3.4rem] lg:px-6 lg:text-[0.95rem]"
          >
            Join PizzaHub
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="inline-flex size-11 items-center justify-center rounded-xl border border-black/10 bg-white text-ink outline-none transition-colors hover:bg-black/4 focus-visible:ring-3 focus-visible:ring-ring/40 lg:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-navigation"
          className="animate-in border-t border-black/[0.06] bg-white fade-in slide-in-from-top-2 duration-200 lg:hidden"
        >
          <nav aria-label="Mobile navigation" className="mx-auto max-w-370 px-5 py-4 sm:px-8">
            <ul className="flex flex-col">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.href)

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between border-b border-black/[0.06] py-3.5 text-base font-medium text-ink/75 transition-colors hover:text-ink",
                        active && "text-brand",
                      )}
                    >
                      {link.label}
                      <ArrowRight className="size-4 opacity-40" />
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className="mt-4 flex flex-col gap-2 pb-2">
              <Link
                href="/sign-up"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                Join PizzaHub
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/sign-in"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-black/10 text-sm font-semibold text-ink transition-colors hover:bg-black/4"
              >
                Sign in
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
