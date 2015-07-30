function list(req, res, next) {
    res.send("it is list repsonce");
}


function get(req, res, next) {
    res.send("it is get responce");
}

function create(req, res, next) {
    res.send("create");
}

function update(req, res, next) {
    res.send("update responce");
}

function remove(req, res, next) {
    res.send("remove");

}

function path(req, res) {
    res.send(req.url);
}

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

function setupHandlers(app) {
    app.get('/foo', foo);
    app.get('/bar', bar);
    app.get('/', main);
    //app.get('*', path);
    app.get('/test', list);
    app.get('/test/:id', get);
    app.post('/test', create);
    app.put('/test/:id', update);
    app.delete('/test/:id', remove);
}

exports.setupHandlers = setupHandlers;
