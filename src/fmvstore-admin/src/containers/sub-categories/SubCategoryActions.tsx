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
import { CategoriesService, CategoryIndexEntity } from '@/client'
import { toast } from '@/components/ui/use-toast'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type SubCategoryActionsProps = {
  refresh: () => void
  categories: CategoryIndexEntity[]
}

export default function SubCategoryActions({
  refresh,
  categories,
}: SubCategoryActionsProps) {
  console.log('🚀 ~ categories:', categories)
  const [subcategoryName, setSubcategoryName] = useState<string>()
  const [selectedCategory, setSelectedCategory] = useState<number>()
  const { run: createCategory } = useFetch(
    CategoriesService.categoriesControllerCreateCategory,
    {
      onSuccess: () => {
        refresh()
        toast({
          title: 'Sub category created',
          variant: 'success',
        })
        setSubcategoryName('')
      },
      onError: (error) => {
        if ((error as any).body.message === 'Sub category already exists') {
          toast({
            title: 'SUb category already exists',
            variant: 'destructive',
          })
        }
      },
    },
  )

  const handleCreateSubCategory = async () => {
    createCategory({
      requestBody: {
        name: subcategoryName!,
        parentId: selectedCategory,
      },
    })
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
                <Plus className="mr-2 size-4" /> Add Sub Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add sub category</DialogTitle>
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
                    value={subcategoryName}
                    className="col-span-3"
                    onChange={(e) => setSubcategoryName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Category
                  </Label>
                  <Select
                    onValueChange={(value: string) => {
                      const category = categories?.find(
                        (category) => category.name === value,
                      )
                      setSelectedCategory(category?.id)
                    }}
                  >
                    <SelectTrigger className="capitalize col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem
                          value={category.name}
                          key={category.id}
                          className="capitalize"
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button onClick={handleCreateSubCategory} type="submit">
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
