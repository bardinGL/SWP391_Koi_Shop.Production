import { Metadata } from 'next'

import ColorsContainer from '@/containers/colors'

export const metadata: Metadata = {
  title: 'Colors',
}

export default async function ColorsPage() {
  return <ColorsContainer />
}
