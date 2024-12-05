'use client'
import { ProductItemIndexAdminEntity } from '@/client'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import Typography from '@/components/ui/typography'
import { ProductBadgeVariants } from '@/constants/badge'
import { getImageUrlFromS3Key } from '@/helpers/getImageUrl'
import Image from 'next/image'

type ProductItemsRowProps = {
  data?: ProductItemIndexAdminEntity[]
}

export default function ProductItemRow({ data = [] }: ProductItemsRowProps) {
  return (
    <>
      {data.length > 0 ? (
        data.map((item) => (
          <TableRow key={item.id} className="">
            <TableCell className="text-[#cccccc]">{item.id}</TableCell>
            <TableCell className="font-medium">
              <div className="flex gap-2 items-center">
                {item.images.map((img) => (
                  <Image
                    key={img.image}
                    src={getImageUrlFromS3Key(img.image)}
                    alt={img.image}
                    width={32}
                    height={32}
                    className="size-8 rounded-full"
                  />
                ))}
              </div>
            </TableCell>
            <TableCell>{item.color}</TableCell>
            <TableCell>{item.size}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>{item.price}</TableCell>
            <TableCell>{item.discount}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>
              <Badge
                variant={
                  ProductBadgeVariants[
                    item.isAvailable ? 'selling' : 'out-of-stock'
                  ]
                }
                className="flex-shrink-0 text-xs"
              >
                {item.isAvailable ? 'Selling' : 'Out of stock'}
              </Badge>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={9}>
            <Typography>No items found</Typography>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}