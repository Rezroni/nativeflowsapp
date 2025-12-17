import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST() {
  try {
    // Revalidate all common paths
    revalidatePath('/', 'layout')
    revalidatePath('/blog', 'page')
    revalidatePath('/firms', 'page')
    revalidatePath('/dashboard', 'layout')
    revalidatePath('/admin', 'layout')

    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully',
    })
  } catch (error) {
    console.error('Error clearing cache:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to clear cache',
      },
      { status: 500 }
    )
  }
}
