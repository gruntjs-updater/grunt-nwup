# grunt-nwup

> Automates the process needed to prepare an update for use with [nwup](https://www.npmjs.com/package/nwup), an NW.js application updater.
> Creates a zip file that can be applied via nwup to update the application, creates a file [latest.json] with the latest version and the URL to the latest update, and stores the size of the NW.js runtime [needed by nwup] in the application's manifest.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-nwup --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-nwup');
```

## The "nwup" task

### Overview
In your project's Gruntfile, add a section named `nwup` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  nwup: {
    options: {
      location: 'http://www.example.com:port/updates/', // URL to the updates location online.
      nw: 'path/to/nw.exe', // Path of NW.js runtime executable used to build the app.
      updateDir: 'updates/', // Output directory updates will be saved to.
    },
   src: ['./build/**/*'] // Your node-webkit app
  }
});
```


## Release History
- 2015-07-07    Initial release.
