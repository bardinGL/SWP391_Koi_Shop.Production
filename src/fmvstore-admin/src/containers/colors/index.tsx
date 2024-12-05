'use client'
import PageTitle from '@/components/shared/PageTitle'
import ColorActions from './ColorActions'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'
import { useFetch } from '@/hooks/useFetch'
import { StorageService, VariationsService } from '@/client'
import TableSkeleton from '@/components/shared/TableSkeleton'
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
import { FileType, PenSquare, Trash2 } from 'lucide-react'
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
import { skeletonColumns } from './colors-table/columns'
import Image from 'next/image'
import { getImageUrlFromS3Key } from '@/helpers/getImageUrl'
import { GetProp, Modal, Upload, UploadFile, UploadProps } from 'antd'
import axios from 'axios'
import UploadColorImage from './UploadImage'

export default function ColorsContainer() {
  const [colorEditName, setColorEditName] = useState<string>('')
  const [colorImage, setColorImage] = useState<string | null>()

  const [selectedColor, setSelectedColor] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [colorQueries, setColorQueries] = useQueryStates(
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
    data: colors,
    loading: isLoading,
    error,
    refresh,
  } = useFetch(
    () =>
      VariationsService.variationsControllerGetAllVariationsAdmin({
        type: 'Color',
        keyword: colorQueries.keyword,
      }),
    {
      onSuccess: (data) => {
        console.log('data', data)
      },
    },
  )

  const { run: updateColor } = useFetch(
    VariationsService.variationsControllerUpdateVariation,
    {
      onSuccess: () => {
        refresh()
        toast({
          title: 'Color updated',
          variant: 'success',
        })
        setSelectedColor('')
        setColorEditName('')
      },
      onError: (error) => {
        if ((error as any).body.message === 'Color does not exist') {
          toast({
            title: 'Color does not exist',
            variant: 'destructive',
          })
        }
        if ((error as any).body.message === 'Color already exists') {
          toast({
            title: 'Color already exists',
            variant: 'destructive',
          })
        }
      },
    },
  )

  const { run: deleteColor } = useFetch(
    VariationsService.variationsControllerDeleteVariation,
    {
      onSuccess: () => {
        refresh()
        toast({
          title: 'Color deleted',
          variant: 'success',
        })
      },
      onError: (error) => {
        if ((error as any).body.message === 'Color does not exist') {
          toast({
            title: 'Color does not exist',
            variant: 'destructive',
          })
        }
      },
    },
  )

  const { run: createColor } = useFetch(
    VariationsService.variationsControllerCreateVariation,
    {
      onSuccess: () => {
        refresh()
        toast({
          title: 'Color created',
          variant: 'success',
        })
      },
      onError: (error) => {
        if ((error as any).body.message === 'Color already exists') {
          toast({
            title: 'Color already exists',
            variant: 'destructive',
          })
        }
      },
    },
  )

  const handleUpdateColor = async () => {
    if (!colorEditName || !colorImage) return
    updateColor({
      id: +selectedColor,
      type: 'Color',
      requestBody: {
        name: colorEditName,
        image: colorImage,
      },
    })
    refresh()
  }
  const renderMetadata = () => {
    if (isLoading)
      return <TableSkeleton perPage={perPage} columns={skeletonColumns} />

    if (error || !colors)
      return (
        <TableError
          errorMessage="Something went wrong while trying to fetch colors."
          refetch={() => refresh()}
        />
      )
  }

  const handleChangeValue = (e: any) => {
    setColorEditName(e.target.value)
  }

  const handleDelete = (id: number) => {
    deleteColor({
      id,
      type: 'Color',
    })
  }

  return (
    <section>
      <PageTitle>Colors</PageTitle>

      <ColorActions refresh={refresh} createColor={createColor} />
      <Card className="mb-5">
        <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
          <Input
            type="search"
            placeholder="Search by color name"
            className="h-12 md:basis-1/2"
            value={colorQueries.keyword}
            onChange={(e) => setColorQueries({ keyword: e.target.value })}
          />

          <div className="flex flex-wrap sm:flex-nowrap gap-4 md:basis-1/2">
            <Button onClick={() => refresh()} color="lg" className="flex-grow">
              Filter
            </Button>
            <Button
              onClick={() => {
                setColorQueries({ keyword: '' })
                refresh()
              }}
              color="lg"
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
            <TableHead className="w-[15%]">Image</TableHead>
            <TableHead className="w-[15%]">Name</TableHead>
            <TableHead className="w-[10%]">Created At</TableHead>
            <TableHead className="w-[10%]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {colors?.items!.map((color, index) => (
            <TableRow key={color.id}>
              <TableCell>{color.id}</TableCell>
              <TableCell>
                <Image
                  src={getImageUrlFromS3Key(color.image)}
                  alt={color.image}
                  width={32}
                  height={32}
                  className="size-8"
                />
              </TableCell>
              <TableCell>{color.value}</TableCell>
              <TableCell>
                {dayjs(color.createdAt).format('DD-MM-YYYY hh:mm:ss')}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => {
                          setIsOpen(true)
                          setSelectedColor(color.id.toString())
                          setColorEditName(color.value)
                          setColorImage(color.image)
                        }}
                        variant="ghost"
                        color="icon"
                        className="text-foreground"
                      >
                        <PenSquare className="color-5" />
                      </Button>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Edit Color</p>
                    </TooltipContent>
                  </Tooltip>

                  <AlertDialog>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            color="icon"
                            className="text-foreground"
                          >
                            <Trash2 className="color-5" />
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
                          onClick={() => handleDelete(color.id)}
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
            <SheetTitle>Edit Color</SheetTitle>
            <SheetDescription>
              {" Make changes to color here. Click save when you're done."}
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={colorEditName}
                className="col-span-3"
                onChange={handleChangeValue}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Image
              </Label>
              <UploadColorImage
                onChange={(value) => {
                  setColorImage(value)
                }}
                value={colorImage!}
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button onClick={handleUpdateColor} type="submit">
                Save changes
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </section>
  )
}
