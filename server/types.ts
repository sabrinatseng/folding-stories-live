export const enum EventTypes {
    Username = "username",
    StartGame = "start_game",
    GameState = "game_state",
    WriteLine = "write_line",
    GameEnd = "game_end",
    Disconnect = "disconnect",
    Echo = "echo",
    Users = "users",
}

export type UserState = {
    debug: string,
    display: string,
}

export type Line = {
    user: string,
    line: string,
}