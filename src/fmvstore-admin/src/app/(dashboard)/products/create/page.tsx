import React from 'react'

import { Metadata } from 'next'
import CreateProductContainer from '@/containers/products/create'

export const metadata: Metadata = {
  title: 'Product Create',
}

export default function CreateProduct() {
  return <CreateProductContainer />
}
