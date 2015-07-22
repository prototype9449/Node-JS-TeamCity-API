var nconf = require('nconf');
nconf.argv()
  .env();

nconf.add('global', {type: 'file', file:  './config/teamCity.json'});
nconf.add('user', {type: 'file', file: './config/main.json'});
nconf.load();

module.exports = nconf;