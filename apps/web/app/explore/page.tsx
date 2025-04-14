'use client'
import RoomCreation from '@/components/RoomCreation'
import React from 'react'
import RoomListing from '@/components/RoomListing'
import { useSocketContext } from '@/hooks/socketContext'
const page = () => {
    const socket = useSocketContext()
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto max-w-6xl px-4 py-12">          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-3/5 lg:sticky lg:top-24 lg:self-start">
              <RoomCreation />
            </div>
            
            <div className="w-full lg:w-2/5">
              <RoomListing />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default page
