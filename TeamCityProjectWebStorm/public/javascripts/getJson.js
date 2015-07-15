var request = require('request');

var getResultJson = function (res) {
var options = {
    url : 'http://localhost:8111/httpAuth/app/rest/builds',
    auth : {
        user : 'prototype9449',
        pass : 'termit'
    },
    headers: {
        Accept: 'application/json'
    }
};
request.get (options, function (err, response) {
   if(err) throw err;

    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:50361');


    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(JSON.stringify(response.body));
    res.end();
});
}

module.exports = getResultJson;
