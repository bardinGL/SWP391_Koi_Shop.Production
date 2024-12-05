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
import UploadColorImage from './UploadImage'

type ColorActionsProps = {
  refresh: () => void
  createColor: (data: { requestBody: CreateVariationDto; type: string }) => void
}

export default function ColorActions({
  refresh,
  createColor,
}: ColorActionsProps) {
  const [colorName, setColorName] = useState<string>()
  const [colorImage, setColorImage] = useState<string | null>()

  const handleCreateColor = async () => {
    if (!colorName || !colorImage) return
    createColor({
      type: 'Color',
      requestBody: {
        name: colorName!,
        image: colorImage,
      },
    })
    setColorName('')
    refresh()
  }

  return (
    <Card className="mb-5">
      <div className="flex flex-col xl:flex-row xl:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="default"
                color="lg"
                className="sm:flex-grow xl:flex-grow-0"
              >
                <Plus className="mr-2 color-4" /> Add Color
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Color</DialogTitle>
                <DialogDescription>
                  {' Enter the value of new color.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Color name
                  </Label>
                  <Input
                    id="name"
                    value={colorName}
                    className="col-span-3"
                    onChange={(e) => setColorName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Color Image
                  </Label>
                  <UploadColorImage
                    onChange={(value) => {
                      console.log(value)
                      setColorImage(value)
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button onClick={handleCreateColor} type="submit">
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
