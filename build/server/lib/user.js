// Generated by CoffeeScript 1.7.1
var config, path, spawn;

spawn = require('child_process').spawn;

config = require('./conf').get;

path = require('path');


/*
    Create user cozy-<app>
        Use script adduser.sh
 */

module.exports.create = function(app, callback) {
  var appdir, child, env, user;
  env = {};
  user = env.USER = app.user;
  appdir = env.HOME = config('dir_source');
  child = spawn('bash', [path.join(__dirname, '..', 'lib', 'adduser.sh')], {
    env: env
  });
  return child.on('exit', function(code) {
    if (code === 0) {
      return callback();
    } else {
      return callback(new Error('Unable to create user'));
    }
  });
};


/*
    Remove appplication user
 */

module.exports.remove = function(app, callback) {
  return callback();
};
