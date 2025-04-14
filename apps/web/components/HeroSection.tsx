import { Button } from "@workspace/ui/components/button";
import { ArrowRight, Music, Play, Users } from "lucide-react";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();
  return (
    <section className="pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-music-accent/50 text-music-primary text-sm font-medium">
              <span className="animate-pulse-subtle">🎵</span>
              <span className="ml-2">Collaborative Music Experience</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Turn Your Gathering Into a <span className="gradient-text">Musical Journey</span>
            </h1>
            
            <p className="text-lg text-muted-foreground">
              Create music rooms, invite friends, add your favorite songs, and vote on what plays next. 
              VibeRoom lets everyone be the DJ.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button className="bg-primary hover:bg-secondary text-white px-8 py-6 text-lg button-hover"
                onClick={()=>{
                  router.push("/explore");
                }}
              >
                Create a Room
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" className="border-music-primary text-music-primary hover:bg-primary/10 px-8 py-6 text-lg"
                onClick={()=>{
                  router.push("/explore");
                }}
              >
                Join a Room
              </Button>
            </div>
            
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-music-primary mr-2" />
                <span className="text-sm text-muted-foreground">10k+ Active Users</span>
              </div>
              <div className="flex items-center">
                <Music className="h-5 w-5 text-music-primary mr-2" />
                <span className="text-sm text-muted-foreground">50k+ Songs Played</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="relative bg-gradient-to-br from-music-primary/20 to-music-secondary/20 rounded-2xl p-1 shadow-xl">
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-music-accent rounded-full flex items-center justify-center shadow-lg animate-float">
                <Play className="h-8 w-8 text-music-primary ml-1" />
              </div>
              <div className="bg-white rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1516223725307-6f76b9ec8742?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="People enjoying music"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
