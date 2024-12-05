'use client'

import { Pie } from 'react-chartjs-2'
import { useTheme } from 'next-themes'

import { Card, CardContent } from '@/components/ui/card' 
import { Skeleton } from '@/components/ui/skeleton'
import Typography from '@/components/ui/typography'
import useGetMountStatus from '@/hooks/useGetMountStatus'

export default function BestSellers() {
  const mounted = useGetMountStatus()
  const { theme } = useTheme()

  return (
    <Card>
      <Typography variant="h3" className="mb-4">
        Sản phẩm bán chạy
      </Typography>

      <CardContent className="pb-2">
        <div className="relative h-[18.625rem]">
          {mounted ? (
            <Pie
              data={{
                labels: [
                  'Bắp mỹ',
                  'Đậu hủ', 
                  'Kim chi chichi',
                  'Nấm kim châm',
                  'Rau cải thìa'
                ],
                datasets: [
                  {
                    label: 'Số đơn hàng',
                    data: [270, 238, 203, 153, 125],
                    backgroundColor: [
                      'rgb(34, 197, 94)', // green
                      'rgb(59, 130, 246)', // blue
                      'rgb(249, 115, 22)', // orange
                      'rgb(99, 102, 241)', // indigo
                      'rgb(236, 72, 153)' // pink
                    ],
                    borderColor:
                      theme === 'light' ? 'rgb(255,255,255)' : 'rgb(23,23,23)',
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20
                    }
                  }
                }
              }}
            />
          ) : (
            <Skeleton className="size-full" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}