import { Metadata } from 'next'

import SizeContainer from '@/containers/sizes'

export const metadata: Metadata = {
  title: 'Sizes',
}

export default async function SizesPage() {
  return <SizeContainer />
}
