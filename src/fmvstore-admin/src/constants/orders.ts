import { PaymentMethodEnum } from '@/client'

export enum OrderStatusEnum {
  PENDING = 'PENDING',
  SHIPPING = 'SHIPPING',
  REJECTED = 'REJECTED',
}

export const ORDER_STATUS_OPTIONS = [
  {
    label: 'Pending',
    value: OrderStatusEnum.PENDING,
  },
  {
    label: 'Shipping',
    value: OrderStatusEnum.SHIPPING,
  },
  {
    label: 'Rejected',
    value: OrderStatusEnum.REJECTED,
  },
]

export const ORDER_METHODS = [
  {
    label: 'Cash',
    value: PaymentMethodEnum.CASH,
  },
  {
    label: 'Card',
    value: PaymentMethodEnum.CARD,
  },
  {
    label: 'Credit',
    value: PaymentMethodEnum.STRIPE,
  },
]

export const statusOrder = {
  [OrderStatusEnum.PENDING]: 1,
  [OrderStatusEnum.SHIPPING]: 2,
  [OrderStatusEnum.REJECTED]: 3,
}

export const StatisticOptions = [
  {
    text: 'Daily',
    value: 'date',
  },
  {
    text: 'Monthly',
    value: 'month',
  },
  {
    text: 'Annually',
    value: 'year',
  },
]
