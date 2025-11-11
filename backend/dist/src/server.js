import { createServer } from "http";
import { Server } from "socket.io";
import app from './app.js';
import { env } from "./config/env.js";
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });
// Export io for controllers
export { io };
io.on("connection", (socket) => {
    // Client should join personal room after auth
    socket.on("joinUser", (userId) => {
        socket.join(`user:${userId}`);
    });
    // Optional: join a lead-specific room for timelines
    socket.on("joinLead", (leadId) => {
        socket.join(`lead:${leadId}`);
    });
});
httpServer.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
});
