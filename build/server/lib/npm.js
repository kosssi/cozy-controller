// Generated by CoffeeScript 1.7.1
var path, spawn;

path = require('path');

spawn = require('child_process').spawn;

module.exports.install = (function(_this) {
  return function(target, callback) {
    var args, child, options, stderr;
    args = ['npm', '--unsafe-perm', 'true', '--cache', path.join(target.dir, '..', '.npm'), '--userconfig', path.join(target.dir, '..', '.userconfig'), '--globalconfig', path.join(target.dir, '..', '.globalconfig'), '--production'];

    /*if haibu.config.get('registry')?
        args.push('--registry')     
        args.push(haibu.config.get('registry'))
    if haibu.config.get('strict-ssl')?
        args.push('--strict-ssl')     
        args.push(haibu.config.get('strict-ssl'))
     */
    args.push('install');

    /*args = [
        '-u',
        target.user
        ].concat(args)
     */
    options = {
      cwd: target.dir
    };
    child = spawn('sudo', args, options);
    setTimeout(child.kill.bind(child, 'SIGKILL'), 5 * 60 * 1000);
    stderr = '';
    child.stderr.on('data', function(data) {
      return stderr += data;
    });
    return child.on('close', function(code) {
      var err;
      console.log('close');
      if (code !== 0) {
        console.log("npm:install:err: NPM Install failed : " + stderr);
        err = new Error('NPM Install failed');
        err.code = code;
        err.result = stderr;
        err.blame = {
          type: 'user',
          message: 'NPM failed to install dependencies'
        };
        callback(err);
      } else {
        console.log('npm:install:success');
      }
      args = ['npm', '--cache', path.join(target.dir, '..', '.npm'), 'cache', 'clean', '-u', target.user];
      options = {
        cwd: target.dir
      };
      child = spawn('sudo', args, options);
      stderr = '';
      child.stderr.on('data', function(data) {
        return stderr += data;
      });
      return child.on('close', function(code) {
        if (code !== 0) {
          console.log('npm:clean_cache:failure');
          console.log(stderr);
          callback();
        }
        return callback();
      });
    });
  };
})(this);
