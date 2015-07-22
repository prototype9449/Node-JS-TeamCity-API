module.exports.setup = function (app, handlers) {
  app.use(function(req, res, next) {
    req.url = req.url.replace("/app/api", "");
    next();
  });

  app.get('/entities', handlers.entities.list);
  app.get('/entities/:id', handlers.entities.get);
  app.post('/entities', handlers.entities.create);
  app.put('/entities/:id', handlers.entities.update);
  app.delete('/entities/:id', handlers.entities.remove);
  
  app.get('/builds', handlers.build.getResultJson);
   
   app.get('/foo', function (req, res) {
	  res.send('Hello from foo! [/foo]');
     res.send(req);
  });
  app.get('/bar', function (req, res) {
	    res.send('Hello from bar! [/bar]');
	    res.send(req);
  });
    
  app.get('/', function (req, res) {
	    res.send('Hello from api! [app/api]');
	res.send(__dirname);
  });
};