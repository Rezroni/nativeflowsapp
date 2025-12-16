import { Suspense } from 'react'
import Link from 'next/link'
import { getAllFirms } from '@/actions/firms'
import { FirmsList } from '@/components/admin/firms-list'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus } from 'lucide-react'

export const metadata = {
  title: 'Firms Management | Admin',
  description: 'Manage broker and firm comparisons',
}

function FirmsListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  )
}

async function FirmsContent() {
  const { firms, total } = await getAllFirms({ status: 'all', sort_by: 'display_order' })

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Firms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {firms.filter((f) => f.status === 'published').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {firms.filter((f) => f.is_featured).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Rated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {firms.filter((f) => f.is_top_rated).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Firms List */}
      <FirmsList firms={firms} />
    </div>
  )
}

export default function FirmsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Firms Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage broker and firm comparisons for the comparison page
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/firms/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Firm
          </Link>
        </Button>
      </div>

      <Suspense fallback={<FirmsListSkeleton />}>
        <FirmsContent />
      </Suspense>
    </div>
  )
}
