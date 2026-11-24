"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Pizza,
  Store,
  UserRound,
} from "lucide-react"
import { GoogleAuthButton } from "@/components/auth/google-auth-button"
import { PasswordChecklist } from "@/components/auth/password-checklist"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth.client"
import { isPasswordValid } from "@/lib/password"
import { cn } from "@/lib/utils"

type Role = "customer" | "vendor"

const roles: Array<{
  value: Role
  label: string
  description: string
  icon: typeof Pizza
}> = [
  {
    value: "customer",
    label: "Pizza lover",
    description: "Browse menus and order from local restaurants.",
    icon: Pizza,
  },
  {
    value: "vendor",
    label: "Restaurant owner",
    description: "Publish your menu and manage incoming orders.",
    icon: Store,
  },
]

export default function SignUpPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>("customer")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const image = String(formData.get("image") ?? "").trim()
    const businessName = String(formData.get("businessName") ?? "").trim()

    if (name.length < 2) {
      toast.add({
        type: "error",
        title: "Add your name",
        description: "Enter your full name so vendors know who ordered.",
      })
      return
    }

    if (!isPasswordValid(password)) {
      toast.add({
        type: "error",
        title: "Password needs work",
        description: "Use at least 6 characters with one uppercase and one lowercase letter.",
      })
      return
    }

    if (role === "vendor" && businessName.length < 2) {
      toast.add({
        type: "error",
        title: "Add your restaurant name",
        description: "Customers use this to recognise your kitchen.",
      })
      return
    }

    setSubmitting(true)

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      image: image || undefined,
      role,
      businessName: role === "vendor" ? businessName : undefined,
      callbackURL: "/dashboard",
    })

    if (error) {
      setSubmitting(false)
      toast.add({
        type: "error",
        title: "Could not create your account",
        description: error.message ?? "Please check your details and try again.",
      })
      return
    }

    toast.add({
      type: "success",
      title: "Welcome to PizzaHub",
      description: "Your account is ready. Let's get you started.",
    })
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div>
      <div className="mb-7">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-brand-orange">
          Join the table
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
          Create your PizzaHub account
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Order from local kitchens, or bring your own restaurant to the neighbourhood.
        </p>
      </div>

      <Card className="gap-0 rounded-3xl py-0 shadow-[0_30px_80px_-40px_rgba(23,19,16,0.35)] ring-1 ring-black/[0.06]">
        <CardContent className="p-6 sm:p-8">
          <GoogleAuthButton label="Sign up with Google" />

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-black/[0.08]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                or sign up with email
              </span>
            </div>
          </div>

          <form onSubmit={onSubmit} noValidate>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="signup-name">Full name</FieldLabel>
                <div className="relative">
                  <UserRound
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="signup-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Ayesha Rahman"
                    className="h-11 pl-9"
                    required
                  />
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="signup-email"
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
                <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                <div className="relative">
                  <LockKeyhole
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
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
                <PasswordChecklist password={password} />
              </Field>

              <Field>
                <FieldLabel htmlFor="signup-image">
                  Profile photo{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Input
                  id="signup-image"
                  name="image"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  className="h-11"
                />
                <FieldDescription>Paste a link to a photo, or leave it blank.</FieldDescription>
              </Field>

              <Field>
                <FieldLabel>I&apos;m joining as</FieldLabel>
                <div role="radiogroup" aria-label="Account type" className="grid gap-2.5">
                  {roles.map((option) => {
                    const Icon = option.icon
                    const selected = role === option.value

                    return (
                      <label
                        key={option.value}
                        className={cn(
                          "relative flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/40",
                          selected
                            ? "border-brand bg-brand/[0.04] ring-2 ring-brand/15"
                            : "border-black/10 hover:border-black/20 hover:bg-black/[0.02]",
                        )}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={option.value}
                          checked={selected}
                          onChange={() => setRole(option.value)}
                          className="sr-only"
                        />
                        <span
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                            selected ? "bg-brand text-white" : "bg-black/[0.04] text-ink/60",
                          )}
                        >
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold">{option.label}</span>
                          <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                            {option.description}
                          </span>
                        </span>
                        {selected && <Check className="ml-auto size-4 shrink-0 text-brand" />}
                      </label>
                    )
                  })}
                </div>
              </Field>

              {role === "vendor" && (
                <Field>
                  <FieldLabel htmlFor="signup-business">Restaurant name</FieldLabel>
                  <div className="relative">
                    <Store
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="signup-business"
                      name="businessName"
                      type="text"
                      autoComplete="organization"
                      placeholder="Slice of Naples"
                      className="h-11 pl-9"
                      required
                    />
                  </div>
                  <FieldDescription>You can update this from your dashboard later.</FieldDescription>
                </Field>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="mt-1 h-12 w-full rounded-xl text-sm font-semibold"
              >
                {submitting ? "Creating account…" : "Create account"}
                {!submitting && <ArrowRight className="size-4" />}
              </Button>

              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                By joining, you agree to our{" "}
                <span className="font-medium text-ink/70">Terms of Service</span> and{" "}
                <span className="font-medium text-ink/70">Privacy Policy</span>.
              </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-brand underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
