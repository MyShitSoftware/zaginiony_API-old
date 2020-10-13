const util = require('util');
const events = require('events');
const net = require('net');
const Buffer = require('buffer').Buffer;


const PacketType = {
  COMMAND: 0x02,
  AUTH: 0x03,
  RESPONSE_VALUE: 0x00,
  RESPONSE_AUTH: 0x02
};

function Rcon(host, port, password) {
  if (!(this instanceof Rcon)) return new Rcon(host, port, password);

  this.host = host;
  this.port = port;
  this.password = password;
  this.rconId = 0x0012D4A6;
  this.hasAuthed = false;
  this.outstandingData = null;

  events.EventEmitter.call(this);
};

util.inherits(Rcon, events.EventEmitter);

Rcon.prototype.send = function(data, cmd, id) {
  var sendBuf;

  cmd = cmd || PacketType.COMMAND;
  id = id || this.rconId;

  var length = Buffer.byteLength(data);
  sendBuf = new Buffer.alloc(length + 14);
  sendBuf.writeInt32LE(length + 10, 0);
  sendBuf.writeInt32LE(id, 4);
  sendBuf.writeInt32LE(cmd, 8);
  sendBuf.write(data, 12);
  sendBuf.writeInt16LE(0, length + 12);

  this._sendSocket(sendBuf);
};

Rcon.prototype._sendSocket = function(buf) {
  this._tcpSocket.write(buf.toString('binary'), 'binary');
};

Rcon.prototype.connect = function() {
  var self = this;

  this._tcpSocket = net.createConnection(this.port, this.host);
  this._tcpSocket
    .on('data', function(data) { self._tcpSocketOnData(data) })
    .on('connect', function() { self.socketOnConnect() })
    .on('error', function(err) { self.emit('error', err) })
    .on('end', function() { self.socketOnEnd() });
};

Rcon.prototype.disconnect = function() {
  this._tcpSocket.end();
};

Rcon.prototype.setTimeout = function(timeout, callback) {
  var self = this;
  this._tcpSocket.setTimeout(timeout, function() {
    self._tcpSocket.end();
    if (callback) callback();
  });
};

Rcon.prototype._tcpSocketOnData = function(data) {
  if (this.outstandingData != null) {
    data = Buffer.concat([this.outstandingData, data], this.outstandingData.length + data.length);
    this.outstandingData = null;
  }

  while (data.length) {
    var len = data.readInt32LE(0);
    if (!len) return;

    var id = data.readInt32LE(4);
    var type = data.readInt32LE(8);
    if (len >= 10 && data.length >= len + 4) {
      if (!this.hasAuthed && type == PacketType.RESPONSE_AUTH) {
        if(id === -1) {
          this.emit('error', "Authentication failed");
        }
        else {
          this.emit('auth');
          this.hasAuthed = true;
        }
      } else if (type == PacketType.RESPONSE_VALUE) {
        var str = data.toString('utf8', 12, 12 + len - 10);

        if (str.charAt(str.length - 1) === '\n') {
          str = str.substring(0, str.length - 1);
        }

        else if(str !== 'Keep Alive') {
          this.emit('response', str);
        }
      }
      else {
        this.emit('error', "Internal Error");
      }

      data = data.slice(12 + len - 8);
    } else {
      this.outstandingData = data;
      break;
    }
  }
};

Rcon.prototype.socketOnConnect = function() {
  this.emit('connect');
  this.send(this.password, PacketType.AUTH);
};

Rcon.prototype.socketOnEnd = function() {
  this.emit('end');
  this.hasAuthed = false;
};

module.exports = Rcon;
