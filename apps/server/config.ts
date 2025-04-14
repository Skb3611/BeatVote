import dotenv from 'dotenv'
dotenv.config()
export const config = {
    port: process.env.PORT || 5000,
    clerkSecretKey: process.env.CLERK_SECRET_KEY || "secret",
    clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY || "secret",
    appUrl: process.env.API_URL || "http://localhost:3000",
    ytApiKey: process.env.YT_API_KEY || "secret",
}
