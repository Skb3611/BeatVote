import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Music } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-music-dark text-white">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Music className="h-8 w-8 text-music-primary" />
              <h2 className="text-2xl font-bold gradient-text">VibeRoom</h2>
            </div>
            <p className="text-gray-400 max-w-md">
              The ultimate platform for collaborative music experiences. Create rooms, add songs, 
              and let everyone vote on what plays next.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-music-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-gray-400 hover:text-music-primary transition-colors">
                  Explore Rooms
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-music-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-music-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-music-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-music-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-music-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-music-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
            <p className="text-gray-400 mb-4">
              Stay updated with the latest features and releases.
            </p>
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-music-dark/70 border-gray-700 text-white"
              />
              <Button className="bg-primary hover:bg-secondary">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} VibeRoom. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;