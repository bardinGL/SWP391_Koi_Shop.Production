import { StorageService } from '@/client'
import { getImageUrlFromS3Key } from '@/helpers/getImageUrl'
import { useFetch } from '@/hooks/useFetch'
import { GetProp, Modal, Upload, UploadFile, UploadProps } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

type UploadColorImageProps = {
  value?: string
  onChange: (images: string | null) => void
}

const UploadColorImage = ({ value, onChange }: UploadColorImageProps) => {
  const [previewImage, setPreviewImage] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewTitle, setPreviewTitle] = useState('')

  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [newFile, setNewFile] = useState<File>()

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
          setNewFile(undefined)
          onChange(fileName)
        } catch (error) {
          console.log('error', error)
        }
      },
      onError: (error) => {
        console.log('🚀 ~ onError: ~ error', error)
      },
    },
  )

  const handleCancel = () => setPreviewOpen(false)

  useEffect(() => {
    if (value) {
      setFileList([
        { uid: value, name: value, url: getImageUrlFromS3Key(value) },
      ])
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
        onRemove={() => {
          onChange(null)
        }}
        customRequest={async ({ file, onSuccess }: any) => {
          setNewFile(file)
          const fileName = `variations/${Date.now()}`
          createPresignedUrl(fileName, onSuccess)
        }}
      >
        {fileList && fileList.length >= 1 ? null : uploadButton}
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

export default UploadColorImage
