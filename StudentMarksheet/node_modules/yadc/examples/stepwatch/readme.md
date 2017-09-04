Overview
========

Quick and dirty (really dirty) stepping debugger.

This works by starting the target application (test.js) in debug mode in a start
stopped state.  This lets us step through EVERY thing that goes on inside the
application.  Stepwatch then continually issues the continue command with a
stepSize of 1 (increment to the next step only).

NOTE: This is VERY slow.  This is why the test.js file is so short and simple.
Trying to run this on a real project (say a webserver) would result in hours
to startup and actually do something.

Usage
=====

In one console window run test.js with --debug-brk:

```
node --debug-brk test.js
```

In another window run stepwatch.js:

```
node stepwatch.js
```

Watch all the output that comes from the application.
