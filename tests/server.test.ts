import { expect } from 'chai';
import 'mocha';

const io = require('socket.io-client');
const server = require('../server/index');

const url = "http://localhost:3000";
const options = {
  transports: ['websocket'],
  'forceNew': true,
};

// close server after running all tests
after(() => server.close());

describe('Basic Server Echo Test', () => {
  it("echo", function(done) {
    let client = io.connect(url, options); 
  
    client.once("connect", function () {
      client.once("echo", function (message: string) {
        expect(message).to.be.equal("Hello World");
        client.disconnect();
        done();
      });

      client.emit("echo", "Hello World");
    });
  });
});

describe('Server User Management', () => {
  let client: any, new_client: any;
  before((done) => {
    client = io.connect(url, options);
    client.once("connect", function() {
      new_client = io.connect(url, options);
      new_client.once("connect", function() {
        done();
      });
    });
  });

  after(() => {
    client.disconnect();
    new_client.disconnect();
  });

  it("stores username upon entering", function (done) {
    new_client.once("users", function (message: string) {
      expect(message).to.be.equal("test_user");
    });

    client.once("users", function (message: string) {
      expect(message).to.be.equal("test_user");
      done();
    });

    new_client.emit("username", "test_user");
  });


  it("removes username upon leaving", function (done) {
    new_client.disconnect();
    // client will receive updated users after new_client disconnects
    client.once("users", function (message: string) {
      expect(message).to.be.equal("");
      client.disconnect();
      done();
    });
  }); 
})

describe('Game Start', () => {
  let client: any, client2: any;
  before((done) => {
    client = io.connect(url, options);
    client.once("connect", function() {
      client2 = io.connect(url, options);
      client2.once("connect", function() {
        done();
      });
    });
  });

  after((done) => {
    client.disconnect();
    client2.disconnect();
    done()
  });

  it("notifies all users on game start", function(done) {
    client.once("game_state", function (message: string) {});

    client2.once("game_state", function (message: string) {
      client.disconnect();
      client2.disconnect();
      done();
    });

    client.emit("username", "test_user_1");
    // start game once both usernames are received
    client.once("users", function() {
      client2.emit("username", "test_user_2");
      client2.once("users", function() {
        client.emit("start_game");
      })
    })
  })
})
