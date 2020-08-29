import { expect } from 'chai';
import 'mocha';
import { Game } from '../server/game';

describe("Start Game", () => {
    let users = ["test_user_1", "test_user_2"];
    let game = new Game(users, 2);

    it("creates a new game", function(done) {
        expect(game.userInGame("test_user_1")).to.be.true;
        expect(game.userInGame("test_user_2")).to.be.true;
        expect(game.getStories().length).to.be.equal(users.length);
        expect(game.gameEnded()).to.be.false;
        expect(game.getCurrRound()).to.be.equal(1);
        done();
    })
})

describe("Basic Gameplay", () => {
    let users = ["test_user_1", "test_user_2"];
    let game = new Game(users, 2); 

    it("writes line", function(done) {
        game.writeLine("test_user_1", "hello");
        expect(game.getStories()[0].length()).to.be.equal(1);
        expect(game.getStories()[1].length()).to.be.equal(0);
        expect(game.gameEnded()).to.be.false;
        expect(game.getCurrRound()).to.be.equal(1);
        done();
    })

    it("advances after all users have written", function(done) {
        game.writeLine("test_user_2", "hello2");
        expect(game.getStories()[1].length()).to.be.equal(1);
        expect(game.gameEnded()).to.be.false;
        expect(game.getCurrRound()).to.be.equal(2);
        done();
    })

    it("rotates stories each round", function(done) {
        game.writeLine("test_user_1", "world");
        game.writeLine("test_user_2", "world2");
        let stories = game.getStories();

        // first story should have [test_user_1: hello, test_user_2: world2]
        expect(stories[0].getLines()).to.be.eql([
            {user: "test_user_1", line: "hello"},
            {user: "test_user_2", line: "world2"}
        ]);

        // second story should have [test_user_2: hello2, test_user_1: world]
        expect(stories[1].getLines()).to.be.eql([
            {user: "test_user_2", line: "hello2"},
            {user: "test_user_1", line: "world"}
        ]);

        done();
    })

    it("ends after num_lines have been written", function(done) {
        expect(game.gameEnded()).to.be.true;
        done();
    })
})

describe("Gameplay Edge Cases", () => {
    let users = ["test_user_1", "test_user_2"];
    let game = new Game(users, 2); 

    it("only writes the first line if a user tries to submit multiple lines in a round", function(done) {
        game.writeLine("test_user_1", "hello");
        game.writeLine("test_user_1", "hello_again");
        expect(game.getStories()[0].length()).to.be.equal(1);
        expect(game.getStories()[0].getLine(0)).to.be.eql({
            user: "test_user_1",
            line: "hello"
        });
        done();
    })
})