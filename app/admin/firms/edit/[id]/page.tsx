import { notFound } from 'next/navigation'
import { getFirmById } from '@/actions/firms'
import { FirmForm } from '@/components/admin/firm-form'

export const metadata = {
  title: 'Edit Firm | Admin',
  description: 'Edit broker or firm details',
}

interface EditFirmPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditFirmPage({ params }: EditFirmPageProps) {
  const { id } = await params
  const { firm, error } = await getFirmById(id)

  if (error || !firm) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Firm</h1>
        <p className="text-muted-foreground mt-2">
          Update details for <strong>{firm.name}</strong>
        </p>
      </div>

      <FirmForm firm={firm} isEditing />
    </div>
  )
}
