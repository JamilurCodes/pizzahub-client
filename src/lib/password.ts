export const passwordChecks = [
  {
    label: "At least 6 characters",
    test: (password: string) => password.length >= 6,
  },
  {
    label: "One uppercase letter",
    test: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: "One lowercase letter",
    test: (password: string) => /[a-z]/.test(password),
  },
] as const

export function isPasswordValid(password: string) {
  return passwordChecks.every((check) => check.test(password))
}
