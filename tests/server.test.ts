import { expect } from 'chai';
import 'mocha';

const io = require('socket.io-client');
const url = "http://localhost:3000";

describe('Connect to server', () => {
  let server: any;
  const options = {
    transports: ['websocket'],
    'forceNew': true,
  };

  before(() => server = require('../dist/index'));

  after(() => server.close());

  it("stores username", function (done) {
    var client = io.connect(url, options);

    client.once("connect", function () {
      client.once("users", function (message: string) {
        expect(message).to.be.equal("test_user");

        client.disconnect();
        done();
      });

      client.emit("username", "test_user");
    });
  });

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
