var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug_route.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};
console.log("rute");


module.exports.setup = function (app, handlers) {
  app.get('/app/api/hello/v1/entities', handlers.entities.list);
  app.get('/app/api/hello/v1/entities/:id', handlers.entities.get);
  app.post('/app/api/hello/v1/entities', handlers.entities.create);
  app.put('/app/api/hello/v1/entities/:id', handlers.entities.update);
  app.delete('/app/api/hello/v1/entities/:id', handlers.entities.remove);
  
  
 app.get('/', function (req, res) {
	 console.log("Hello from foo!");
      res.send('Hello from foo! [express sample]');
  });
  
  app.get('/app/api/', function (req, res) {
	  console.log("Hello from foo! [express sample]");
      res.send('Hello from foo! [express sample]');
  });
  
  app.get('/app/api/hello/foo', function (req, res) {
	   console.log("Hello from foo! [express sample]");
      res.send('Hello from foo! [express sample]');
  });
 
  app.get('/app/api/hello/bar', function (req, res) {
	   console.log("Hello from bar! [express sample]");
      res.send('Hello from bar! [express sample]');
  });
};