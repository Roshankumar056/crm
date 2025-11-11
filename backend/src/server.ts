import { createServer } from "http";
import { Server } from "socket.io";
import { app } from "./app";
import { env } from "./config/env";
import prisma from "./db/prisma"; // ✅ singleton prisma client

const PORT = env.PORT || 8080;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

// ✅ export socket server to use inside controllers
export { io };

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  socket.on("joinUser", (userId: string) => {
    socket.join(`user:${userId}`);
  });

  socket.on("joinLead", (leadId: string) => {
    socket.join(`lead:${leadId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`✅ API listening on http://localhost:${PORT}`);
});

// ✅ Graceful shutdown (fixes prepared statement error)
process.on("SIGINT", async () => {
  console.log("🔌 Server shutting down...");
  await prisma.$disconnect();
  httpServer.close(() => process.exit(0));
});

process.on("SIGTERM", async () => {
  console.log("🔌 Server shutting down...");
  await prisma.$disconnect();
  httpServer.close(() => process.exit(0));
});
