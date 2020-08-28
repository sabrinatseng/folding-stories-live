import { expect } from 'chai';
import 'mocha';

const io = require('socket.io-client');
const server = require('../dist/index');

const url = "http://localhost:3000";
const options = {
  transports: ['websocket'],
  'forceNew': true,
};

// close server after running all tests
after(() => server.close());

describe('Basic Server Echo Test', () => {
  it("echo", function(done) {
    var client = io.connect(url, options); 
  
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
  before(() => {
    client = io.connect(url, options);
    new_client = io.connect(url, options);
  });

  it("stores username upon entering", function (done) {
    client.once("connect", function () {
      new_client.once("connect", function () {
        // both clients are connected, both clients should receive users
        new_client.once("users", function (message: string) {
          expect(message).to.be.equal("test_user");
        });

        client.once("users", function (message: string) {
          expect(message).to.be.equal("test_user");
          done();
        });
  
        new_client.emit("username", "test_user");
      });
    });
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
