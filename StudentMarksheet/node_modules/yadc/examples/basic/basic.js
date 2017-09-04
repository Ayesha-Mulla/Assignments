var Debug = require('../../index').Debugger;

var debug = new Debug();

debug.on('content-block', function(pkg){
  var type = pkg.type;
  console.log(type.toUpperCase()+':');
  console.log(pkg);
});

debug.on('error', function(err){
  console.error('ERROR:');
  console.error(err.toString());
  process.exit(1);
});

debug.on('end', function(){
  console.log('END:');
  console.log(arguments);
});

debug.connect(function() {
  var msg = { command: 'continue' };
  debug.send(msg, function(err, response){
    console.log('* RESPONSE: ');
    console.log(response);
  });
});
