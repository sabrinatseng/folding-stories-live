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
        return this.stories.every((story: Story) => story.length() == this.curr_line + 1);
    }

    writeLine(user: string, line: string) {
        // write a line to the story corresponding to this user
        // also call nextTurn() if all lines have been written this turn
        let user_idx = this.users.indexOf(user);
        if (user_idx >= 0) {
            let story_idx = (user_idx + this.user_0_story_idx) % this.users.length;

            this.stories[story_idx].writeLine(new Line(user, line));

            if (this.checkEndTurn()) this.nextTurn();
        }
    }

    nextTurn() {
        // rotate the stories around, increment curr_line, etc
        this.user_0_story_idx = (this.user_0_story_idx + 1) % this.users.length;
        this.curr_line++;
    }

    getDisplayState(user: string): string | null {
        // get info to display for a particular user so that the
        // frontend can be updated
        if (this.users.includes(user)) {
            return `currently on round ${this.curr_line + 1}, state for user ${user}`;
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
    constructor(user: string, line: string) {
        this.line = line;
        this.user = user;
    }

    toString(): string {
        // TODO
        return this.line;
    }
}