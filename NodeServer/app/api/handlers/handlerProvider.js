var handlers = {
    test  : require('./handlers/testHandler'),
    build : require('./handlers/buildHandler'),
    error : require('./handlers/errorHandler'),
    fooBar : require('./handlers/fooBarHandlers')
};

exports.handlers = handlers;
