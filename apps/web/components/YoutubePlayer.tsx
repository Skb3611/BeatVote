import { useEffect, useRef } from "react";
import { Card, CardContent } from "@workspace/ui/components/card";
import Player from "yt-player";

interface YouTubePlayerProps {
  videoId: string | null;
  start: number;
  onEnd: (videoId:string) => void;
  isLoading: boolean;
}

const YouTubePlayer = ({ videoId, start, onEnd, isLoading }: YouTubePlayerProps) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<Player | null>(null);
  // console.log("videoID from ytPlayer---------",videoId)
  useEffect(() => {
    if (playerRef.current && !ytPlayerRef.current) {
      ytPlayerRef.current = new Player(playerRef.current, {
        width: 100,
        height: 100,
        autoplay: true,
        controls: false,
      });

      ytPlayerRef.current.on("ended", () => {
        if (videoId) onEnd(videoId);
      });
    }
  }, [onEnd, videoId]);

  useEffect(() => {
    if (!ytPlayerRef.current || !videoId || isLoading) return;

    ytPlayerRef.current.load(videoId, true, start);
    ytPlayerRef.current.setPlaybackRate(2)

    // return () => {
    //   ytPlayerRef.current?.stop();
    // };
  }, [videoId, start, isLoading]);

  if (!videoId) {
    return (
      <Card className="w-full aspect-video">
        <CardContent className="p-0 flex items-center justify-center h-full bg-muted/30">
          <p className="text-muted-foreground">Select a song to play</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-0 relative">
        <div className="aspect-video">
          <div ref={playerRef} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default YouTubePlayer;
