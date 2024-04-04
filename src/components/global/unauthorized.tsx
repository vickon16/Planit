import Link from 'next/link'
import React from 'react'
import Heading from '@/components/heading'
import { appLinks } from '@/lib/appLinks'
import { buttonVariants } from '../ui/button'

const Unauthorized = () => {
  return (
    <div className="p-4 text-center h-[60svh] w-full flex justify-center items-center flex-col">
      <Heading heading='Unauthorized Access!' description='Please contact support or your agency owner to get access' center headingColor='destructive'   />

      <Link
        href={appLinks.site}
        className={buttonVariants({className : "mt-4"})}
      >
        Back to home
      </Link>
    </div>
  )
}

export default Unauthorized