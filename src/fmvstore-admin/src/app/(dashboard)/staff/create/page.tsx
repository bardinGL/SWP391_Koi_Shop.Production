import CreateStaffContainer from '@/containers/staff/create'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Staff Create',
}

const CreateStaffPage = () => {
  return <CreateStaffContainer />
}

export default CreateStaffPage
