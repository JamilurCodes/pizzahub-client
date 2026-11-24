"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react"
import { GoogleAuthButton } from "@/components/auth/google-auth-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth.client"

export default function SignInPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")
    const rememberMe = formData.get("rememberMe") === "on"

    if (!email || !password) {
      toast.add({
        type: "error",
        title: "Missing details",
        description: "Enter your email and password to continue.",
      })
      return
    }

    setSubmitting(true)

    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
      callbackURL: "/dashboard",
    })

    if (error) {
      setSubmitting(false)
      toast.add({
        type: "error",
        title: "Sign in failed",
        description: error.message ?? "Check your email and password and try again.",
      })
      return
    }

    toast.add({
      type: "success",
      title: "Welcome back",
      description: "You're signed in. Let's find you a slice.",
    })
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div>
      <div className="mb-7">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-brand-orange">
          Welcome back
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
          Sign in to PizzaHub
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Order your favourites, track deliveries and manage your restaurant from one place.
        </p>
      </div>

      <Card className="gap-0 rounded-3xl py-0 shadow-[0_30px_80px_-40px_rgba(23,19,16,0.35)] ring-1 ring-black/[0.06]">
        <CardContent className="p-6 sm:p-8">
          <GoogleAuthButton label="Continue with Google" />

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-black/[0.08]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                or sign in with email
              </span>
            </div>
          </div>

          <form onSubmit={onSubmit} noValidate>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="signin-email">Email</FieldLabel>
                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-11 pl-9"
                    required
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="signin-password">Password</FieldLabel>
                <div className="relative">
                  <LockKeyhole
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="signin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="h-11 pr-10 pl-9"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute top-1/2 right-2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </Field>

              <label className="flex w-fit items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  name="rememberMe"
                  defaultChecked
                  className="size-4 rounded border-input accent-brand"
                />
                Keep me signed in
              </label>

              <Button
                type="submit"
                disabled={submitting}
                className="mt-1 h-12 w-full rounded-xl text-sm font-semibold"
              >
                {submitting ? "Signing in…" : "Sign in"}
                {!submitting && <ArrowRight className="size-4" />}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to PizzaHub?{" "}
        <Link href="/sign-up" className="font-semibold text-brand underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
