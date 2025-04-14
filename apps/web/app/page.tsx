"use client";
import { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import RoomCreation from '@/components/RoomCreation';
import WorkflowSection from '@/components/WorkflowSection';
import PopularRooms from '@/components/PopularRooms';

export default function Page() {
  // const socket = useSocket();

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("message", (message) => {
  //       console.log("Received message:", message);
  //     });
  //   }
  // }, [socket]);

  return (

    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection />
        <WorkflowSection />
        <RoomCreation />
        <PopularRooms />
      </main>
    </div>    
  )
}
