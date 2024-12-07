import React from 'react'

import { Metadata } from 'next'
import EditProductContainer from '@/containers/products/edit'

export const metadata: Metadata = {
  title: 'Product Edit',
}

export default function EditProduct({ params }: { params: { id: string } }) {
  return <EditProductContainer id={params.id} />
}
