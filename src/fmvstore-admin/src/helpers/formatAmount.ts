/**
 * Format the input amount string into a currency format (USD).
 * @param  amount - The amount to be formatted as a string.
 * @returns The formatted amount in USD currency format.
 */
export const formatAmount = (amount: string | number): string => {
  const amountInNumber =
    typeof amount === 'string' ? parseFloat(amount) : amount

  const formatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amountInNumber)

  return formatted
}
