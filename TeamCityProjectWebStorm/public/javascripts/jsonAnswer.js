var http = require('http');

var options = {
    hostname: 'localhost',
    port: 8111,
    path: '/httpAuth/app/rest/builds',
    method: 'GET',
    headers: {
        Cookie:'TCSESSIONID=01CA572704483A48BF24807378ECAE7D',
        Accept: 'application/json'
    }
};

callback = function(response) {
    var str = '';
    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {
        console.log(str);
    });
}

http.request(options, callback).end();

