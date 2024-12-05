import { Metadata } from 'next'

import SubCategories from '@/containers/sub-categories'

export const metadata: Metadata = {
  title: 'Sub Categories',
}

export default async function SubCategoriesPage() {
  return <SubCategories />
}
