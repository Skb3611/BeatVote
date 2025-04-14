import { ArrowUp, ArrowDown, Play } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Song } from "@/app/room/[roomId]/page";
import Image from "next/image";

interface SongListProps {
  songs: Song[];
  onVote: (songId: string, increment: boolean) => void;
  // onSelectSong: (videoId: string) => void;
  currentSong: string | null;
}

const SongList = ({ songs, onVote, currentSong }: SongListProps) => {
  // Sort songs by votes (descending)
  const sortedSongs = songs ? [...songs].sort((a, b) => (b.votes || 0) - (a.votes || 0)) : [];

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match?.[2]?.length === 11) ? match?.[2] : null;
  };
  // console.log(songs)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Playlist Queue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedSongs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No songs in the queue. Add one below!
            </p>
          ) : (
            sortedSongs && 
            sortedSongs.map((song) => {
              const videoId = extractVideoId(song.url);
              return (
                <div 
                  key={song.id} 
                  className={`flex items-center p-3 rounded-lg ${
                    currentSong === videoId ? "bg-accent" : "bg-muted/30 hover:bg-muted/50"
                  } transition-colors`}
                >
                  <div className="flex flex-col items-center mr-3">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => onVote(song.id, true)}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <span className="font-bold">{song.votes || 0}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => onVote(song.id, false)}
                      disabled={(song.votes || 0) <= 0}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{song.name}</p>
                    <p className="text-xs text-muted-foreground">Added by {song.addedBy}</p>
                  </div>
                  
                  <Image src={song.thumbnail} alt={song.name} height={100} width={100}/>

                  
                  {/* <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`ml-2 ${currentSong === videoId ? "text-music-primary" : ""}`}
                    onClick={() => onSelectSong(videoId || "")}
                  >
                    <Play className="h-5 w-5" />
                  </Button> */}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SongList;