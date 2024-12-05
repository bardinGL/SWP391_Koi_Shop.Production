import React, { useState, FC, useEffect } from 'react'
import { Modal, Upload } from 'antd'
import Image from 'next/image'
import { VariationTableProps } from './type'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import { useFetch } from '@/hooks/useFetch'
import { StorageService } from '@/client'
import axios from 'axios'
import { getImageUrlFromS3Key } from '@/helpers/getImageUrl'
import { toast } from '@/components/ui/use-toast'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

interface UploadImageBoxProps {
  value: string[]
  onChange: (images: string[]) => void
}

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

const UploadImageBox: FC<UploadImageBoxProps> = ({ value, onChange }) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewTitle, setPreviewTitle] = useState('')
  const [newFile, setNewFile] = useState<File>()

  const { run: createPresignedUrl, params } = useFetch(
    (fileName, onSuccess) =>
      StorageService.storageControllerCreatePresignedUrl({
        requestBody: {
          key: fileName,
        },
      }),
    {
      manual: true,
      onSuccess: async (response) => {
        if (!newFile) return
        try {
          await axios.put(response, newFile, {
            headers: {
              'Content-Type': newFile.type || 'application/octet-stream',
            },
          })
          const [fileName, onSuccess] = params
          const avatarUrl = getImageUrlFromS3Key(fileName)

          onSuccess({ url: avatarUrl, name: fileName, uid: fileName })
          onChange([...value, fileName])
          setNewFile(undefined)
        } catch (error) {
          console.log('error', error)
        }
      },
      onError: (error) => {
        console.log('🚀 ~ onError: ~ error', error)
      },
    },
  )

  const { run: deleteImage } = useFetch(
    StorageService.storageControllerDeleteObject,
    {
      manual: true,
      onSuccess: () => {
        toast({
          title: 'Image deleted',
          variant: 'success',
        })
      },
      onError: (error) => {
        console.log('🚀 ~ onError: ~ error', error)
        toast({
          title: 'Error deleting image',
          variant: 'destructive',
        })
      },
    },
  )

  const handleCancel = () => setPreviewOpen(false)

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    )
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  useEffect(() => {
    if (value.length > 0) {
      setFileList(
        value.map((image) => ({
          uid: image,
          name: image,
          url: getImageUrlFromS3Key(image),
        })),
      )
    }
  }, [value])

  const uploadButton = (
    <div>
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  return (
    <div>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={(file) => {
          // if (file?.response) {
          //   deleteImage({
          //     requestBody: {
          //       key: file.response.uid,
          //     },
          //   })
          // } else
          //   deleteImage({
          //     requestBody: {
          //       key: file.uid,
          //     },
          //   })
          const newImages = fileList.filter((image) => image.name !== file.name)
          onChange(newImages.map((image) => image.uid))
        }}
        customRequest={async ({ file, onSuccess }: any) => {
          setNewFile(file)
          const fileName = `product_items/${Date.now()}`
          createPresignedUrl(fileName, onSuccess)
        }}
      >
        {value && value.length >= 6 ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <Image width={1200} height={1200} alt="example" src={previewImage} />
      </Modal>
    </div>
  )
}

export default UploadImageBox
