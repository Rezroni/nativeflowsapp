import { FirmForm } from '@/components/admin/firm-form'

export const metadata = {
  title: 'Add New Firm | Admin',
  description: 'Add a new broker or firm to the comparison page',
}

export default function NewFirmPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Firm</h1>
        <p className="text-muted-foreground mt-2">
          Create a new broker or firm for the comparison page
        </p>
      </div>

      <FirmForm />
    </div>
  )
}
