/**
 * Created by AlexeyO on 7/22/2015.
 */

function  foo (req, res) {
    res.send('Hello from foo! [/foo]');
    res.send(req);
}


function bar(req, res) {
    res.send('Hello from bar! [/bar]');
    res.send(req);
}

function main(req, res){
   res.send('Hello from api! [app/api]');
   res.send(__dirname);
}


function setupHandlers(app)
{
    app.get('/foo', foo);
    app.get('/bar', bar);
    app.get('/', main);
}

exports.setupHandlers = setupHandlers;

