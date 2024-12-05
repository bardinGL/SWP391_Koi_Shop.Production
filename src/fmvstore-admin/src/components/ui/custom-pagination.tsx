import { PaginationProps } from '@/types/pagination'
import Typography from './typography'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { getPaginationButtons } from '@/helpers/getPaginationButtons'
export default function CustomPagination(
  pagination: PaginationProps & {
    onChange: (page: number) => void
  },
) {
  const paginationButtons = getPaginationButtons({
    totalPages: pagination?.pages!,
    currentPage: pagination?.current!,
  })
  return (
    <>
      {pagination && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-3.5 p-4 text-muted-foreground">
          <Typography className="text-sm flex-shrink-0 uppercase font-medium">
            Showing{' '}
            {Math.max((pagination?.current - 1) * pagination?.perPage + 1, 1)}{' '}
            to{' '}
            {Math.min(
              pagination?.current * pagination?.perPage,
              pagination?.items,
            )}{' '}
            of {pagination?.items}
          </Typography>

          <Pagination>
            <PaginationContent className="flex-wrap">
              <PaginationItem>
                <PaginationPrevious
                  href={`?page=${pagination?.prev}`}
                  disabled={!pagination?.prev}
                />
              </PaginationItem>

              {paginationButtons.map((page, index) => (
                <PaginationItem key={`page-${index}`}>
                  {page === '...' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e: any) => {
                        e.preventDefault()
                        pagination.onChange(page)
                      }}
                      isActive={page === pagination?.current}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href={`?page=${pagination?.next}`}
                  disabled={!pagination?.next}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  )
}
