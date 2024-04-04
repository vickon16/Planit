import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { UploadDropzone } from '@/lib/uploadthing'
import { toast } from 'sonner'
import { TFileUploadTypes } from '@/lib/types'

type Props = {
  apiEndpoint: TFileUploadTypes;
  onChange: (url?: string) => void;
  value?: string
  disabled? : boolean
}

const FileUpload = ({ apiEndpoint, onChange, value, disabled }: Props) => {
  const type = value?.split('.').pop()

  if (value) {
    return (
      <div className="flex flex-col relative w-fit">
        {type !== 'pdf' ? (
          <div className="relative w-40 h-40">
            <Image
              src={value}
              alt="uploaded image"
              className="object-contain"
              fill
            />
          </div>
        ) : (
          <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <FileIcon />
            <a
              href={value}
              target="_blank"
              rel="noopener_noreferrer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              View PDF
            </a>
          </div>
        )}
        
        <Button
          variant="secondary"
          type="button"
          className='w-fit absolute top-0 -right-8 p-1'
          title='Remove Photo'
          disabled={disabled}
        >
          <X className="h-4 w-4" onClick={() => onChange('')} />
        </Button>
      </div>
    )
  }


  return (
    <div className="w-full bg-muted/30">
      <UploadDropzone
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => {
          !disabled && onChange(res?.[0].url)
        }}
        onUploadError={(error: Error) => {
          toast.error("Failed to upload message", {description : error.message})
        }}
      />
    </div>
  )
}

export default FileUpload
