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
import { CreateVariationDto } from '@/client'

type SizeActionsProps = {
  refresh: () => void
  createSize: (data: { requestBody: CreateVariationDto; type: string }) => void
}

export default function SizeActions({ refresh, createSize }: SizeActionsProps) {
  const [sizeName, setSizeName] = useState<string>()

  const handleCreateSize = async () => {
    createSize({
      type: 'Size',
      requestBody: {
        name: sizeName!,
      },
    })
    setSizeName('')
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
                <Plus className="mr-2 size-4" /> Add Size
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Size</DialogTitle>
                <DialogDescription>
                  {' Enter the value of new size.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Size name
                  </Label>
                  <Input
                    id="name"
                    value={sizeName}
                    className="col-span-3"
                    onChange={(e) => setSizeName(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button onClick={handleCreateSize} type="submit">
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
