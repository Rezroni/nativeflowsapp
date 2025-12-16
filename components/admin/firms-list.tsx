'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FirmWithParsedData } from '@/types/firms'
import { deleteFirm, duplicateFirm } from '@/actions/firms'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { MoreHorizontal, Pencil, Trash2, Copy, Eye, Star } from 'lucide-react'
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
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null)

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

  const handleDuplicate = async (id: string) => {
    setIsDuplicating(id)
    const result = await duplicateFirm(id)

    if (result.success) {
      toast.success('Firm duplicated successfully')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to duplicate firm')
    }

    setIsDuplicating(null)
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
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-[10000]">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => router.push(`/firms/${firm.slug}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Public Page
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => router.push(`/admin/firms/edit/${firm.id}`)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDuplicate(firm.id)}
                        disabled={isDuplicating === firm.id}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        {isDuplicating === firm.id ? 'Duplicating...' : 'Duplicate'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setFirmToDelete(firm.id)
                          setDeleteDialogOpen(true)
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
