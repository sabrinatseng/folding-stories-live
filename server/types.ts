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
    ended: boolean,
    round: number,
    totalRounds: number,
    debug: string,
    prevLine: Line | null,
    waiting: boolean,
}

export type Line = {
    user: string,
    line: string,
}