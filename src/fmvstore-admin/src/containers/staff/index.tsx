// src/pages/staff/index.tsx
'use client'
import { useState } from 'react'
import { useFetch } from '@/hooks/useFetch'
import PageTitle from '@/components/shared/PageTitle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell, 
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { axiosInstance } from '@/services/axios'
import { toast } from '@/components/ui/use-toast'

interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string
  roles: string[]
}

export default function StaffPage() {
  const [keyword, setKeyword] = useState('')

  // Fetch all users 
  const { data: users, refresh } = useFetch<User[]>(
    async () => {
      const response = await axiosInstance.get('/users')
      return response.data.result
    }
  )

  // Promote user to staff role
  const promoteToStaff = async (userId: string) => {
    try {
      await axiosInstance.post(`/users/${userId}/updateRole`)
      toast({
        title: 'User promoted to staff successfully',
        variant: 'success'
      })
      refresh()
    } catch (error) {
      toast({
        title: 'Failed to promote user',
        description: 'An error occurred while promoting user to staff',
        variant: 'destructive'
      })
    }
  }

  // Filter users based on search
  const filteredUsers = users?.filter(user => 
    user.username.toLowerCase().includes(keyword.toLowerCase()) ||
    user.email.toLowerCase().includes(keyword.toLowerCase())
  )

  return (
    <div className="container mx-auto py-10">
      <PageTitle>Staff Management</PageTitle>

      <div className="flex justify-between mb-6">
        <Input
          placeholder="Search users..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.roles.join(', ')}</TableCell>
              <TableCell>
                {!user.roles.includes('EMPLOYEE') && user.username !== 'admin' && (
                  <Button 
                    onClick={() => promoteToStaff(user.id)}
                    variant="secondary"
                    size="sm"
                  >
                    Promote to Staff
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}