// Generated by CoffeeScript 1.7.1
var compareVersions, conf, exec, executeUntilEmpty, onWrongGitUrl, path, request;

path = require('path');

request = require('request');

compareVersions = require('mozilla-version-comparator');

exec = require('child_process').exec;

executeUntilEmpty = require('../helpers/executeUntilEmpty');

conf = require('./conf').get;


/*
    Clean up current modification if the Git URL is wrong
 */

onWrongGitUrl = function(app, done) {
  var err;
  err = new Error("Invalid Git url: " + app.repository.url);
  return exec("rm -rf " + app.appDir, {}, function() {
    return done(err);
  });
};


/*
    Initialize repository of <app>
        * Check if git URL exist
            * URL isn't a Git URL
            * repo doesn't exist in github
        * Clone repo (with one depth)
        * Change branch if necessary
        * Init submodule
 */

module.exports.init = function(app, callback) {
  var match, url;
  url = app.repository.url;
  match = url.match(/\/([\w\-_\.]+)\.git$/);
  if (!match) {
    return onWrongGitUrl(app, callback);
  } else {
    return exec('git --version', function(err, stdout, stderr) {
      var gitVersion, repoUrl;
      gitVersion = stdout.match(/git version ([\d\.]+)/);
      repoUrl = url.substr(0, url.length - 4);
      return request.get(repoUrl, function(err, res, body) {
        var branch, commands, config;
        if ((res != null ? res.statusCode : void 0) !== 200) {
          return onWrongGitUrl(app, callback);
        } else {
          commands = [];
          branch = app.repository.branch || "master";
          if ((gitVersion == null) || compareVersions("1.7.10", gitVersion[0]) === -1) {
            commands.push(("git clone " + url + " " + app.name + " && ") + ("cd " + app.dir + " && ") + ("git checkout " + branch + " && ") + "git submodule update --init --recursive");
          } else {
            commands.push(("git clone " + url + " --depth 1 ") + ("--branch " + branch + " ") + "--single-branch && " + ("cd " + app.dir + " && ") + "git submodule update --init --recursive");
          }
          config = {
            cwd: conf('dir_source'),
            user: app.user
          };
          return executeUntilEmpty(commands, config, callback);
        }
      });
    });
  }
};


/*
    Update repository of <app>
        * Reset current changes (due to chmod)
        * Pull changes
        * Update submodule
 */

module.exports.update = function(app, callback) {
  var branch, commands, config;
  branch = app.repository.branch || "master";
  commands = ["git reset --hard ", "git pull origin " + branch, "git submodule update --recursive"];
  config = {
    cwd: app.dir,
    env: {
      "USER": app.user
    }
  };
  return executeUntilEmpty(commands, config, callback);
};
