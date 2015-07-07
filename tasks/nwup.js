/*
 * grunt-nwup
 * https://github.com/xqwzts/grunt-nwup
 *
 * Copyright (c) 2015 Victor Choueiri
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var archiver = require('archiver');

module.exports = function(grunt) {

  grunt.registerMultiTask('nwup', 'Creates update files for use with nwup, an NW.js application updater.', function() {
    var done = this.async();

    var opts = this.options();

    var updateFolder = opts.updateDir;
    var zipPackage = getZipPackage(this.files);
    var zipFiles = zipPackage.zipFiles;
    var packagePath = zipPackage.packagePath;

    // create the updates folder if it doesn't already exist
    grunt.file.mkdir(updateFolder);

    // get package.json from the build dir
    var pkg = grunt.file.readJSON(packagePath);

    // get the current version from package.json
    var version = pkg.version;

    // get the update server location from the config
    var updateServer = opts.location;

    var manifest = {
      'version': version,
      'update': updateServer + version + '.zip'
    };

    var manifestPath = path.join(updateFolder, 'latest.json');

    // write to the update manifest
    fs.writeFileSync(manifestPath, JSON.stringify(manifest));

    grunt.log.writeln('Saved manifest to ' + manifestPath);

    // modify the package.json in the build folder to include an nwsize field:
    // get the file size of an unmodified nw.exe runtime
    var nwRuntimePath = path.resolve(opts.nw);
    var nwRuntimeSize = fs.statSync(nwRuntimePath).size;

    if (!pkg.nwup) pkg.nwup = {};
    pkg['nwup']['runtimesize'] = nwRuntimeSize;
    pkg['nwup']['mode'] = 'PROD';

    // save the package json back into build/package.json
    grunt.file.write(packagePath, JSON.stringify(pkg, null, 2));

    // zip all files in the build folder
    var updateFile = path.join(updateFolder, version + '.zip');
    var updateWriteStream = fs.createWriteStream(updateFile);

    var archive = archiver('zip');

    archive.on('error', function(error) {
      grunt.fail.warn(error);
    });

    archive.on('entry', function (file) {
      grunt.log.writeln('Zipping ' + file.name);
    });

    updateWriteStream.on('close', function() {
      grunt.log.ok('Update zip created in ' + updateFile);
      done();
    });

    archive.pipe(updateWriteStream);
    archive.bulk(zipFiles)
    archive.finalize();
  });
};

function getZipPackage(files) {
    var manifestPath, rootPath;
    var sourceFiles = [];

    for (var f in files) {
        var srcs = files[f].src;

        for (var s in srcs) {
            var sourceFile = path.normalize(srcs[s]);
            // ignore directories:
            if(!fs.lstatSync(sourceFile).isDirectory()) {
                sourceFiles.push(sourceFile);
            }
            // whenever we hit a package.json file we'll check if that's the topmost one [and consider that our app's package.json]
            // all dest paths will be made relative to it's location.
            if (sourceFile.match('package.json')) {
                manifestPath = getTopmostFile(sourceFile, manifestPath);
            }
        }
    }
    rootPath = path.normalize(manifestPath.split('package.json')[0] || './');

    var zipFiles = [];

    for (var s in sourceFiles) {
        var sfile = sourceFiles[s];
        zipFiles.push({
            src: sfile,
            dest: path.dirname(sfile.replace(rootPath, '')),
            expand: true,
            flatten: true
        });
    }

    return {
        zipFiles: zipFiles,
        packagePath: manifestPath
    }
}

function getTopmostFile(newPath, oldPath) {
    if (!oldPath) return newPath;

    return newPath.split(path.sep).length > oldPath.split(path.sep).length ? newPath : oldPath;
}
