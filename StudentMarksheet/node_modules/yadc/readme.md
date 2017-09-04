YADC
====

YADC (Yet Another Debug Client) is a wrapper around the [V8 Debug
Protocol](https://code.google.com/p/v8/wiki/DebuggerProtocol).

YADC extends from EventEmitter and provides all of the V8 Debugger
types as events.  Support is built in for callbacks to types that
provide some feedback (EG: continue command).

How it works
============

The V8 Debugger API uses a custom String with JSON payload that
looks something like:

```
Content-Length: <number>

{some: value, type: type, ...}Content-Length: <number>

...
```

YADC sets up a sliding window buffer where new data is pushed
on to the end of the buffer, the buffer is then scanned
for the currently known Content-Length value and if the buffer
is larger than the Content-Length it is then processed.  If
it is not longer then it waits for another buffer to arrive
and pushes this buffer on to the internal buffer.  Once
enough data has arrived to form a packet it is parsed and
the corresponding events are fired.

The tricky part is that a new Content-Length section can
be in the middle of an existing packet, but luckily never seems
to span multiple packets.  Thus each time a new Content-Length
identifier is found the buffer is evaluated for a packet.

Testing
=======

It's actually pretty difficult to test something like this.
Rather than write a bunch of test cases that don't actually
stress the debugger I run it directly against large projects
for hours on end looking for errors to popup.  If you happen
across an error please post as much information as possible.

API
===

Debugger
--------

Constructor to create a new Debugger object.

Debugger(options)

Available Options (optional):
  * port - Port to connect on, default 5858
  * host - Host of the application, default localhost

###Usage:
```
var Debug = require('YADC').Debugger;
var debug = new Debugger({
  port: 5858,
  host: 'localhost'
});
```

Debugger.connect
----------------

Connects to remote session and calls callback when connection is ready.

Debugger.connect(callback)

###Usage:
```
var Debug = require('YADC').Debugger;
var debug = new Debugger({
  port: 5858,
  host: 'localhost'
});
debug.connect(function(){
  debug.send({command: 'continue'});
});
```

Debugger.send
-------------

Sends a command to the remote session, if not connected will call
connect first and once the connection is established then will send the command.

If you supply a callback when a response to the command comes back (based on req_seq)
the callback will be called.

Debugger.send(commandObject, callback)

Available Arguments:
  * commandObject - V8 Command Object, see  [V8 Debug
Protocol](https://code.google.com/p/v8/wiki/DebuggerProtocol) for more info.
  * callback - Optional, called if/when the command returns a response.

###Usage:
```
var Debug = require('YADC').Debugger;
var debug = new Debugger({
  port: 5858,
  host: 'localhost'
});
debug.send({
    command: 'continue',
    arguments: {
      stepaction: 'next',
      stepcount: 1
    }
  }, function(err, frame){
    nextStep(); // whatever
  });
```

Debugger.disconnect
-------------------

Disconnects from the remote session.

Debugger.disconnect()

Debugger.on
-----------

Used to listen for events on the Debugger.

Debugger.on(eventName, callback)

Available Arguments:
  * eventName - Name of event to listen for.
  * callback - Called when the event is emitted.

###Usage:
```
var Debug = require('YADC').Debugger;
var debug = new Debugger({
  port: 5858,
  host: 'localhost'
});
debug.on('connected', function(){
  console.log('Connected');
});
debug.connect();
```

Events
======

connected
---------

Called once the Debugger has connected to the remote session.

connected()

Available Arguments:
  * None

error
-----

Called when there is an error.

error(errorObject)

Available Arguments:
  * errorObject - Error object that was thrown.

data
----

Called any time data is recieved from the remote session.  The raw value
is passed as a string.

data(dataStr)

Available Arguments:
  * dataStr - The raw data string as passed from the remote debugger.

v8Info
------

Called after a connection to a remote session is established.  Provides
the details of the V8 instance connected to.

v8Info(info)

Available Arguments:
  * info - The v8 configuration object as returned by the remote session.

content-block
-------------

Called any time there is a message posted from the remote session.  Provides
the parsed JSON object.

content-block(data)

Available Arguments:
  * data - The JSON object from the message.

end
---

Called when the remote session terminates.

end()

v8::type
--------

All of the v8 message types get emitted out as their pkg.type for
easier consumption.

As an example:
```
{ seq: 1,
  type: 'event',
  event: 'afterCompile',
  success: true,
  body:
   { script:
      { handle: 1,
        type: 'script',
        name: 'console.js',
        id: 47,
        lineOffset: 0,
        columnOffset: 0,
        lineCount: 110,
        sourceStart: '(function (exports, require, module, __filename, __dirname) { // Copyright Joyen',
        sourceLength: 3303,
        scriptType: 2,
        compilationType: 0,
        context: [Object],
        text: 'console.js (lines: 110)' } },
  refs: [ { handle: 0, type: 'context', text: '#<ContextMirror>' } ],
  running: true }
```

Would be emitted as an 'event' event.  And could be captured using:
```
debug.on('event', myHandler);
```
