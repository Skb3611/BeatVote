import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardFooter } from "@workspace/ui/components/card";
import { ListMusic, Music, Users } from "lucide-react";
import { useEffect, useState } from "react";
type Room = {
  name:string,
  id:string,
  hostId:string,
  thumbnail:string,
  hostName:string
}
const PopularRooms = () => {
  const [popularRooms,setPopularRooms] = useState<Room[]>([])
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/rooms`)
        const data = await res.json()
        setPopularRooms(data)
        // console.log(data)
      } catch (error) {
        console.error("Error fetching rooms:", error)
      }
    }
    fetchRooms()
  }, [])

  return (
    <section className="py-20">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular <span className="gradient-text">Rooms</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Join active music rooms and start contributing to the playlist
            </p>
          </div>
          <Button variant="outline" className="border-music-primary text-music-primary hover:bg-primary/10">
            View All Rooms
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularRooms.map((room) => (
            <Card key={room.id} className="overflow-hidden card-hover">
              <div className="relative h-48">
                <img 
                  src={room.thumbnail.length > 0 ? room.thumbnail : "/images/default.png"} 
                  alt={room.hostName} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-lg">{room.name}</h3>
                  <p className="text-white/80 text-sm">by {room.hostName}</p>
                </div>
                
              </div>
              
              {/* <CardContent className="pt-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{room.participants} listeners</span>
                  </div>
                  <div className="flex items-center">
                    <ListMusic className="h-4 w-4 mr-1" />
                    <span>{room.songs} songs</span>
                  </div>
                </div>
              </CardContent> */}
              
              <CardFooter className="pt-0">
                <Button className="w-full bg-primary hover:bg-secondary button-hover">
                  Join Room
                  <Music className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRooms;