'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FirmWithParsedData } from '@/types/firms'
import { deleteFirm } from '@/actions/firms'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Pencil, Trash2, Star } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface FirmsListProps {
  firms: FirmWithParsedData[]
}

export function FirmsList({ firms }: FirmsListProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [firmToDelete, setFirmToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (firmId: string) => {
    router.push(`/admin/firms/edit/${firmId}`)
  }

  const handleDeleteClick = (firmId: string) => {
    setFirmToDelete(firmId)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!firmToDelete) return

    setIsDeleting(true)
    const result = await deleteFirm(firmToDelete)

    if (result.success) {
      toast.success('Firm deleted successfully')
      setDeleteDialogOpen(false)
      setFirmToDelete(null)
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to delete firm')
    }

    setIsDeleting(false)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default'
      case 'draft':
        return 'secondary'
      case 'archived':
        return 'outline'
      default:
        return 'default'
    }
  }

  if (firms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-4">No firms found</p>
        <Button onClick={() => router.push('/admin/firms/new')}>
          Create Your First Firm
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border overflow-visible">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Highlights</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {firms.map((firm) => (
              <TableRow key={firm.id}>
                <TableCell>
                  {firm.logo_url ? (
                    <div className="relative h-10 w-10 rounded overflow-hidden bg-muted">
                      <Image
                        src={firm.logo_url}
                        alt={firm.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-xs font-medium">
                      {firm.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{firm.name}</div>
                    {firm.description && (
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {firm.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">
                      {firm.overall_rating?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(firm.status)}>
                    {firm.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {firm.is_featured && (
                      <Badge variant="secondary" className="text-xs">
                        Featured
                      </Badge>
                    )}
                    {firm.is_top_rated && (
                      <Badge variant="secondary" className="text-xs">
                        Top Rated
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(firm.id)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(firm.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the firm
              from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
