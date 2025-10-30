'use client'

import { useEffect, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { signUp, signInWithGoogle } from '@/actions/auth'
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
import { Separator } from '@/components/ui/separator'
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
          Creating account...
        </>
      ) : (
        'Create Account'
      )}
    </Button>
  )
}

function GoogleButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-12 text-base font-medium glass hover-glow transition-all"
      disabled={pending}
      onClick={() => signInWithGoogle()}
    >
      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      Continue with Google
    </Button>
  )
}

export default function SignUpPage() {
  const [state, formAction] = useActionState(signUp, { error: '', success: '' })
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
      <CardHeader className="space-y-2 pb-6">
        <CardTitle className="text-3xl font-bold gradient-text">Create Account</CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Start your 3-day free trial to analyze trading charts with AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="John Doe"
              required
              autoComplete="name"
              className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
            />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
            />
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters long
            </p>
          </div>

          <SubmitButton />
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="bg-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleButton />

        <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm backdrop-blur-sm">
          <p className="font-semibold mb-1 text-primary">3-Day Free Trial</p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            Your trial starts immediately. Cancel anytime during the trial
            period to avoid charges.
          </p>
        </div>

        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-primary hover:text-accent transition-colors font-medium">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary hover:text-accent transition-colors font-medium">
            Privacy Policy
          </Link>
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-4">
        <div className="text-sm text-muted-foreground text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:text-accent transition-colors font-medium">
            Sign In
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
