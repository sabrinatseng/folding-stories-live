import { Line, UserState } from './types';

export class Game {
    users: string[];
    stories: Story[];

    curr_line: number = 0;
    ended: boolean = false;

    // Game settings
    rounds: number;

    constructor(users: string[], rounds: number) {
        this.users = users.slice();
        this.stories = Array.from(this.users, _ => new Story());
        this.rounds = rounds;
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
        // does nothing if user has already written line for this turn
        // also call nextTurn() if all lines have been written this turn
        if (this.users.includes(user)) {
            let user_idx = this.users.indexOf(user);
            let story_idx = (user_idx + this.curr_line) % this.users.length;

            if (this.stories[story_idx].length() == this.curr_line)
                this.stories[story_idx].writeLine({user, line});

            if (this.checkEndTurn()) this.nextTurn();
        }
    }

    nextTurn() {
        this.curr_line++;
        if (this.curr_line == this.rounds) this.ended = true;
    }

    getState(user: string): UserState {
        // get info to display for a particular user so that the
        // frontend can be updated
        let user_idx = this.users.indexOf(user);
        let story_idx = (user_idx + this.curr_line) % this.users.length;
        return {
            ended: this.ended,
            round: this.ended ? this.curr_line : this.curr_line + 1,
            totalRounds: this.rounds,
            debug: "", 
            prevLine: this.curr_line ? this.stories[story_idx].getLine(this.curr_line - 1) : null,
            // waiting if user has already written line for this round
            waiting: !this.ended && (this.stories[story_idx].length() > this.curr_line),
        };
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
