path = require 'path'
fs = require 'fs'
rmdir = require 'rimraf'
spawn = require('child_process').spawn

config = require('./conf').get

###
    Change owner for folder path
###
module.exports.changeOwner = (user, path, callback) ->
    child = spawn 'chown', ['--preserve-root', '-R', "#{user}:#{user}", path]
    child.on 'exit', (code) ->
        if code isnt 0
            callback new Error('Unable to change permissions')
        else
            callback()

###
    Create directory for <app>
###
module.exports.create = (app, callback) ->
    dirPath = path.join config('dir_app_data'), app.name
    if fs.existsSync dirPath
        callback()
    else
        try
            fs.mkdir dirPath, "0700", (err) ->
                if err
                    callback err
                else
                    module.exports.changeOwner app.user, dirPath, (err) ->
                        callback err
        catch error
            callback error

###
    Remove directory for <app>
###
module.exports.remove = (app, callback) ->
    dirPath = path.join config('dir_app_data'), app.name
    if fs.existsSync dirPath
        rmdir dirPath, callback
    else
        callback()
