'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { revalidatePath } from 'next/cache'

export function DatabaseManagement() {
  const [isClearing, setIsClearing] = useState(false)

  const handleClearCache = async () => {
    setIsClearing(true)

    try {
      const response = await fetch('/api/cache/clear', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Cache cleared successfully')
      } else {
        toast.error(data.error || 'Failed to clear cache')
      }
    } catch (error) {
      toast.error('Failed to clear cache')
    } finally {
      setIsClearing(false)
    }
  }

  const handleCreateBackup = () => {
    toast.info('Backup functionality coming soon')
  }

  const handleRestoreBackup = () => {
    toast.info('Restore functionality coming soon')
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-muted">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Database Size</span>
          <span className="text-muted-foreground">~12.5 MB</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Total Records</span>
          <span className="text-muted-foreground">1,247</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Last Backup</span>
          <span className="text-muted-foreground">Never</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={handleCreateBackup}>
          Create Backup
        </Button>
        <Button variant="outline" onClick={handleRestoreBackup}>
          Restore Backup
        </Button>
        <Button
          variant="outline"
          className="text-destructive hover:text-destructive"
          onClick={handleClearCache}
          disabled={isClearing}
        >
          {isClearing ? 'Clearing...' : 'Clear Cache'}
        </Button>
      </div>
    </div>
  )
}
