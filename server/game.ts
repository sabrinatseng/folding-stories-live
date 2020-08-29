import { Line, UserState } from './types';

export class Game {
    users: string[];
    stories: Story[];

    curr_line: number = 0;
    ended: boolean = false;

    // Game settings
    num_lines: number;

    constructor(users: string[], num_lines: number) {
        this.users = users.slice();
        this.stories = Array.from(this.users, _ => new Story());
        this.num_lines = num_lines;
    }

    gameEnded(): boolean {
        return this.ended;
    }

    userInGame(user: string): boolean {
        return this.users.includes(user);
    }

    checkEndTurn(): boolean {
        // check the lengths of each story and if they are correct
        // in the future may optimize using a set (requires ES6)
        return this.stories.every((story: Story) => story.length() == this.curr_line + 1);
    }

    writeLine(user: string, line: string) {
        // write a line to the story corresponding to this user
        // also call nextTurn() if all lines have been written this turn
        if (this.users.includes(user)) {
            let user_idx = this.users.indexOf(user);
            let story_idx = (user_idx + this.curr_line) % this.users.length;

            this.stories[story_idx].writeLine({user, line});

            if (this.checkEndTurn()) this.nextTurn();
        }
    }

    nextTurn() {
        this.curr_line++;
        if (this.curr_line == this.num_lines) this.ended = true;
    }

    getState(user: string): UserState {
        // get info to display for a particular user so that the
        // frontend can be updated
        let user_idx = this.users.indexOf(user);
        let story_idx = (user_idx + this.curr_line) % this.users.length;
        let debug = `currently on round ${this.curr_line + 1}, state for user ${user}`;
        let display = "";
        if (this.curr_line > 0) {
            display += `\nprevious line: ${JSON.stringify(this.stories[story_idx].getLine(this.curr_line - 1))}`;
        }
        return {debug, display};
    }

    getStories(): Story[] {
        return this.stories;
    }

    getCurrRound(): number {
        return this.curr_line + 1;
    }
}

class Story {
    lines: Line[];
    constructor() {
        this.lines = [];
    }

    getLine(idx: number): Line {
        // assume idx is between 0 and this.lines.length
        return this.lines[idx];
    }

    writeLine(line: Line) {
        this.lines.push(line);
    }

    length(): number {
        return this.lines.length;
    }

    getLines(): Line[] {
        return this.lines;
    }

    toString(): string {
        //TODO
        return "";
    }
}
