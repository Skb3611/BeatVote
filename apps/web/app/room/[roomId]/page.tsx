"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SongList from "@/components/SongList";
import YouTubePlayer from "@/components/YoutubePlayer";
import AddSong from "@/components/AddSong";
import { useSocketContext } from "@/hooks/socketContext";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/sonner";
import { useUser } from "@clerk/nextjs";

export interface Song {
  name: string;
  id: string;
  url: string;
  thumbnail: string;
  votes: number;
  addedBy: string;
  updatedAt?: Date;
  duration: number;
}

const Room = () => {
  const socket = useSocketContext();
  const { roomId } = useParams();
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<number>(0);
  const router = useRouter();
  const [start, setStart] = useState<number>(0);
  const { user } = useUser();
  const selectedSongRef = useRef<string | null>(null);
  const songsRef = useRef<Song[] | null>(null);

  useEffect(() => {
    selectedSongRef.current = selectedSong;
  }, [selectedSong]);
  useEffect(() => {
    if (!socket) return;

    socket.emit("roomJoined", { roomId, userId: user?.id });

    const handleRoomDetails = (data: any) => {
      try {
        setData(data);
        // Make sure all songs have votes initialized
        const songsWithVotes = data.songs.map((song: Song) => ({
          ...song,
          votes: song.votes || 0,
        }));
        setSongs(songsWithVotes);
        setUsers(data.users === 0 ? 1 : data.users);
        if (data.activeSong) {
          // console.log(data.activeSong && data.activeSong.song);
          const videoId = extractVideoId(data.activeSong.song.url);
          setSelectedSong(videoId);
          selectedSongRef.current = videoId;
          setStart(
            Math.floor(
              (Date.now() - new Date(data.activeSong.updatedAt).getTime()) /
                1000
            )
          );
          // setLoading(false);
        } else if (songsWithVotes.length > 0) {
          // If no active song but there are songs in the queue, set the first one as active
          const sortedSongs = [...songsWithVotes].sort(
            (a, b) => (b.votes || 0) - (a.votes || 0)
          );
          const firstSong = sortedSongs[0];
          const videoId = extractVideoId(firstSong.url);
          setSelectedSong(videoId);
          selectedSongRef.current = videoId;
          socket.emit("setActiveSong", {
            roomId,
            songId: firstSong.id,
            userId: user?.id,
          });
          setStart(0);
        }
      } finally {
        setLoading(false);
      }
    };

    const handleUserJoined = (userId: string) => {
      setUsers((prev) => prev + 1);
    };

    const handleUserLeft = (userId: string) => {
      setUsers((prev) => Math.max(0, prev - 1));
    };
    const handleUpvoteFailed = (error: string) => {
      toast.error("Failed to upvote song", {
        description: "You have already upvoted this song",
      });
    };
    const handleDownvoteFailed = (error: string) => {
      toast.error("Failed to downvote song", {
        description:
          "You have already downvoted this song or havent upvoted it yet",
      });
    };

    const handleNewSongAdded = (song: any) => {
      // console.log("New song added:", song);
      // Make sure the song has the correct structure and votes initialized
      const formattedSong: Song = {
        id: song.id,
        name: song.name,
        url: song.url,
        thumbnail: song.thumbnail,
        votes: song.votes || 0,
        addedBy: song.addedBy || "Unknown",
        duration: song.duration,
      };
      setSongs((prev) => {
        const updated = [...prev, formattedSong];
        return updated.sort((a, b) => (b.votes || 0) - (a.votes || 0));
      });
      // console.log(songs.length);
      // console.log(selectedSongRef.current)
      if (selectedSongRef.current == null) {
        socket.emit("setActiveSong", {
          roomId,
          songId: song.id,
          userId: user?.id,
        });
      }
    };

    const handleUpvote = (songId: string) => {
      setSongs((prev) =>
        prev.map((song) =>
          song.id === songId ? { ...song, votes: (song.votes || 0) + 1 } : song
        )
      );
    };

    const handleDownvote = (songId: string) => {
      setSongs((prev) =>
        prev.map((song) =>
          song.id === songId
            ? { ...song, votes: Math.max(0, (song.votes || 0) - 1) }
            : song
        )
      );
    };

    const handleActiveSongSet = (activeSong: any) => {
      const videoId = extractVideoId(activeSong.song.url);
      setSelectedSong(videoId);
      selectedSongRef.current = videoId;
      setStart(
        Math.floor(
          (Date.now() - new Date(activeSong.updatedAt).getTime()) / 1000
        )
      );
    };
    const handleUpdatedSongList = (songs: Song[]) => {
      setSongs(songs);
    };

    socket.on("roomDetails", handleRoomDetails);
    socket.on("userJoined", handleUserJoined);
    socket.on("userLeft", handleUserLeft);
    socket.on("newSongAdded", handleNewSongAdded);
    socket.on("upvote", handleUpvote);
    socket.on("downvote", handleDownvote);
    socket.on("upvoteFailed", handleUpvoteFailed);
    socket.on("downvoteFailed", handleDownvoteFailed);
    socket.on("activeSongSet", handleActiveSongSet);
    socket.on("updatedSongList", handleUpdatedSongList);

    return () => {
      socket.off("roomDetails", handleRoomDetails);
      socket.off("userJoined", handleUserJoined);
      socket.off("userLeft", handleUserLeft);
      socket.off("newSongAdded", handleNewSongAdded);
      socket.off("upvote", handleUpvote);
      socket.off("downvote", handleDownvote);
      socket.off("upvoteFailed", handleUpvoteFailed);
      socket.off("downvoteFailed", handleDownvoteFailed);
      socket.off("activeSongSet", handleActiveSongSet);
    };
  }, [socket, roomId]);

  useEffect(() => {
    setSongs((prev) => prev.sort((a, b) => (b.votes || 0) - (a.votes || 0)));
    // !selectedSong && setSelectedSong(extractVideoId(songs[0]?.url!))
  }, [songs]);

  // useEffect(() => {
  //   if (selectedSong) {
  //     setTimeout(() => {
  //       // setSongs((prev) => prev.filter((song) => !song.url.includes(selectedSong)));
  //       setSelectedSong(extractVideoId(songs.sort( (a, b) => (b.votes || 0) - (a.votes || 0))[0]?.url!))
  //       socket.emit("setActiveSong",{roomId,songId:songs.filter(song=>song.url.includes(selectedSong))[0]?.id})
  //     }, songs.filter(song=>song.id.includes(selectedSong))[0]?.duration);
  //   }
  // }, [selectedSong]);

  const handleAddSong = (songData: { title: string; url: string }) => {
    const videoId = extractVideoId(songData.url);

    if (!videoId) {
      return;
    }

    const newSong = {
      url: songData.url,
      name: songData.title,
      thumbnail: `https://img.youtube.com/vi/${videoId}/0.jpg`,
    };
    socket?.emit("addSong", { roomId, song: newSong });
  };

  const handleVote = (songId: string, increment: boolean) => {
    if (increment) {
      socket?.emit("upvote", { roomId, songId });
    } else {
      socket?.emit("downvote", { roomId, songId });
    }
  };

  const extractVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return match && match?.[2]?.length === 11 ? match?.[2] : null;
  };

  const onVideoEnd = (videoId: string) => {
    // console.log("videoId from onVideoEnd-------",videoId)
    // console.log("Video ended:",selectedSongRef.current);

    // Find the song that just ended
    if (selectedSongRef) {
      console.log("videoId",videoId)
      console.log("SelectedSongRef.current:", selectedSongRef.current);
      console.log("SelectedSong:", selectedSong);
      songs.forEach((song, index) => {
        const vid = extractVideoId(song.url);
        console.log(`Song[${index}] ID:`, vid, "| Full URL:", song.url);
      });

      const currentSong = songs.find(
        (song) => extractVideoId(song.url) === selectedSongRef.current
      );
      // console.log("Song by selectref",currentSong)
      // console.log(songs.map(s => extractVideoId(s.url)))
      // console.log(songs,currentSong,selectedSongRef.current)

      // if (!currentSong) {
      //   console.log("Current song not found, ignoring video end event");
      //   return;
      // }

      console.log("Removing current song:", currentSong?.id);
      socket.emit("deleteSongEntry", {
        roomId,
        songId: currentSong?.id,
        userId: user?.id,
      });
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold">
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <p className="gradient-text text-2xl">
                    Room: {data?.name || "Music Room"}
                  </p>
                  <p className="gradient-text text-sm">
                    Room ID: {data?.id || "Music Room"}
                  </p>
                  <div className="flex items-center gap-5">
                    <span className="gradient-text text-sm">
                      Room Type: {data?.type || "Public"}
                    </span>
                    <span className="gradient-text text-sm">
                      Users: {users}
                    </span>
                  </div>
                </>
              )}
            </h1>
            <div>
              <Button
                variant="default"
                size="lg"
                className="cursor-pointer"
                onClick={() => {
                  socket?.emit("leaveRoom", { roomId });
                  router.push("/");
                }}
              >
                Leave Room
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <YouTubePlayer
                  videoId={selectedSong}
                  start={start}
                  onEnd={onVideoEnd}
                  isLoading={loading}
                />
              </div>

              <AddSong onAddSong={handleAddSong} />
            </div>

            <div className="lg:col-span-1">
              <SongList
                songs={songs}
                onVote={handleVote}
                // onSelectSong={selectSongForPlayback}
                currentSong={selectedSong}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Room;
