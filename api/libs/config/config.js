var nconf = require('nconf');
nconf.argv().env();

nconf.add('general', {type: 'file', file: './config/generalTeamCity.json'});
nconf.add('additional', {type: 'file', file: './config/additionalTeamCity.json'});
nconf.add('urlPaths', {type: 'file', file: './config/urlPaths.json'});

nconf.general = function () {
    this.use('general');
    return this;
};

nconf.additional = function () {
    this.use('additional');
    return this;
};

nconf.urlPaths = function () {
    nconf.use('urlPaths');
    return nconf;
};

nconf.load();

module.exports = nconf;