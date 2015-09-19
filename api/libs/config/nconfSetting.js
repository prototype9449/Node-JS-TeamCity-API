var nconf = require('nconf');
nconf.argv().env();

nconf.add('general', {type: 'file', file: './config/generalTeamCity.json'});
nconf.add('additional', {type: 'file', file: './config/additionalTeamCity.json'});
nconf.add('urlPaths', {type: 'file', file: './config/urlPaths.json'});
nconf.add('otherOptions', {type: 'file', file: './config/otherOptions.json'});
nconf.add('globalOptions', {type: 'file', file: './config/globalConfiguration.json'});

nconf.general = function () {
    this.use('general');
    return this;
};

nconf.additional = function () {
    this.use('additional');
    return this;
};

nconf.urlPaths = function () {
    this.use('urlPaths');
    return nconf;
};

nconf.otherOptions = function () {
    this.use('otherOptions');
    return nconf;
};

nconf.globalOptions = function () {
    this.use('globalOptions');
    return nconf;
};

nconf.load();

module.exports = nconf;