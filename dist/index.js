"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = __importDefault(require("socket.io"));
var constants_1 = require("./config/constants");
var game_1 = require("./game");
var app = express_1.default();
app.use(express_1.default.static(__dirname + "/client"));
var server = new http_1.default.Server(app);
var io = socket_io_1.default(server);
app.get('/', function (_req, res) {
    res.sendFile(path_1.default.resolve("./client/index.html"));
});
// TODO use rooms
// also move this out to a db or something
var users = [];
var game = null;
io.on("connect", function (socket) {
    console.log("a user connected");
    socket.on("username" /* Username */, function (username) {
        socket.username = username;
        users.push(username);
        console.log(username + " joined the game.");
        io.emit("users" /* Users */, users.toString());
    });
    socket.on("start_game" /* StartGame */, function () {
        console.log("Starting game with " + users);
        game = new game_1.Game(users, constants_1.DEFAULT_NUM_LINES);
        notifyGameState(game);
    });
    socket.on("write_line" /* WriteLine */, function (line) {
        var username = socket.username;
        console.log("Received line " + line + " from " + username);
        game === null || game === void 0 ? void 0 : game.writeLine(username, line);
        notifyGameState(game);
    });
    socket.on("disconnect" /* Disconnect */, function () {
        var index = users.indexOf(socket.username);
        if (index > -1) {
            users.splice(index, 1);
            io.emit("users" /* Users */, users.toString());
            console.log(socket.username + " left the game.");
        }
    });
    // for testing purposes
    socket.on("echo" /* Echo */, function (message) {
        socket.emit("echo" /* Echo */, message);
    });
});
server.listen(constants_1.PORT, function () {
    console.log("Server is listening on port " + constants_1.PORT);
});
function notifyGameState(game) {
    if (game === null)
        return;
    console.log("emitting game state");
    var sockets = io.sockets.sockets;
    Object.values(sockets).forEach(function (socket) {
        if (socket.username != null) {
            var state = game.getDisplayState(socket.username);
            if (state != null) {
                socket.emit("game_state" /* GameState */, state);
            }
        }
    });
}
exports.close = function () { return server.close(); };
