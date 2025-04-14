import {Router,Request,Response} from "express";
import { DbService } from "../services/DbService";
const CommonRouter:Router = Router()
const dbService = new DbService()
CommonRouter.get("/",(req:Request,res:Response)=>{
    res.send("Hello World")
})
CommonRouter.get("/rooms",async(req:Request,res:Response)=>{
    const rooms = await dbService.getRooms()
    const roomsWithHostName = await Promise.all(rooms.map(async (room) => {
        const hostName = await dbService.getUserName(room.hostId)
        return { ...room, hostName }
    }))
    res.json(roomsWithHostName)
})

export default CommonRouter;
