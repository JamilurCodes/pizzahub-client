import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid flex-1 lg:grid-cols-[1.02fr_0.98fr]">
      <div className="flex items-center justify-center px-5 py-12 sm:px-8 lg:min-h-[calc(100svh-6rem)] lg:py-16">
        <div className="w-full max-w-[27rem]">{children}</div>
      </div>

      <aside className="relative hidden min-h-[calc(100svh-6rem)] overflow-hidden lg:block">
        <Image
          src="/images/hero-pizza.jpg"
          alt=""
          fill
          loading="eager"
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/30" />
        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-md text-sm font-medium text-white/70 outline-none transition-colors hover:text-white focus-visible:ring-3 focus-visible:ring-white/40"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>

          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-brand-orange">
              Pizza, thoughtfully sourced
            </p>
            <p className="mt-4 max-w-md text-4xl font-medium leading-[1.05] tracking-[-0.035em] text-white xl:text-5xl">
              Good dough.
              <br />
              Better company.
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              Slow-risen bases, generous toppings and a seat at the table for everyone.
              Sign in and get your next favourite pizza on the way.
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}
