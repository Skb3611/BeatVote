import express from "express";
import { createServer } from "http";
import { config } from "../config";
import { WebSocketService } from "../services/WebSocketService";
import { DbService } from "../services/DbService";
import CommonRouter from "../routes/CommonRouter";
import cors from "cors";
const app = express();
const httpServer = createServer(app);
app.use(express.json());
app.use(cors({
  origin: config.appUrl,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}))

const dbService = new DbService();

const io = new WebSocketService(httpServer);
io.init();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/api/webhook", async (req, res) => {
  try {
    const { type, data } = req.body;
    // console.log(type, data);

    if (type === "user.created") {
      
      await dbService.createUser(data.id, data.email_addresses[0].email_address, data.first_name);
    }
  } catch (error) {
    console.log(error);
  }
});
app.use("/api/common",CommonRouter)

httpServer.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});
