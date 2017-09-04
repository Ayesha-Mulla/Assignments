var util = require('util');

var ContentLengthError = function(buffer){
  var self = this;
  Error.call(self);
  self.type = 'Content-Length not found - ';
  self.buffer = buffer;
  self.message = self.type + self.buffer.substr(0, 50);
};
util.inherits(ContentLengthError, Error);

var ParseError = function(blockSize, block, buffer){
  var self = this;
  Error.call(self);
  self.type = 'Parse Error - ';
  self.blockSize = blockSize;
  self.block = block;
  self.buffer = buffer;
  self.message = self.type + self.block;
};

module.exports = {
  ContentLengthError: ContentLengthError,
  ParseError: ParseError
};
