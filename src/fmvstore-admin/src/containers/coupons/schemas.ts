import { z } from 'zod'

export const promotionFormSchema = z.object({
  code: z.string().min(1, 'Please enter coupon code'),
  discountPercentage: z.string().min(1, 'Please enter discount'),
  startDate: z.string(),
  endDate: z.string(),
})
