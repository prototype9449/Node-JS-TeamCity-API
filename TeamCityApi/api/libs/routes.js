module.exports.setup = function (app, handlers) {

  app.use(function(req, res, next) {
    req.url = req.url.replace("/TeamCityApi/api", "");
    next();
  });

  for (handler in handlers) {
    handlers[handler].setupHandlers(app);
  }
};