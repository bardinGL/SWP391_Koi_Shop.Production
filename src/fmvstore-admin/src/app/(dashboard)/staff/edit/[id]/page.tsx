import EditStaffContainer from '@/containers/staff/edit'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Staff Edit',
}

const CreateStaffPage = ({ params }: { params: { id: string } }) => {
  return <EditStaffContainer id={params.id} />
}

export default CreateStaffPage
