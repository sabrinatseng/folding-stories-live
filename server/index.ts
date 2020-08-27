import express from 'express';
import path from 'path';
import { PORT } from './config/constants';

const app = express();
app.use(express.static(__dirname + "/client"));

let http = require("http").Server(app);
let io = require("socket.io")(http);

app.get('/', (_req, res) => {
    res.sendFile(path.resolve("./client/index.html"))
});

let users: string[] = [];

io.on("connect", function(socket: any) {
    console.log("a user connected");

    socket.on("username", (username: string) => {
        socket.username = username;
        users.push(username);
        console.log(`${username} joined the game.`);
        socket.emit("users", users.toString());
    });

    socket.on("start", () => {
        console.log(`Starting game with ${users}`);
    });

    socket.on("disconnect", () => {
        const index = users.indexOf(socket.username);
        if (index > -1) users.splice(index, 1);
        console.log(`${socket.username} left the game.`);
    });
});

const server = http.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
