'use client'

import * as React from 'react'
import Image from 'next/image'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ZoomIn, PenSquare, Trash2 } from 'lucide-react'
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
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ProductBadgeVariants } from '@/constants/badge'
import Typography from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { ProductIndexAdminEntity } from '@/client'
import ProductItemRow from './ProductItemRow'
import { getImageUrlFromS3Key } from '@/helpers/getImageUrl'

type ProductsTableProps = {
  data: any[]
  deleteProduct: (id: string) => void
}

export default function ProductsTable({
  data,
  deleteProduct,
}: ProductsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((product) => (
          <Collapsible key={product.id} asChild>
            <>
              <CollapsibleTrigger asChild>
                <TableRow className="!appearance-none cursor-pointer hover:bg-gray-100 transition-colors duration-200 ease-in-out">
                  <TableCell>{product.id}</TableCell>
                  <TableCell className="font-medium">
                    <Image
                      src={product.imageUrl}
                      alt={product.imageUrl}
                      width={32}
                      height={32}
                      className="size-8 rounded-full"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <Typography className="capitalize block truncate">
                        {product.name}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    {product.status == 1 ? (
                      <Badge
                        variant={ProductBadgeVariants['selling']}
                        className="flex-shrink-0 text-xs"
                      >
                        Selling
                      </Badge>
                    ) : (
                      <Badge
                        variant={ProductBadgeVariants['out-of-stock']}
                        className="flex-shrink-0 text-xs"
                      >
                        Out of Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/products/edit/${product.id}`}
                          className="text-foreground"
                        >
                          <PenSquare className="size-5" />
                        </Link>
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>Edit Product</p>
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
                            onClick={() => deleteProduct(product.id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              </CollapsibleTrigger>
              <CollapsibleContent asChild>
                <ProductItemRow data={product.items} />
              </CollapsibleContent>
            </>
          </Collapsible>
        ))}
      </TableBody>
    </Table>
  )
}
