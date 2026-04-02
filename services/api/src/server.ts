// src/server.ts
import "dotenv/config"; 
import mongoose from "mongoose";
import http from "http";
import app from "./app";
import { scheduleWorkerStartup } from "./services/buddyAssigner";
import { attachSocket } from "./sockets";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/SOLACE";

//const httpServer = app.listen(PORT, () => console.log(`API on ${PORT}`));
const server = http.createServer(app);
 //socket is attached AFTER server has been created
attachSocket(server);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");

    server.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
      scheduleWorkerStartup();
    });
  })
  .catch((err) => {
    console.error("DB connect error", err);
    process.exit(1);
  });