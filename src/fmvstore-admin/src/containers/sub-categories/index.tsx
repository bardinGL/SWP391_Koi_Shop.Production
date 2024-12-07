'use client'
import PageTitle from '@/components/shared/PageTitle'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { useFetch } from '@/hooks/useFetch'
import {
  CategoriesService,
  CategoryIndexEntity,
  SubCategoryIndexEntity,
} from '@/client'
import TableSkeleton from '@/components/shared/TableSkeleton'
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
import { useEffect, useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import DataTable from '@/components/shared/DataTable'
import SubCategoryActions from './SubCategoryActions'
import { skeletonColumns } from './subcategories-table/columns'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function SubCategories() {
  const [subCategoryEditName, setSubCategoryEditName] = useState<string>('')
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<{
    label: string
    value: number
  }>()
  const [isOpen, setIsOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [subCategoryQueries, setSubCategoryQueries] = useQueryStates(
    {
      keyword: parseAsString.withDefault(''),
      category: parseAsString.withDefault(''),
      page: parseAsInteger.withDefault(1),
    },
    {
      clearOnDefault: true,
      shallow: false,
    },
  )

  const perPage = 10

  const {
    data: subCategories,
    loading,
    error,
    refresh,
  } = useFetch(() =>
    CategoriesService.categoriesControllerGetAllSubCategories({
      name: subCategoryQueries.keyword,
      page: subCategoryQueries.page,
      category: subCategoryQueries.category,
      pageSize: perPage,
    }),
  )

  const { data: mainCategories } = useFetch(() =>
    CategoriesService.categoriesControllerGetAllCategories({
      category: '',
    }),
  )

  useEffect(() => {
    refresh()
  }, [subCategoryQueries.page, refresh])

  const { run: updateCategory } = useFetch(
    CategoriesService.categoriesControllerUpdateCategory,
    {
      onSuccess: () => {
        refresh()
        toast({
          title: 'Sub category updated',
          variant: 'success',
        })
        setSelectedSubCategory('')
        setSubCategoryEditName('')
      },
      onError: (error) => {
        if ((error as any).body.message === 'Sub category does not exist') {
          toast({
            title: 'Sub category does not exist',
            variant: 'destructive',
          })
        }
        if ((error as any).body.message === 'Sub category already exists') {
          toast({
            title: 'Sub category already exists',
            variant: 'destructive',
          })
        }
      },
    },
  )

  const { run: deleteCategory } = useFetch(
    CategoriesService.categoriesControllerDeleteCategory,
    {
      onSuccess: () => {
        refresh()
        toast({
          title: 'Sub category deleted',
          variant: 'success',
        })
      },
      onError: (error) => {
        if ((error as any).body.message === 'Sub category does not exist') {
          toast({
            title: 'Sub category does not exist',
            variant: 'destructive',
          })
        }
      },
    },
  )

  const handleUpdateCategory = async () => {
    updateCategory({
      category: selectedSubCategory,
      requestBody: {
        name: subCategoryEditName,
        parentId: selectedCategory?.value!,
      },
    })
  }
  const renderMetadata = () => {
    if (loading)
      return <TableSkeleton perPage={perPage} columns={skeletonColumns} />

    if (error || !subCategories)
      return (
        <TableError
          errorMessage="Something went wrong while trying to fetch subCategories."
          refetch={() => refresh()}
        />
      )
  }

  const handleChangeValue = (e: any) => {
    setSubCategoryEditName(e.target.value)
  }

  const handleDelete = (category: string) => {
    deleteCategory({
      category,
    })
  }

  const columns: ColumnDef<SubCategoryIndexEntity>[] = [
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
      header: 'category',
      cell: ({ row }) => row.original.category,
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
                    setIsOpen(true)
                    setSelectedSubCategory(row.original.name)
                    setSubCategoryEditName(row.original.name)
                    const category = mainCategories?.items?.find(
                      (category) => category.name === row.original.category,
                    )
                    setSelectedCategory({
                      label: category?.name!,
                      value: category?.id!,
                    })
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
                    onClick={() => handleDelete(row.original.name)}
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
    data: subCategories?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })

  return (
    <section>
      <PageTitle>SubCategories</PageTitle>

      <SubCategoryActions
        refresh={refresh}
        categories={mainCategories?.items!}
      />
      <Card className="mb-5">
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
          <Input
            type="search"
            placeholder="Search by sub category name"
            className="h-12 md:basis-1/2"
            value={subCategoryQueries.keyword}
            onChange={(e) => setSubCategoryQueries({ keyword: e.target.value })}
          />

          <Select
            onValueChange={(value: string) => {
              setSubCategoryQueries({ category: value })
            }}
          >
            <SelectTrigger className="capitalize">
              <SelectValue
                placeholder="Select category"
                defaultValue={subCategoryQueries.category}
              />
            </SelectTrigger>

            <SelectContent>
              {mainCategories?.items.map((category) => (
                <SelectItem
                  value={category.name}
                  key={category.id}
                  className="capitalize"
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-wrap sm:flex-nowrap gap-4 md:basis-1/2">
            <Button onClick={() => refresh()} size="lg" className="flex-grow">
              Filter
            </Button>
            <Button
              onClick={() => {
                setSubCategoryQueries({
                  keyword: '',
                  category: '',
                  page: 1,
                })
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
      </Card>
      {renderMetadata()}
      <DataTable
        table={table}
        pagination={{
          current: subCategoryQueries.page,
          pages: Math.ceil(subCategories?.total! / perPage),
          perPage,
          items: subCategories?.total!,
          first: 1,
          last: Math.ceil(subCategories?.total! / perPage),
          next:
            subCategoryQueries.page + 1 >
            Math.ceil(subCategories?.total! / perPage)
              ? null
              : subCategoryQueries.page + 1,
          prev: subCategoryQueries.page - 1,
        }}
      />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild />
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Sub Category</SheetTitle>
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
                value={subCategoryEditName}
                className="col-span-3"
                onChange={handleChangeValue}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Category
              </Label>
              <Select
                onValueChange={(value: string) => {
                  const category = mainCategories?.items?.find(
                    (category) => category.name === value,
                  )
                  setSelectedCategory({
                    label: category?.name!,
                    value: category?.id!,
                  })
                }}
                defaultValue={selectedCategory?.label!}
              >
                <SelectTrigger className="capitalize col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {mainCategories?.items?.map((category) => (
                    <SelectItem
                      value={category.name}
                      key={category.id}
                      className="capitalize"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
