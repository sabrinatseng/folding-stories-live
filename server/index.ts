import express from 'express';
import path from 'path';
import http from 'http';
import socketio from 'socket.io';
import { DEFAULT_NUM_LINES, PORT } from './config/constants';
import { EventTypes } from './types';
import { Game } from './game';

const app = express();
app.use(express.static(__dirname + "/client"));

let server = new http.Server(app);
let io = socketio(server);

app.get('/', (_req, res) => {
    res.sendFile(path.resolve("./client/index.html"))
});

// TODO use rooms
// also move this out to a db or something
let users: string[] = [];
let game: Game | null = null;

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
        game = new Game(users, DEFAULT_NUM_LINES);
        notifyGameState(game);
    });

    socket.on(EventTypes.WriteLine, (line: string) => {
        let username = socket.username;
        console.log(`Received line ${line} from ${username}`);
        game?.writeLine(username, line);
        notifyGameState(game);
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

function notifyGameState(game: Game | null) {
    if (game === null) return;
    console.log("emitting game state");
    if (game.gameEnded()) console.log("game ended");
    let sockets: { [id: string]: any } = io.sockets.sockets;
    Object.values(sockets).forEach(socket => {
        if (socket.username != null && game.userInGame(socket.username)) {
            if (game.gameEnded()) {
                socket.emit(EventTypes.GameEnd, JSON.stringify(game.getStories()));
            }
            else {
                socket.emit(EventTypes.GameState, JSON.stringify(game.getState(socket.username)));
            }
        } 
    });
}

exports.close = () => server.close();