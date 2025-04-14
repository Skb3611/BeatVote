import { hostname } from 'os'
import { protocol } from 'socket.io-client'

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  images:{
    remotePatterns:[{
      protocol:"https",
      hostname:"img.youtube.com",
      pathname:"/vi/**"
    }]
  }
}

export default nextConfig
