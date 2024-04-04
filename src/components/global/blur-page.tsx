import { cn, zPriority } from '@/lib/utils'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const BlurPage = ({ children }: Props) => {
  return (
    <div
      className={cn("overflow-auto backdrop-blur-[30px] pt-24 p-4 absolute top-0 right-0 left-0 bottom-0", zPriority.pr1)}
      id="blur-page"
    >
      {children}
    </div>
  )
}

export default BlurPage
