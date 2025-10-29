'use client'

import { useEffect, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { resetPassword } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="w-full h-12 text-base font-medium hover-glow transition-all"
      disabled={pending}
    >
      {pending ? (
        <>
          <svg
            className="mr-2 h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Sending...
        </>
      ) : (
        'Send Reset Link'
      )}
    </Button>
  )
}

export default function ResetPasswordPage() {
  const [state, formAction] = useActionState(resetPassword, {
    error: '',
    success: '',
  })
  const { toast } = useToast()

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      })
    }
    if (state.success) {
      toast({
        title: 'Success',
        description: state.success,
      })
    }
  }, [state, toast])

  return (
    <Card className="glass-card border-2 hover-glow">
      <CardHeader className="space-y-2 pb-8">
        <CardTitle className="text-3xl font-bold gradient-text">Reset Password</CardTitle>
        <CardDescription className="text-base text-muted-foreground leading-relaxed">
          Enter your email address and we&apos;ll send you a link to reset your
          password
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
            />
          </div>

          <SubmitButton />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-6">
        <div className="text-sm text-muted-foreground text-center">
          Remember your password?{' '}
          <Link href="/login" className="text-primary hover:text-accent transition-colors font-medium">
            Sign In
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
