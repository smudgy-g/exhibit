import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from '../ui/button'

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void
  mediaUrl: string
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([])
  const [fileUrl, setFileUrl] = useState(mediaUrl)
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles)
      setFileUrl(URL.createObjectURL(acceptedFiles[0]))
      fieldChange(acceptedFiles)
    },
    [file]
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg'],
    },
  })
  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col border border-black cursor-pointer"
    >
      <input
        {...getInputProps()}
        className="cursor-pointer"
      />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img
              src={fileUrl}
              alt="image"
              className="file_uploader-img"
            />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/assets/icons/file-upload.svg"
            alt="file upload"
            width={96}
            height={96}
          />
          <h3 className="base-medium mb-2 mt-6">
            Drag photo here
          </h3>
          <p className="small-regular mb-6">SVG, PNG, JPG</p>
          <Button className="shad-button_ghost">Upload from computer</Button>
        </div>
      )}
    </div>
  )
}

export default FileUploader
