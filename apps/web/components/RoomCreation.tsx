"use client"
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { ArrowRight, Lock, Music, Unlock } from "lucide-react";
import { useEffect, useState } from "react";
import { useSocketContext } from "@/hooks/socketContext";
import { toast } from "@workspace/ui/components/sonner";
import { useRouter } from "next/navigation";
const RoomCreation = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const socket = useSocketContext()
  const [roomName, setRoomName] = useState("")
  const [roomPassword, setRoomPassword] = useState("")
  const [roomId, setRoomId] = useState("")
  const router = useRouter()
  const createRoom =() => {
    if(isPrivate){
      socket.emit('createPrivateRoom', roomName, roomPassword)
      
    }else{
      socket.emit('createPublicRoom', roomName)
    }
  }
  const joinRoom =() => {
    if(roomPassword.length > 0){
      socket.emit('joinPrivateRoom', roomId, roomPassword)
    }else{
      socket.emit('joinPublicRoom', roomId)
    }
  }
  useEffect(() => {
    if(socket!=null){
      socket.on('roomCreated', (data: {roomId: string, roomName: string, message: string}) => {
        // console.log(data.roomId)
        toast.success(`Room created successfully.`)
        router.push(`/room/${data.roomId}`)
      })
      socket.on('roomJoined', (roomId:string) => {
        router.push(`/room/${roomId}`)
      })
      socket.on('roomJoinFailed', (message:string) => {
        toast.error(message)
      })
    }
  }, [socket])
  
  return (
    <section >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Create Your <span className="gradient-text">Music Room</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Set up your personalized music room in seconds. Choose a theme,
            name your room, and start inviting friends.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create Room</TabsTrigger>
              <TabsTrigger value="join">Join Room</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Create a New Room</CardTitle>
                  <CardDescription>
                    Make your own room and invite others to join your musical journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="room-name">Room Name</Label>
                    <Input id="room-name" placeholder="My Awesome Music Room" value={roomName} onChange={(e)=>setRoomName(e.target.value)} />
                  </div>
                  
                
                  
                  <div className="flex items-center space-x-4">
                    <Button
                      type="button"
                      variant={isPrivate ? "outline" : "default"}
                      className={!isPrivate ? "bg-primary hover:bg-secondary" : ""}
                      onClick={() => setIsPrivate(false)}
                    >
                      <Unlock className="mr-2 h-4 w-4" />
                      Public Room
                    </Button>
                    <Button
                      type="button"
                      variant={isPrivate ? "default" : "outline"}
                      className={isPrivate ? "bg-primary hover:bg-secondary" : ""}
                      onClick={() => setIsPrivate(true)}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Private Room
                    </Button>
                  </div>

                  {isPrivate && (
                    <div className="space-y-2">
                      <Label htmlFor="room-password">Room Password</Label>
                      <Input id="room-password" type="password" placeholder="Set a password" value={roomPassword} onChange={(e)=>setRoomPassword(e.target.value)} />
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary hover:bg-secondary button-hover"
                  onClick={createRoom}>
                    Create Room
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="join">
              <Card>
                <CardHeader>
                  <CardTitle>Join an Existing Room</CardTitle>
                  <CardDescription>
                    Enter a room code to join friends in their music room
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="room-code">Room Code</Label>
                    <Input id="room-code" placeholder="Enter room code (e.g., ABC123)" value={roomId} onChange={(e)=>setRoomId(e.target.value)} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="join-password">Room Password (if required)</Label>
                    <Input id="join-password" type="password" placeholder="Enter room password" value={roomPassword} onChange={(e)=>setRoomPassword(e.target.value)} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-primary hover:bg-secondary button-hover" onClick={joinRoom}>
                    Join Room
                    <Music className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default RoomCreation;
