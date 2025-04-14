import { ExtendedError, Socket, Server as WebSocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { DbService } from "./DbService";
import { verifyToken } from "../utils/jwks";

import { NextFunction } from "express";
export class WebSocketService {
  private server: WebSocketServer;
  private Users: Map<string, Socket>;
  private Rooms: Map<string, Socket[]>;
  private dbService: DbService;

  constructor(private readonly httpServer: HttpServer) {
    this.server = new WebSocketServer(this.httpServer, {
      cors: {
        origin: "*", // Allow any frontend
        methods: ["GET", "POST"],
      },
    });
    this.Users = new Map<string, Socket>();
    this.Rooms = new Map<string, Socket[]>();
    this.dbService = new DbService();
    this.server.use((socket: Socket, next: (err?: ExtendedError) => void) => {
      this.authenticate(socket, next as NextFunction);
    });
  }

  async init() {
    this.server.on("connection", async (socket) => {
      // console.log("New connection:", socket.id);

      socket.emit("message", { message: "Welcome to WebSocket!" });
      this.Users.set(socket.id, socket);
      // console.log("Users in the server", this.Users);
      // console.log("Rooms in the server", this.Rooms);

      // Create a public room
      socket.on("createPublicRoom", async (roomName: string) => {
        try {
          const room = await this.dbService.createRoom(
            roomName,
            (socket as any).userId,
            "PUBLIC"
          );
          if (room) {
            socket.emit("roomCreated", {
              roomId: room.id,
              roomName: room.name,
              message: "Room created successfully",
            });
            this.Rooms.set(room.id, [socket]);
            // console.log("Rooms in the server", this.Rooms);
          } else {
            socket.emit("roomCreationFailed", {
              message: "Failed to create room",
            });
          }
        } catch (e) {
          console.log(e);
        }
        // console.log(roomName);
      });

      // Create a private room
      socket.on(
        "createPrivateRoom",
        async (roomName: string, roomPassword: string) => {
          try {
            const room = await this.dbService.createRoom(
              roomName,
              (socket as any).userId,
              "PRIVATE",
              roomPassword
            );
            if (room) {
              socket.emit("roomCreated", {
                roomId: room.id,
                roomName: room.name,
                message: "Room created successfully",
              });
              this.Rooms.set(room.id, [socket]);
              // console.log("Rooms in the server", this.Rooms);
            } else {
              socket.emit("roomCreationFailed", {
                message: "Failed to create room",
              });
            }
          } catch (e) {
            console.log(e);
          }
        }
      );
      // Get room details
      socket.on(
        "roomJoined",
        async ({ roomId, userId }: { roomId: string; userId: string }) => {
          await this.getRoomDetails(roomId, userId);
        }
      );

      // Join a public room
      socket.on("joinPublicRoom", async (roomId: string) => {
        if (this.Rooms.has(roomId)) {
          this.Rooms.get(roomId)?.push(socket);
        } else {
          this.Rooms.set(roomId, [socket]);
        }
        await this.joinPublicRoom(roomId);
      });

      // Join a private room
      socket.on(
        "joinPrivateRoom",
        async (roomId: string, roomPassword: string) => {
          if (this.Rooms.has(roomId)) {
            this.Rooms.get(roomId)?.push(socket);
          } else {
            this.Rooms.set(roomId, [socket]);
          }
          await this.joinPrivateRoom(roomId, roomPassword, socket);
        }
      );

      // Leave a room
      socket.on("leaveRoom", async ({ roomId }: { roomId: string }) => {
        await this.leaveRoom(roomId, socket);
      });

      // Add a song to the room
      socket.on(
        "addSong",
        async ({
          roomId,
          song,
        }: {
          roomId: string;
          song: { url: string; name: string; thumbnail: string };
        }) => {
          await this.addSongToRoom(roomId, song, socket);
        }
      );

      // upvote a song
      socket.on(
        "upvote",
        async ({ roomId, songId }: { roomId: string; songId: string }) => {
          await this.upvoteSong(roomId, songId, socket);
        }
      );
      // downvote a song
      socket.on(
        "downvote",
        async ({ roomId, songId }: { roomId: string; songId: string }) => {
          await this.downvoteSong(roomId, songId, socket);
        }
      );

      // set active song
      socket.on(
        "setActiveSong",
        async ({
          roomId,
          songId,
          userId,
        }: {
          roomId: string;
          songId: string;
          userId: string;
        }) => {
          await this.setActiveSong(roomId, songId, userId);
        }
      );

      //  delete active song
      socket.on("deleteActiveSong", async ({ roomId,userId }) => {
        await this.deleteActiveSong(roomId,userId);
      });
      //  delete song entry
      socket.on(
        "deleteSongEntry",
        async ({ roomId, songId,userId }: { roomId: string; songId: string,userId:string }) => {
          console.log(songId,roomId,userId)
          await this.deleteSongEntry(roomId, songId,userId);
        }
      );
      // Disconnect
      socket.on("disconnect", () => {
        this.Users.delete(socket.id);
        console.log("Client disconnected", socket.id);
        this.Rooms.delete(socket.id);
        // console.log("Rooms in the server", this.Rooms);
        // console.log("Users in the server", this.Users);
      });
    });
  }

  private async authenticate(socket: Socket, next: NextFunction) {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }
      const decoded = await verifyToken(token);
      (socket as any).userId = (decoded as any).sub; // Type assertion to allow user property
      // console.log(decoded);
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  }
  async joinPublicRoom(roomId: string) {
    try {
      const room = await this.dbService.getRoom(roomId);
      if (room) {
        this.server.emit("roomJoined", room.id);
        this.Rooms.get(roomId)?.forEach((socket) => {
          socket.emit("userJoined", socket.id);
        });
      } else {
        this.server.emit("roomJoinFailed", "Room not found");
      }
    } catch (e) {
      console.log(e);
    }
  }
  async joinPrivateRoom(roomId: string, roomPassword: string, socket: Socket) {
    try {
      const room = await this.dbService.getRoom(roomId);
      if (room) {
        if (room.password === roomPassword) {
          this.Rooms.get(roomId)?.push(socket);
          socket.emit("userJoined", socket.id);
        } else {
          this.server.emit("roomJoinFailed", "Invalid password");
        }
      } else {
        this.server.emit("roomJoinFailed", "Room not found");
      }
    } catch (e) {
      console.log(e);
    }
  }

  async getRoomDetails(roomId: string, userId?: string) {
    try {
      const room = await this.dbService.getRoom(roomId);
      const users = this.Rooms.get(roomId);
      const socket = users?.find((user: any) => user.userId == userId);
      if (room) {
        const songs = await this.dbService.getAllSongs(roomId);
        const data = {
          ...room,
          songs,
          users: users?.map((socket) => socket.id)?.length,
        };
        if (userId) {socket?.emit("roomDetails", data)
        }
        else{

          this.Rooms.get(roomId)?.forEach((socket) =>
            socket?.emit("roomDetails", data)
        );
        console.log("from room if if------------------")

      }
      } else {
        socket?.emit("roomDetailsFailed", "Room not found");
      }
    } catch (e) {
      console.log(e);
    }
  }

  async leaveRoom(roomId: string, socket: Socket) {
    // console.log(roomId);
    // console.log(this.Rooms);
    if (this.Rooms.has(roomId)) {
      if (this.Rooms.get(roomId)?.length === 1) {
        this.Rooms.delete(roomId);
        this.dbService.deleteRoom(roomId);
        socket.emit("roomDeleted", roomId);
      } else {
        this.Rooms.set(
          roomId,
          this.Rooms.get(roomId)?.filter((s) => s.id !== socket.id) || []
        );
        const room = this.Rooms.get(roomId);
        for (let user of room!) {
          user.emit("userLeft", socket.id);
        }
      }
    }
  }
  async getRoomUsers(roomId: string) {
    if (this.Rooms.has(roomId)) {
      return this.Rooms.get(roomId) || [];
    } else {
      return [];
    }
  }
  async addSongToRoom(
    roomId: string,
    song: { url: string; name: string; thumbnail: string },
    socket: Socket
  ) {
    if (this.Rooms.has(roomId)) {
      const songEntry = await this.dbService.createSongEntry(
        roomId,
        song.url,
        song.name,
        (socket as any).userId,
        song.thumbnail
      );
      if (songEntry) {
        this.Rooms.get(roomId)?.forEach((socket) => {
          socket.emit("newSongAdded", songEntry);
        });
      } else {
        socket.emit("songAdditionFailed", "Failed to add song");
      }
    } else {
      socket.emit("songAdditionFailed", "Room not found");
    }
  }

  async getActiveSong(roomId: string) {
    if (this.Rooms.has(roomId)) {
      const activeSong = await this.dbService.getActiveSong(roomId);
      return activeSong;
    } else {
      return null;
    }
  }
  async setActiveSong(roomId: string, songId: string, userId: string) {
    if (this.Rooms.has(roomId)) {
      const isHost = await this.dbService.Ishost(roomId, userId);
      if (isHost) {
        const activeSong = await this.dbService.setActiveSong(roomId, songId);
        this.Rooms.get(roomId)?.forEach((socket) => {
          socket.emit("activeSongSet", activeSong);
        });
      }
    } else {
      return false;
    }
  }
  async deleteActiveSong(roomId: string,userId:string) {
    if (this.Rooms.has(roomId)) {
      const isHost = await this.dbService.Ishost(roomId,userId)
      if(isHost){
        return this.dbService.deleteActiveSong(roomId);
      }
    } else {
      return false;
    }
  }
  async deleteSongEntry(roomId: string, songId: string,userId:string) {
    if (this.Rooms.has(roomId)) {
    // console.log(songId,roomId)
    const isHost= await this.dbService.Ishost(roomId,userId)
    // console.log("is host ----------------",isHost)
    if(isHost){
      await this.dbService.deleteActiveSong(roomId)
      await this.dbService.deleteSongEntry(roomId, songId);
      const room = this.dbService.getRoom(roomId)
      const users = (await this.getRoomUsers(roomId))?.length
      const songs = await this.dbService.getAllSongs(roomId);
      const updatedSongs = songs.filter(song=>song.id!=songId)
      const data ={
        ...room,
        songs:updatedSongs,
        users
      }
      console.log(data)
      this.Rooms.get(roomId)?.forEach(socket=>{
        socket.emit("roomDetails",data)
      })
    }
    } else return false;
  }
  async upvoteSong(roomId: string, songId: string, socket: Socket) {
    if (this.Rooms.has(roomId)) {
      try {
        const success = await this.dbService.upvoteSong(
          songId,
          (socket as any).userId
        );
        if (success) {
          this.Rooms.get(roomId)?.forEach((socket) => {
            socket.emit("upvote", songId);
          });
        } else {
          this.Rooms.get(roomId)?.forEach((socket) => {
            socket.emit("upvoteFailed", "Failed to upvote song");
          });
        }
      } catch (e) {
        this.Rooms.get(roomId)?.forEach((socket) => {
          socket.emit("upvoteFailed", e);
        });
      }
    } else {
      return false;
    }
  }
  async downvoteSong(roomId: string, songId: string, socket: Socket) {
    if (this.Rooms.has(roomId)) {
      try {
        const success = await this.dbService.deleteUpvote(
          songId,
          (socket as any).userId
        );
        if (success) {
          this.Rooms.get(roomId)?.forEach((socket) => {
            socket.emit("downvote", songId);
          });
        } else {
          this.Rooms.get(roomId)?.forEach((socket) => {
            socket.emit("downvoteFailed", "Failed to downvote song");
          });
        }
      } catch (e) {
        this.Rooms.get(roomId)?.forEach((socket) => {
          socket.emit("downvoteFailed", e);
        });
      }
    } else {
      return false;
    }
  }

}
