var nconf = require('nconf');
nconf.argv().env();

nconf.add('general', {type: 'file', file:  './config/generalTeamCity.json'});
//nconf.add('additional', {type: 'file', file:  './config/additionalTeamCity.json'});
//nconf.add('urlPaths', {type: 'file', file:  './config/urlPaths.json'});

nconf.load();

module.exports = nconf;