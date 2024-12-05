'use client'
import PageTitle from '@/components/shared/PageTitle'
import CategoryActions from './CategoryActions'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { useFetch } from '@/hooks/useFetch'
import TableSkeleton from '@/components/shared/TableSkeleton'
import { skeletonColumns } from './categories-table/columns'
import TableError from '@/components/shared/TableError'
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import Typography from '@/components/ui/typography'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { PenSquare, Trash2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import DataTable from '@/components/shared/DataTable'
import { categoryService } from '@/services/category'

export default function Categories() {
  const [categoryEditName, setCategoryEditName] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [categoryQueries, setCategoryQueries] = useQueryStates(
    {
      keyword: parseAsString.withDefault(''),
      page: parseAsInteger.withDefault(1),
    },
    {
      clearOnDefault: true,
      shallow: false,
    },
  )

  const perPage = 10

  const {
    data: categories,
    loading,
    error,
    refresh,
  } = useFetch(() => categoryService.getAllCategories())

  const { run: updateCategory } = useFetch(categoryService.updateCategory, {
    manual: true,
    onSuccess: () => {
      refresh()
      toast({
        title: 'Category updated',
        variant: 'success',
      })
      setSelectedCategory('')
      setCategoryEditName('')
    },
    onError: (error) => {
      if ((error as any).body.message === 'Category does not exist') {
        toast({
          title: 'Category does not exist',
          variant: 'destructive',
        })
      }
      if ((error as any).body.message === 'Category already exists') {
        toast({
          title: 'Category already exists',
          variant: 'destructive',
        })
      }
    },
  })

  const { run: deleteCategory } = useFetch(categoryService.deleteCategory, {
    manual: true,
    onSuccess: () => {
      refresh()
      toast({
        title: 'Category deleted',
        variant: 'success',
      })
    },
    onError: (error) => {
      if ((error as any).body.message === 'Category does not exist') {
        toast({
          title: 'Category does not exist',
          variant: 'destructive',
        })
      }
    },
  })

  const handleUpdateCategory = async () => {
    console.log('update')

    updateCategory(selectedCategory, categoryEditName)
  }
  const renderMetadata = () => {
    if (loading)
      return <TableSkeleton perPage={perPage} columns={skeletonColumns} />

    if (error || !categories)
      return (
        <TableError
          errorMessage="Something went wrong while trying to fetch categories."
          refetch={() => refresh()}
        />
      )
  }

  const handleChangeValue = (e: any) => {
    setCategoryEditName(e.target.value)
  }

  const handleDelete = (categoryId: string) => {
    deleteCategory(categoryId)
  }

  const columns: ColumnDef<any>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    {
      header: 'id',
      cell: ({ row }) => (
        <Typography className="uppercase">{Number(row.id) + 1}</Typography>
      ),
    },
    {
      header: 'name',
      cell: ({ row }) => row.original.name,
    },
    {
      header: 'actions',
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    console.log('row.original', row.original)
                    setIsOpen(true)
                    setSelectedCategory(row.original.id)
                    setCategoryEditName(row.original.name)
                  }}
                  variant="ghost"
                  size="icon"
                  className="text-foreground"
                >
                  <PenSquare className="size-5" />
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                <p>Edit Category</p>
              </TooltipContent>
            </Tooltip>

            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-foreground"
                    >
                      <Trash2 className="size-5" />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Delete Product</p>
                </TooltipContent>
              </Tooltip>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(row.original.id)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: categories || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })

  return (
    <section>
      <PageTitle>Categories</PageTitle>

      <CategoryActions refresh={refresh} />
      {/* <Card className="mb-5">
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
          <Input
            type="search"
            placeholder="Search by category name"
            className="h-12 md:basis-1/2"
            value={categoryQueries.keyword}
            onChange={(e) => setCategoryQueries({ keyword: e.target.value })}
          />

          <div className="flex flex-wrap sm:flex-nowrap gap-4 md:basis-1/2">
            <Button onClick={() => refresh()} size="lg" className="flex-grow">
              Filter
            </Button>
            <Button
              onClick={() => {
                setCategoryQueries({ keyword: '' })
                refresh()
              }}
              size="lg"
              variant="secondary"
              className="flex-grow"
            >
              Reset
            </Button>
          </div>
        </div>
      </Card> */}
      {renderMetadata()}
      <DataTable
        table={table}
        pagination={{
          current: categoryQueries.page,
          pages: Math.ceil(categories?.length! / perPage),
          perPage,
          items: categories?.length!,
          first: 1,
          last: Math.ceil(categories?.length! / perPage),
          next:
            categoryQueries.page + 1 > Math.ceil(categories?.length! / perPage)
              ? null
              : categoryQueries.page + 1,
          prev: categoryQueries.page - 1,
        }}
      />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild />
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>
              {" Make changes to category here. Click save when you're done."}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={categoryEditName}
                className="col-span-3"
                onChange={handleChangeValue}
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button onClick={handleUpdateCategory} type="submit">
                Save changes
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </section>
  )
}
