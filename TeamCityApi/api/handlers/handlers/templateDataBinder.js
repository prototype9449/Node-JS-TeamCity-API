var getHtmlContentForCurrentTemplate = function (optionConfigName, currentPageTemplateSubdirectoryPath){
    var getHtmlContent = function (req, res) {
        var config = require('../../libs/config');

        var request = require('request');
        var options = config.get(optionConfigName);
        request.get(options, function (err, response) {
            if (err) throw err;

            res.writeHeader(200, {"Content-Type": "text/plain"});

            var pathDirectory = __dirname + currentPageTemplateSubdirectoryPath;
//            var pathDirectory = __dirname + '\\..\\..\\public\\pages\\json-issue.html';

            var swig = require('swig');
            var template = swig.compileFile(pathDirectory);

            var bindingJson = JSON.parse(response.body);
//            var bindingJson = response.body;
            console.log(response.body);
            var renderedHtml = template(bindingJson);

            // Working example
//            var renderedHtml = template({
//                agents: [
//                    {
//                        href: "/httpAuth/app/rest/agents/id:3",
//                        id: 3,
//                        name: "localhost",
//                        typeId: 3
//                    },
//                    {
//                        href: "/httpAuth/app/rest/agents/id:1",
//                        id: 1,
//                        name: "NickKuzminPC",
//                        typeId: 1
//                    }
//                ]
//            });

              // Bug
//              var renderedHtml = template({
//                  "agent": [
//                      {
//                          "href": "/httpAuth/app/rest/agents/id:3",
//                          "id": 3,
//                          "name": "localhost",
//                          "typeId": 3
//                      },
//                      {
//                          "href": "/httpAuth/app/rest/agents/id:1",
//                          "id": 1,
//                          "name": "NickKuzminPC",
//                          "typeId": 1
//                      }
//                  ]
//              });
            res.end(renderedHtml);
        });
    };
    return getHtmlContent;
};

function setupDataBinder(app, restApiPath, optionConfigName, pageTemplateSubdirectoryPath)
{
    app.get(restApiPath, getHtmlContentForCurrentTemplate(optionConfigName, pageTemplateSubdirectoryPath));
}

exports.setupHandlers = setupDataBinder;