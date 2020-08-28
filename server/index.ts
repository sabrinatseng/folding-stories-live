import express from 'express';
import path from 'path';
import http from 'http';
import socketio from 'socket.io';
import { EventTypes, PORT } from './config/constants';

const app = express();
app.use(express.static(__dirname + "/client"));

let server = new http.Server(app);
let io = socketio(server);

app.get('/', (_req, res) => {
    res.sendFile(path.resolve("./client/index.html"))
});

let users: string[] = [];

io.on("connect", function(socket: any) {
    console.log("a user connected");

    socket.on(EventTypes.Username, (username: string) => {
        socket.username = username;
        users.push(username);
        console.log(`${username} joined the game.`);
        io.emit(EventTypes.Users, users.toString());
    });

    socket.on(EventTypes.StartGame, () => {
        console.log(`Starting game with ${users}`);
    });

    socket.on(EventTypes.Disconnect, () => {
        const index = users.indexOf(socket.username);
        if (index > -1) {
            users.splice(index, 1);
            io.emit(EventTypes.Users, users.toString());
            console.log(`${socket.username} left the game.`);
        }
    });

    // for testing purposes
    socket.on(EventTypes.Echo, (message: string) => {
        socket.emit(EventTypes.Echo, message);
    })
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

exports.close = () => server.close();