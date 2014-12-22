/**
*  Encapsulate the springroll.json format functionality
*  this converts the springroll.json file into useable file lists
*  for running tasks on.
*/
module.exports = function(grunt, options)
{	
	// Use underscore utilities
	var _ = require('lodash'),	
		path = require('path');

	// The name of the build file
	var filename = options.cwd + '/' + (options.buildFile || 'springroll.json');

	// Filter an array of files and only return the javascript files
	var isJS = function(file){ return /\.js$/.test(file); };

	// Filter an array of files and only return CSS and LESS files
	var isCSS = function(file){ return /\.(less|css)$/.test(file); };

	// The list of files to copy
	var librariesCopy = null;

	// Check for springroll file
	if (!grunt.file.exists(filename))
		grunt.fail.fatal('no ' + filename + ' file is found');

	// Load the springroll file which contains the list of 
	// library and project files to springroll
	var file = grunt.file.readJSON(filename);

	// Error checking for required fields and types
	if (!file.name || !_.isString(file.name)) 
		grunt.fail.fatal('"name" is a required field in ' + filename);

	if (!file.version || !_.isString(file.version)) 
		grunt.fail.fatal('"version" is a required field in ' + filename);

	if (!file.main || !_.isArray(file.main))
		grunt.fail.fatal('"main" is a required field in ' + filename);

	if (!file.libraries || !_.isArray(file.libraries))
		grunt.fail.fatal('"libraries" is a required field in ' + filename);

	if (!_.isUndefined(file.librariesDebug) && !_.isArray(file.librariesDebug))
		grunt.fail.fatal('"librariesDebug" must be an array of files in ' + filename);

	if (!_.isUndefined(file.mainDebug) && !_.isArray(file.mainDebug))
		grunt.fail.fatal('"mainDebug" must be an array of files in ' + filename);

	if (!_.isUndefined(file.assets) && !_.isArray(file.assets))
		grunt.fail.fatal('"assets" must be an array of files in ' + filename);

	// Let other tasks know if we have assets
	grunt.config.set('hasAssets', !_.isUndefined(file.assets));

	// Check for files to copy
	var hasCopy = !_.isUndefined(file.librariesCopy);
	grunt.config.set('hasCopy', hasCopy);

	// Format into format for grunt-contrib-copy
	if (hasCopy)
	{
		librariesCopy = {};
		_.each(file.librariesCopy, function(dest, src){
			var id = path.basename(src)
				.replace(/[^a-zA-Z0-9]/g, '')
				.toLowerCase();

			librariesCopy[id] = {
				src: src,
				dest: dest,
				expand: true,
				flatten: true
			};
		});
	}

	return {

		// The name of the app
		name: file.name,

		// The semantic version of the app
		version: file.version,

		// The name of the springroll file
		file : filename,

		// Files to copy
		librariesCopy: librariesCopy,

		js : {
			// The collection of library files
			libraries : _.filter(file.libraries, isJS),

			// The collection of library files built in debug/unminified mode
			librariesDebug : _.filter(file.librariesDebug || file.libraries, isJS),

			// The collection of source files
			main : _.filter(file.main, isJS),

			// The collection of source files in debug mode
			mainDebug : _.filter(file.mainDebug || file.main, isJS),

			//asset files (typically assets exported from flash as javascript)
			assets: _.filter(file.assets || "", isJS)
		},

		css : {
			// The library css files
			libraries : _.filter(file.libraries, isCSS),

			// The library debug css files
			librariesDebug : _.filter(file.librariesDebug || file.libraries, isCSS),

			// The project css files
			main : _.filter(file.main, isCSS),

			// The project debug CSS
			mainDebug : _.filter(file.mainDebug || file.main, isCSS)
		}
	};
};