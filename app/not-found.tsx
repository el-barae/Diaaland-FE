import React from 'react'
import RootLayout from './layout'
import Logo from '@/components/HomePage/Logo/Logo'
import Image from 'next/image'
import Link from 'next/link'
import NotFoundImage from '@/public/images/not-found.svg'

export default function NotFound() {
  return (
    <RootLayout includeFooter={false} >
      <div className="not-found h-screen w-screen flex items-center flex-col mt-20 text-center font-semibold">
        <div className="logo text-5xl">
          <Logo />
        </div>
        <Image 
          src={NotFoundImage}
          alt='not found image'
        />
        <Link href='/' className='bg-blue-500 uppercase px-12 py-4 mt-4 text-white rounded-full hover:bg-blue-600 ease-in-out duration-100' >go to homepage</Link>
      </div>
    </RootLayout>
  )
}
