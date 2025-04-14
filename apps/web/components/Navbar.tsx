"use client"
import { useSocket } from "@/hooks/useSocket";
import { SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton,useAuth,UserButton } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Music } from "lucide-react";
import Link from "next/link";

const Navbar = () => {

  return (
    <header className="w-full border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Music className="h-8 w-8 text-music-primary" />
          <h1 className="text-2xl font-bold gradient-text">VibeRoom</h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-music-primary transition-colors">
            Home
          </Link>
          <Link href="/explore" className="text-sm font-medium hover:text-music-primary transition-colors">
            Explore Rooms
          </Link>
          <Link href="/#how-it-works" className="text-sm font-medium hover:text-music-primary transition-colors">
            How It Works
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <SignedIn>
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex border-music-primary text-music-primary hover:bg-primary/10 "
              >
              <UserButton />
              </Button>

          </SignedIn>
          <SignedOut>

          <Button
            variant="outline"
            className="hidden sm:flex border-music-primary text-music-primary hover:bg-primary/10"
            >
           <SignInButton />
          </Button>
          <Button className=" hover:bg-secondary button-hover">
            <SignUpButton />
          </Button>
            </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Navbar;