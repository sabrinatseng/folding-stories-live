export const PORT = process.env.PORT || 3000;

export const enum EventTypes {
    Username = "username",
    StartGame = "start_game",
    Disconnect = "disconnect",
    Echo = "echo",
    Users = "users",
}