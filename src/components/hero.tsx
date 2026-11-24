import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  const linkClassName =
    "group inline-flex h-14 items-center gap-2.5 rounded-xl bg-brand px-7 text-base font-semibold text-white shadow-[0_18px_36px_-16px_rgba(198,58,46,0.9)] outline-none transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_22px_44px_-16px_rgba(198,58,46,0.95)] focus-visible:ring-3 focus-visible:ring-white/50";

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      {/* Photo: Unsplash — https://unsplash.com/photos/1506354666786-959d6d497f1a */}
      <Image
        src="/images/hero-pizza.jpg"
        alt="A freshly baked pizza on a dark wooden table"
        fill
        loading="eager"
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/55 to-black/15" />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/5 to-black/25" />

      <div className="relative mx-auto flex min-h-136 max-w-370 items-center px-5 py-20 sm:min-h-152 sm:px-8 sm:py-24 lg:min-h-[min(calc(100svh-6rem),56rem)] lg:px-10 lg:py-28">
        <div className="max-w-184">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-brand-orange">
            Pizza, thoughtfully sourced
          </p>

          <h1 className="mt-5 text-balance text-[clamp(2.75rem,7.2vw,6.25rem)] font-medium leading-[0.94] tracking-[-0.045em] text-white">
            Your next favourite pizza
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
            Wood-fired bases, slow-risen dough and toppings we&apos;d happily eat straight
            from the oven — delivered hot to your door.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/menu"
              className={linkClassName}
            >
              Explore Pizza Menu
              <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            <span className="text-sm font-medium text-white/55">
              Free delivery over $30
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
