"use client"

import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth.client"

export function GoogleAuthButton({ label }: { label: string }) {
  const [loading, setLoading] = useState(false)

  const onClick = async () => {
    setLoading(true)

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    })

    if (error) {
      setLoading(false)
      toast.add({
        type: "error",
        title: "Google sign-in failed",
        description: error.message ?? "Please try again in a moment.",
      })
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={onClick}
      disabled={loading}
      className="h-12 w-full rounded-xl border-black/10 bg-white text-sm font-semibold shadow-none hover:bg-black/[0.03]"
    >
      <FcGoogle className="size-5" />
      {loading ? "Connecting…" : label}
    </Button>
  )
}
