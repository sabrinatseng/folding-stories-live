"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Story = exports.Game = void 0;
var Game = /** @class */ (function () {
    function Game(users, num_lines) {
        this.curr_line = 0;
        this.users = users.slice();
        this.stories = Array.from(this.users, function (_) { return new Story(); });
        this.user_0_story_idx = 0;
        this.num_lines = num_lines;
    }
    Game.prototype.checkEndTurn = function () {
        var _this = this;
        // check the lengths of each story and if they are correct
        // in the future may optimize using a set (requires ES6)
        return this.stories.every(function (story) { return story.length() == _this.curr_line + 1; });
    };
    Game.prototype.writeLine = function (user, line) {
        // write a line to the story corresponding to this user
        // also call nextTurn() if all lines have been written this turn
        var user_idx = this.users.indexOf(user);
        if (user_idx >= 0) {
            var story_idx = (user_idx + this.user_0_story_idx) % this.users.length;
            this.stories[story_idx].writeLine(new Line(user, line));
            if (this.checkEndTurn())
                this.nextTurn();
        }
    };
    Game.prototype.nextTurn = function () {
        // rotate the stories around, increment curr_line, etc
        this.user_0_story_idx = (this.user_0_story_idx + 1) % this.users.length;
        this.curr_line++;
    };
    Game.prototype.getDisplayState = function (user) {
        // get info to display for a particular user so that the
        // frontend can be updated
        if (this.users.includes(user)) {
            return "currently on round " + (this.curr_line + 1) + ", state for user " + user;
        }
        return null;
    };
    return Game;
}());
exports.Game = Game;
var Story = /** @class */ (function () {
    function Story() {
        this.lines = [];
    }
    Story.prototype.prevLine = function () {
        // get the previous line of the story.
        // for displaying during a game
        return this.lines.length ? this.lines[this.lines.length - 1] : { user: "", line: "" };
    };
    Story.prototype.writeLine = function (line) {
        this.lines.push(line);
    };
    Story.prototype.length = function () {
        return this.lines.length;
    };
    Story.prototype.toString = function () {
        //TODO
        return "";
    };
    return Story;
}());
exports.Story = Story;
var Line = /** @class */ (function () {
    function Line(user, line) {
        this.line = line;
        this.user = user;
    }
    Line.prototype.toString = function () {
        // TODO
        return this.line;
    };
    return Line;
}());
