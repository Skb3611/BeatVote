"use client"
import { useSocket } from '@/hooks/useSocket'
import { useAuth } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const page = () => {
    const { getToken } = useAuth()
    const [token, setToken] = useState<string | null>(null)
    useEffect(() => {
        const fetchToken = async () => {
            const token = await getToken()
            setToken(token)
        }
        fetchToken()
    }, [getToken])

    useEffect(() => {
        if (token) {
            const socket = io('http://localhost:8080', {
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                auth: {
                    token: token
                }
            })
            socket.on('connect', () => {
                console.log('Connected to WebSocket server')
            })
            socket.on('connect_error', (error) => {
                console.error('WebSocket connection error:', error)
            })
            
        }
    }, [token])
  return (
    <div>
      <h1>Rooms</h1>
    </div>
  )
}

export default page
