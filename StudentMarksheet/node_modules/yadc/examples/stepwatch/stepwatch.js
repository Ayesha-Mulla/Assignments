var Debug = require('../../index').Debugger;

var debug = new Debug();

debug.on('content-block', function(pkg){
  var type = pkg.type||'undefined';
  console.log(type.toUpperCase()+':');
  console.log(pkg);
});

debug.on('error', function(err){
  console.error('ERROR:');
  console.error(err);
  debug.disconnect();
  process.exit(1);
});

debug.on('end', function(){
  console.log('END:');
  console.log(arguments);
});

var step = function(){
  debug.send({command: 'continue', arguments: {stepaction: 'next', stepcount: 1}}, function(err, frame){
    //console.log('STEP:');
    //console.log(frame);
    step();
  });
};

debug.connect(function() {
  step();
});
