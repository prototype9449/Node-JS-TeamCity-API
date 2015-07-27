module.exports.setup = function (app, handlers, htmlContentGeneratorHandlers) {

  app.use(function(req, res, next) {
    req.url = req.url.replace("/TeamCityApi/api", "");
    next();
  });

  for (handler in handlers) {
    handlers[handler].setupHandlers(app);
  }
  for(htmlContentGeneratorHandler in htmlContentGeneratorHandlers){
    var htmlHandler = htmlContentGeneratorHandlers[htmlContentGeneratorHandler];
    htmlHandler.module.setupHandlers(app, htmlHandler.restApiPath, htmlHandler.configOptionName, htmlHandler.pageHtmlTemplatePath);
  }
};