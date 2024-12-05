'use client'
import PageTitle from '@/components/shared/PageTitle'
import SizeActions from './SizeActions'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { useFetch } from '@/hooks/useFetch'
import { VariationsService } from '@/client'
import TableSkeleton from '@/components/shared/TableSkeleton'
import { skeletonColumns } from './sizes-table/columns'
import TableError from '@/components/shared/TableError'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import dayjs from 'dayjs'

export default function SizesContainer() {
  const [sizeEditName, setSizeEditName] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [sizeQueries, setSizeQueries] = useQueryStates(
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
    data: sizes,
    loading,
    error,
    refresh,
  } = useFetch(
    () =>
      VariationsService.variationsControllerGetAllVariationsAdmin({
        type: 'Size',
        keyword: sizeQueries.keyword,
      }),
    {
      onSuccess: (data) => {
        console.log('data', data)
      },
    },
  )

  const { run: updateSize } = useFetch(
    VariationsService.variationsControllerUpdateVariation,
    {
      onSuccess: () => {
        refresh()
        toast({
          title: 'Size updated',
          variant: 'success',
        })
        setSelectedSize('')
        setSizeEditName('')
      },
      onError: (error) => {
        if ((error as any).body.message === 'Size does not exist') {
          toast({
            title: 'Size does not exist',
            variant: 'destructive',
          })
        }
        if ((error as any).body.message === 'Size already exists') {
          toast({
            title: 'Size already exists',
            variant: 'destructive',
          })
        }
      },
    },
  )

  const { run: deleteSize } = useFetch(
    VariationsService.variationsControllerDeleteVariation,
    {
      onSuccess: () => {
        refresh()
        toast({
          title: 'Size deleted',
          variant: 'success',
        })
      },
      onError: (error) => {
        if ((error as any).body.message === 'Size does not exist') {
          toast({
            title: 'Size does not exist',
            variant: 'destructive',
          })
        }
      },
    },
  )

  const { run: createSize } = useFetch(
    VariationsService.variationsControllerCreateVariation,
    {
      onSuccess: () => {
        refresh()
        toast({
          title: 'Size created',
          variant: 'success',
        })
      },
      onError: (error) => {
        if ((error as any).body.message === 'Size already exists') {
          toast({
            title: 'Size already exists',
            variant: 'destructive',
          })
        }
      },
    },
  )

  const handleUpdateSize = async () => {
    console.log('sdv', {
      id: +selectedSize,
      type: 'Size',
      requestBody: {
        name: sizeEditName,
        image: undefined,
      },
    })
    updateSize({
      id: +selectedSize,
      type: 'Size',
      requestBody: {
        name: sizeEditName,
        image: undefined,
      },
    })
  }
  const renderMetadata = () => {
    if (loading)
      return <TableSkeleton perPage={perPage} columns={skeletonColumns} />

    if (error || !sizes)
      return (
        <TableError
          errorMessage="Something went wrong while trying to fetch sizes."
          refetch={() => refresh()}
        />
      )
  }

  const handleChangeValue = (e: any) => {
    setSizeEditName(e.target.value)
  }

  const handleDelete = (id: number) => {
    deleteSize({
      id,
      type: 'Size',
    })
  }

  return (
    <section>
      <PageTitle>Sizes</PageTitle>

      <SizeActions refresh={refresh} createSize={createSize} />
      <Card className="mb-5">
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
          <Input
            type="search"
            placeholder="Search by size name"
            className="h-12 md:basis-1/2"
            value={sizeQueries.keyword}
            onChange={(e) => setSizeQueries({ keyword: e.target.value })}
          />

          <div className="flex flex-wrap sm:flex-nowrap gap-4 md:basis-1/2">
            <Button onClick={() => refresh()} size="lg" className="flex-grow">
              Filter
            </Button>
            <Button
              onClick={() => {
                setSizeQueries({ keyword: '' })
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[15%]">Id</TableHead>
            <TableHead className="w-[15%]">Name</TableHead>
            <TableHead className="w-[10%]">Created At</TableHead>
            <TableHead className="w-[10%]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sizes?.items!.map((size, index) => (
            <TableRow key={size.id}>
              <TableCell>{size.id}</TableCell>
              <TableCell>{size.value}</TableCell>
              <TableCell>
                {dayjs(size.createdAt).format('DD-MM-YYYY hh:mm:ss')}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => {
                          setIsOpen(true)
                          setSelectedSize(size.id.toString())
                        }}
                        variant="ghost"
                        size="icon"
                        className="text-foreground"
                      >
                        <PenSquare className="size-5" />
                      </Button>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Edit Size</p>
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
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(size.id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild />
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Size</SheetTitle>
            <SheetDescription>
              {" Make changes to size here. Click save when you're done."}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={sizeEditName}
                className="col-span-3"
                onChange={handleChangeValue}
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button onClick={handleUpdateSize} type="submit">
                Save changes
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </section>
  )
}
