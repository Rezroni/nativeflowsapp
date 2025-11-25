import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppNav } from '@/components/layout/app-nav'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { PushPermissionPrompt } from '@/components/notifications/push-permission-prompt'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <>
      <AppNav />
      <main className="pb-20 md:pb-0">{children}</main>
      <MobileBottomNav />
      <PushPermissionPrompt />
    </>
  )
}
