import { Server as SocketIOServer } from "socket.io";
import type { Server as HTTPServer } from "http";

export function attachSocket(server: HTTPServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join_class", (classId: string) => {
      socket.join(classId);
    });

    socket.on("send_message", (data) => {
      // broadcast to class room
      io.to(data.classId).emit("new_message", data);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}