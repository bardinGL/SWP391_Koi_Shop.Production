import { Plus } from 'lucide-react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useFetch } from '@/hooks/useFetch'
import { toast } from '@/components/ui/use-toast'
import { categoryService } from '@/services/category'

type CategoryActionsProps = {
  refresh: () => void
}

export default function CategoryActions({ refresh }: CategoryActionsProps) {
  const [categoryName, setCategoryName] = useState<string>()
  const { run: createCategory } = useFetch(categoryService.createCategory, {
    manual: true,
    onSuccess: () => {
      refresh()
      toast({
        title: 'Category created',
        variant: 'success',
      })
      setCategoryName('')
    },
    onError: (error) => {
      if ((error as any).body.message === 'Category already exists') {
        toast({
          title: 'Category already exists',
          variant: 'destructive',
        })
      }
    },
  })

  const handleCreateCategory = async () => {
    createCategory(categoryName ?? '')
  }
  return (
    <Card className="mb-5">
      <div className="flex flex-col xl:flex-row xl:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="lg"
                className="sm:flex-grow xl:flex-grow-0"
              >
                <Plus className="mr-2 size-4" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add category</DialogTitle>
                <DialogDescription>
                  {
                    " Make changes to your profile here. Click save when you're done."
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={categoryName}
                    className="col-span-3"
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button onClick={handleCreateCategory} type="submit">
                    Add
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  )
}
