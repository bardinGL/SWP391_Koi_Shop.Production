import React, { useEffect, useRef } from 'react'

type CKEditorProps = {
  onChange: (data: string) => void
  editorLoaded: boolean
  name: string
  data: string
  Placeholder: any // Replace 'any' with the actual type if known
  init: any // Replace 'any' with the actual type if known
}

export default function CKEditor({
  onChange,
  editorLoaded,
  name,
  data,
  Placeholder,
  init,
}: CKEditorProps) {
  const editorRef = useRef<{ CKEditor?: any; ClassicEditor?: any }>() // Replace 'any' with the actual types if known
  const { CKEditor, ClassicEditor } = editorRef.current || {}

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    }
  }, [])

  return (
    <>
      {editorLoaded ? (
        <CKEditor
          initData={init}
          config={Placeholder}
          type=""
          name={name}
          editor={ClassicEditor}
          data={data}
          onChange={(event: any, editor: any) => {
            const data = editor.getData()
            onChange(data)
          }}
        />
      ) : (
        <div>Editor loading</div>
      )}
    </>
  )
}
