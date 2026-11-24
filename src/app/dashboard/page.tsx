import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { auth } from "@/lib/auth"

const roleCopy: Record<string, string> = {
  vendor:
    "Your vendor dashboard is next: publish menu items, manage incoming orders and track your subscription.",
  admin:
    "Your admin dashboard is next: manage users, review menu submissions and monitor transactions.",
  customer:
    "Your customer dashboard is next: track orders, save favourites and reorder your usual in a tap.",
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/sign-in")
  }

  const { user } = session
  const role = typeof user.role === "string" ? user.role : "customer"
  const firstName = user.name.split(/\s+/)[0] || "there"

  return (
    <section className="mx-auto w-full max-w-370 px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
      <div className="max-w-2xl">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-brand-orange">
          {role === "vendor" ? "Vendor dashboard" : role === "admin" ? "Admin dashboard" : "Customer dashboard"}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
          Welcome back, {firstName}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {roleCopy[role] ?? roleCopy.customer}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/menu"
            className={buttonVariants({ className: "h-12 rounded-xl px-6 text-sm font-semibold" })}
          >
            Browse menu
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/"
            className={buttonVariants({
              variant: "outline",
              className: "h-12 rounded-xl px-6 text-sm font-semibold",
            })}
          >
            Back home
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Signed in as <span className="font-medium text-ink">{user.email}</span>
        </p>
      </div>
    </section>
  )
}
