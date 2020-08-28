class Game {
    users: string[];
    stories: Story[];

    // Track which story user 0 is on. 
    // Can deduce what all users are on from there
    user_0_story_idx: number;

    curr_line: number = 0;

    // Game settings
    num_lines: number;

    constructor() {
        // TODO
    }

    checkEndTurn(): boolean {
        // check the lengths of each story and if they are correct
        // in the future may optimize using a set (requires ES6)
    }

    writeLine(user: string, line: string) {
        // write a line to the story corresponding to this user
        // also call nextTurn() if all lines have been written this turn
    }

    nextTurn() {
        // rotate the stories around, increment curr_line, etc
    }

    getDisplayState(user: string) {
        // get info to display for a particular user so that the
        // frontend can be updated
    }
}

class Story {
    lines: Line[];
    id: number;
    constructor() {
        // TODO
    }

    prevLine(): string {
        // get the previous line of the story.
        // for displaying during a game
    }

    addLine(line: Line) {
        this.lines.push(line);
    }

    length(): number {
        return this.lines.length;
    }

    toString(): string {
        //TODO
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
    }
}