var net = require('net');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var noop = function(){};
var errors = require('./errors');
var reMatchContentLength = /^Content-Length: (\d+)\r\n\r\n+/;

var Debugger = function(options){
  var self = this;
  self.port = options && options.port || 5858;
  self.host = options && options.host || 'localhost';
  self.seq  = 0;
  self.watches = {
    indexes: [],
    commands: [],
    callbacks: []
  };
  EventEmitter.call(self);
};

util.inherits(Debugger, EventEmitter);

Debugger.prototype.addResponseWatcher = function(cmd, callback){
  var self = this, idx = self.watches.indexes.length;
  self.watches.indexes[idx] = cmd.seq;
  self.watches.commands[idx] = cmd;
  self.watches.callbacks[idx] = callback;
};

Debugger.prototype.handleResponse = function(pkg){
  var self = this;
  var idx = self.watches.indexes.indexOf(pkg.request_seq);
  var cb, cmd;
  if(idx>-1){
    cb = self.watches.callbacks[idx];
    cmd= self.watches.commands[idx];
    self.watches.indexes.splice(idx, 1);
    self.watches.commands.splice(idx, 1);
    self.watches.callbacks.splice(idx, 1);
    cb(null, {req: cmd, res: pkg});
  }
};

Debugger.prototype.send = function(options, callback){
  var self = this, pkt;
  if(!self.client){
    return self.connect(function(err){
      if(err){
        self.emit('error', err);
        return (callback||noop)(err);
      }
      self.send(options, callback);
    });
  }
  options.seq = ++this.seq;
  options.type = 'request';
  pkt = JSON.stringify(options);
  self.client.write('Content-Length:' + pkt.length + "\r\n\r\n" + pkt);
  if(callback){
    self.addResponseWatcher(options, callback);
  }
};

Debugger.prototype.handleData = function(data){
  var self = this;
  var str = data.toString();
  self.emit('data', str);
  if(!self.v8Info){
    var lines = str.split('\r\n'), key, value, parts;
    self.v8Info={};
    lines.forEach(function(line){
      parts = line.split(':');
      key = parts.shift().trim();
      value = parts.join(':').trim();
      if(key && value && key !== 'Content-Length'){
        self.v8Info[key]=value;
      }
      if(key === 'Content-Length'){
        self._blockSize = parseInt(value);
      }
    });
    self.emit('v8Info', self.v8Info);
    return self._buffer = false;
  }

  if(self._buffer!==false){
    self._buffer += str;
  }
  if(self._buffer===false){
    self._buffer = str.replace(/^(\r\n)+/, '');
  }

  if(self._blockSize === 0){
    var match = reMatchContentLength.exec(self._buffer);
    if(match){
      self._blockSize = parseInt(match[1]);
      self._buffer = self._buffer.substr(match[0].length);
    }
  }

  while(self._blockSize > 0 && self._buffer.length >= self._blockSize){
    var block = self._buffer.substr(0, self._blockSize);
    try{
      var pkg = JSON.parse(block);
    }catch(e){
      return self.emit('error', new errors.ParseError(self._blockSize, block, str));
    }
    if(pkg.type==='response'){
      self.handleResponse(pkg);
    }
    self.emit('content-block', pkg);
    self.emit(pkg.type, pkg);
    self._buffer = self._buffer.substr(self._blockSize);
    var match = reMatchContentLength.exec(self._buffer);
    if(!match){
      return self._blockSize = 0;
    }
    self._blockSize = parseInt(match[1]);
    self._buffer = self._buffer.substr(match[0].length);
  }
};

Debugger.prototype.connect = function(callback){
  var self = this;
  if(self.client){
    self.client.end();
  }
  self.v8Info = false;
  self.client = net.connect(self.port, self.host, function(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift('connected');
    self.emit.apply(self, args);
    (callback||noop).apply(self, arguments);
  });
  self.client.on('data', self.handleData.bind(self));
  self.client.on('end', function(){
    var args = Array.prototype.slice.call(arguments);
    args.unshift(self.client);
    self.emit('end', args);
    self.client = null;
  });
  self.client.on('error', function(err){
    var args = Array.prototype.slice.call(arguments);
    args.unshift('error');
    self.emit.apply(self, args);
  });
};

Debugger.prototype.disconnect = function(){
  var self = this;
  if(self.client){
    self.client.end();
    self.client = null;
  }
};

module.exports = Debugger;
