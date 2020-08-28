export class Game {
    users: string[];
    stories: Story[];

    // Track which story user 0 is on. 
    // Can deduce what all users are on from there
    user_0_story_idx: number;

    curr_line: number = 0;

    // Game settings
    num_lines: number;

    constructor(users: string[], num_lines: number) {
        this.users = users.slice();
        this.stories = Array.from(this.users, _ => new Story());
        this.user_0_story_idx = 0;
        this.num_lines = num_lines;
    }

    checkEndTurn(): boolean {
        // check the lengths of each story and if they are correct
        // in the future may optimize using a set (requires ES6)
        return false;
    }

    writeLine(user: string, line: string) {
        // write a line to the story corresponding to this user
        // also call nextTurn() if all lines have been written this turn
    }

    nextTurn() {
        // rotate the stories around, increment curr_line, etc
    }

    getDisplayState(user: string): string | null {
        // get info to display for a particular user so that the
        // frontend can be updated
        if (this.users.includes(user)) {
            return `this is the state string for user ${user}`;
        }
        return null;
    }
}

export class Story {
    lines: Line[];
    constructor() {
        this.lines = [];
    }

    prevLine(): Line {
        // get the previous line of the story.
        // for displaying during a game
        return this.lines.length ? this.lines[this.lines.length - 1] : {user: "", line: ""};
    }

    writeLine(line: Line) {
        this.lines.push(line);
    }

    length(): number {
        return this.lines.length;
    }

    toString(): string {
        //TODO
        return "";
    }
}

class Line {
    line: string;
    user: string;
    constructor(line: string, user: string) {
        this.line = line;
        this.user = user;
    }

    toString(): string {
        // TODO
        return this.line;
    }
}