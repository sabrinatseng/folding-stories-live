"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var Game = /** @class */ (function () {
    function Game(users, num_lines) {
        this.curr_line = 0;
        this.ended = false;
        this.users = users.slice();
        this.stories = Array.from(this.users, function (_) { return new Story(); });
        this.num_lines = num_lines;
    }
    Game.prototype.gameEnded = function () {
        return this.ended;
    };
    Game.prototype.userInGame = function (user) {
        return this.users.includes(user);
    };
    Game.prototype.checkEndTurn = function () {
        var _this = this;
        // check the lengths of each story and if they are correct
        // in the future may optimize using a set (requires ES6)
        return this.stories.every(function (story) { return story.length() == _this.curr_line + 1; });
    };
    Game.prototype.writeLine = function (user, line) {
        // write a line to the story corresponding to this user
        // also call nextTurn() if all lines have been written this turn
        if (this.users.includes(user)) {
            var user_idx = this.users.indexOf(user);
            var story_idx = (user_idx + this.curr_line) % this.users.length;
            this.stories[story_idx].writeLine({ user: user, line: line });
            if (this.checkEndTurn())
                this.nextTurn();
        }
    };
    Game.prototype.nextTurn = function () {
        this.curr_line++;
        if (this.curr_line == this.num_lines)
            this.ended = true;
    };
    Game.prototype.getState = function (user) {
        // get info to display for a particular user so that the
        // frontend can be updated
        var user_idx = this.users.indexOf(user);
        var story_idx = (user_idx + this.curr_line) % this.users.length;
        var debug = "currently on round " + (this.curr_line + 1) + ", state for user " + user;
        var display = "";
        if (this.curr_line > 0) {
            display += "\nprevious line: " + JSON.stringify(this.stories[story_idx].getLine(this.curr_line - 1));
        }
        return { debug: debug, display: display };
    };
    Game.prototype.getStories = function () {
        return this.stories;
    };
    Game.prototype.getCurrRound = function () {
        return this.curr_line + 1;
    };
    return Game;
}());
exports.Game = Game;
var Story = /** @class */ (function () {
    function Story() {
        this.lines = [];
    }
    Story.prototype.getLine = function (idx) {
        // assume idx is between 0 and this.lines.length
        return this.lines[idx];
    };
    Story.prototype.writeLine = function (line) {
        this.lines.push(line);
    };
    Story.prototype.length = function () {
        return this.lines.length;
    };
    Story.prototype.getLines = function () {
        return this.lines;
    };
    Story.prototype.toString = function () {
        //TODO
        return "";
    };
    return Story;
}());
