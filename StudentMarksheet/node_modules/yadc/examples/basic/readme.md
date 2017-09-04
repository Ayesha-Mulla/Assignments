Usage
=====

In one console window run some Node.js script with --debug-brk:

```
node --debug-brk yourscript.js
```

In another window run basic.js:

```
node basic.js
```

Watch the output, you will see all the messages that are available if you do
a passive watch of a running application.  Things like frame compiles, etc.
