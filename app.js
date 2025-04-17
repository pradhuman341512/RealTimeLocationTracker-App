const http = require('http');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set EJS as the view engine
app.set("view engine", "ejs");

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, "public")));

// WebSocket handling
io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
        console.log("User disconnected:", socket.id);
    });
});

// Route to render main page
app.get('/', (req, res) => {
    res.render('index');
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
