import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

socket.on("connect", () => {
  console.log("✅ Connected as client");
  socket.emit("joinUser", "test-user-id");
});

socket.on("lead:new", (data) => console.log("📩 New Lead Event:", data));
socket.on("lead:assigned", (data) => console.log("📋 Lead Assigned:", data));
socket.on("lead:updated", (data) => console.log("🔄 Lead Updated:", data));
socket.on("activity:new", (data) => console.log("📝 Activity Added:", data));