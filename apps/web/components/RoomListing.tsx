"use client"
import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@workspace/ui/components/select";
import { ListMusic, Music, Users, Search, Clock } from "lucide-react";

type Room = {
  id: string;
  name: string;
  hostName: string;
  thumbnail: string;
}
export default function RoomListing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/common/rooms`)
      const data = await res.json()
      setRooms(data)
    }
    fetchRooms()
  }, [])
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         room.hostName.toLowerCase().includes(searchTerm.toLowerCase())
                         
    return matchesSearch?true:room
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search rooms..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-32 h-32">
                    <img 
                      src={room.thumbnail.length > 0 ? room.thumbnail : "/images/default.png"} 
                      alt={room.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{room.name}</h3>
                          <p className="text-sm text-muted-foreground">by {room.hostName}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button className="bg-primary hover:bg-secondary button-hover">
                        Join Room
                        <Music className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-muted-foreground">No rooms found matching your search</p>
          </div>
        )}
      </div>
    </div>
  );
};
