import { prisma } from "db";
import { getDuration } from "../utils/Yt";

export class DbService {
  async createUser(id: string, email: string, name: string): Promise<void> {
    try {
      await prisma.user.create({
        data: {
          id,
          email,
          name,
        },
      });
    } catch (e) {
      console.log(e);
      throw new Error("Failed to create user");
    }
  }

  async createRoom(
    name: string,
    hostId: string,
    type: "PUBLIC" | "PRIVATE" = "PUBLIC",
    password?: string
  ): Promise<{ name: string; id: string }> {
    try {
      const room = await prisma.room.create({
        data: {
          name,
          hostId,
          thumbnail: "",
          type,
          password,
        },
      });
      return { name: room.name, id: room.id };
    } catch (e) {
      console.log(e);
      throw new Error("Failed to create room");
    }
  }
  async getRooms(): Promise<{ name: string; id: string; hostId: string }[]> {
    try {
      const rooms = await prisma.room.findMany({
        take: 8,
        orderBy: {
          createdAt: "desc",
        },
      });
      return rooms.map((room) => ({
        name: room.name,
        id: room.id,
        hostId: room.hostId,
        thumbnail: room.thumbnail,
      }));
    } catch (e) {
      console.log(e);
      throw new Error("Failed to get rooms");
    }
  }
  async getUserName(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user?.name || "Unknown User";
  }
  async createSongEntry(
    roomId: string,
    url: string,
    name: string,
    userId: string,
    thumbnail: string
  ): Promise<{
    name: string;
    id: string;
    roomId: string;
    url: string;
    thumbnail: string;
    votes: number;
    addedBy: string;
  }> {
    try {
      // First check if the room exists
      const room = await prisma.room.findUnique({
        where: { id: roomId },
      });

      if (!room) {
        throw new Error("Room not found");
      }

      const duration = await getDuration(url);

      const songEntry = await prisma.songEntry.create({
        data: {
          name,
          url,
          userId,
          roomId,
          thumbnail,
          duration,
        },
        include: {
          upvotes: true,
        },
      });

      return {
        name: songEntry.name,
        id: songEntry.id,
        roomId: songEntry.roomId,
        url: songEntry.url,
        thumbnail: songEntry.thumbnail,
        votes: songEntry.upvotes.length,
        addedBy: await this.getUserName(songEntry.userId),
      };
    } catch (e) {
      console.log(e);
      throw new Error("Failed to create song entry");
    }
  }
  async deleteSongEntry(roomId: string, songId: string): Promise<boolean> {
    try {
      let song = await prisma.songEntry.findFirst({
        where: {
          roomId,
          id: songId,
        },
      });

      song &&
        (await prisma.songEntry.delete({
          where: {
            roomId,
            id: songId,
          },
        }));
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  async getAllSongs(roomId: string): Promise<
    {
      name: string;
      id: string;
      url: string;
      userId: string;
      roomId: string;
      active: boolean;
      played: boolean;
      votes: number;
      thumbnail:string
    }[]
  > {
    try {
      const songs = await prisma.songEntry.findMany({
        where: {
          roomId,
        },
        include: {
          upvotes: true,
        },
      });
      return songs.map((song) => ({
        name: song.name,
        id: song.id,
        url: song.url,
        userId: song.userId,
        roomId: song.roomId,
        active: song.active,
        played: song.played,
        votes: song.upvotes.length,
        thumbnail:song.thumbnail
      }));
    } catch (e) {
      console.log(e);
      throw new Error("Failed to get all songs");
    }
  }
  async getActiveSong(roomId: string): Promise<{
    name: string;
    id: string;
    url: string;
    userId: string;
    roomId: string;
    active: boolean;
    played: boolean;
    votes: number;
  }> {
    try {
      const activeSong = await prisma.activeSong.findFirst({
        where: {
          roomId,
        },
        include: {
          song: {
            include: {
              upvotes: true,
            },
          },
        },
      });
      if (!activeSong) {
        throw new Error("No active song found");
      }
      return {
        name: activeSong.song.name,
        id: activeSong.song.id,
        url: activeSong.song.url,
        userId: activeSong.song.userId,
        roomId: activeSong.song.roomId,
        active: activeSong.song.active,
        played: activeSong.song.played,
        votes: activeSong.song.upvotes.length,
      };
    } catch (e) {
      console.log(e);
      throw new Error("Failed to get active song");
    }
  }
  async setActiveSong(
    roomId: string,
    songId: string
  ): Promise<{
    songId: string;
    roomId: string;
    createdAt: Date;
    song: {
      name: string;
      id: string;
      url: string;
      userId: string;
      roomId: string;
      active: boolean;
      played: boolean;
      votes: number;
    };
  }> {
    try {
      const activeSong = await prisma.activeSong.upsert({
        where: {
          roomId,
        },
        update: {
          songId,
        },
        create: {
          songId,
          roomId,
          activeSongId: songId,
        },
        include: {
          song: {
            include: {
              upvotes: true,
            },
          },
        },
      });
      return {
        songId: activeSong.song.id,
        roomId: activeSong.song.roomId,
        createdAt: activeSong.createdAt,
        song: {
          name: activeSong.song.name,
          id: activeSong.song.id,
          url: activeSong.song.url,
          userId: activeSong.song.userId,
          roomId: activeSong.song.roomId,
          active: activeSong.song.active,
          played: activeSong.song.played,
          votes: activeSong.song.upvotes.length,
        },
      };
    } catch (e) {
      console.log(e);
      throw new Error("Failed to set active song");
    }
  }
  async deleteActiveSong(roomId: string): Promise<void> {
    try {
      const song = await prisma.activeSong.findFirst({
        where: {
          roomId,
        },
      });
      // console.log(song)

      song &&
        (await prisma.activeSong.delete({
          where: {
            roomId,
          },
        }));
    } catch (e) {
      console.log(e);
      // throw new Error("Failed to delete active song");
    }
  }
  async getUpvotes(songId: string, roomId: string): Promise<Number> {
    try {
      const upvotes = await prisma.upvote.count({
        where: {
          songEntryId: songId,
        },
      });
      return upvotes;
    } catch (e) {
      console.log(e);
      throw new Error("Failed to get upvotes");
    }
  }
  async upvoteSong(songId: string, userId: string): Promise<boolean> {
    try {
      await prisma.upvote.create({
        data: {
          songEntryId: songId,
          userId,
        },
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  async deleteUpvote(songId: string, userId: string): Promise<boolean> {
    try {
      await prisma.upvote.delete({
        where: {
          songEntryId_userId: {
            songEntryId: songId,
            userId,
          },
        },
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  async getRoom(roomId: string): Promise<any | undefined> {
    try {
      const room = await prisma.room.findUnique({
        where: {
          id: roomId,
        },
        include: {
          songEntries: true,
          activeSong:{
            include:{
              song:true
            }
          }
        },
      });
      return room;
    } catch (e) {
      console.log(e);
      throw new Error("Failed to get room");
    }
  }
  async deleteRoom(roomId: string): Promise<void> {
    try {
      await prisma.room.delete({
        where: {
          id: roomId,
        },
      });
    } catch (e) {
      console.log(e);
      throw new Error("Failed to delete room");
    }
  }
  async Ishost(roomId: string, userId: string): Promise<boolean> {
    try {
      const room = await prisma.room.findUnique({ where: { id: roomId } });
      // console.log(room,userId,room?.hostId==userId, typeof room?.hostId , typeof userId)
      if(room){
        if(room.hostId== userId){
          return true
        }
        return false
      }
      return false
    } catch (e) {
      console.log(e);
      return false
      
    }
  }
}
