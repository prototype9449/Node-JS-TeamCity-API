 var express = require('express');
 
  var app = express();
 
  app.get('/', function (req, res) {
      res.send('Hello from foo! [express sample]');
  });
  
  app.get('/app/api/', function (req, res) {
      res.send('Hello from foo! [express sample]');
  });
  
  app.get('/app/api/server/hello/foo', function (req, res) {
      res.send('Hello from foo! [express sample]');
  });
 
  app.get('/app/api/server/hello/bar', function (req, res) {
      res.send('Hello from bar! [express sample]');
  });
 
  app.listen(process.env.PORT);