module.exports = function(grunt)
{
	grunt.registerTask(
		'default', 
		'Default task to build all the project code', [
			'clean:main',
			'jshint:main',
			'uglify:main',
			'clean:css',
			'less:release',
			'libs',
			'assets',
			'sync-version'
		]
	);

	grunt.registerTask(
		'dev',
		'Development mode to build the project main, assets and css',
		['watch']
	);

	grunt.registerTask(
		'dev-main',
		'Development mode to build the project - faster, only watches main source (no assets or css)',
		['watch:main']
	);

	grunt.registerTask(
		'assets-debug',
		'Combine, map all asset JS files uncompressed',
		['concat_sourcemap:assets']
	);

	grunt.registerTask(
		'assets',
		'Minify all asset JS files uncompressed', [
			'clean:assets',
			'uglify:assets'
		]
	);

	grunt.registerTask(
		'clean-all',
		'Remove all build files and bower components',
		['clean']
	);
	
	grunt.registerTask(
		'clean-libs',
		'Remove all the bower components and library build files', [
			'clean:libraries',
			'clean:components'
		]
	);

	grunt.registerTask(
		'libs', 
		'Import external client-side dependencies using Bower', [
			'clean:libraries',
			'bower:install', 
			'uglify:libraries', 
			'less:libraries'
		]
	);

	grunt.registerTask(
		'libs-debug',
		'Import using Bower and build debug versions of libraries', [
			'clean:libraries',
			'bower:install', 
			'concat_sourcemap:libraries', 
			'less:libraries-debug'
		]
	);

	grunt.registerTask(
		'qa',
		'Do QA on the games generate and run', [
			'clean:main',
			'jshint:main',
			'concat_sourcemap:main', 
			'replace:main',
			'clean:css',
			'less:development',
			'clean:assets',
			'concat_sourcemap:assets',
			'libs-debug',
			'run'
		]
	);

	grunt.registerTask(
		'run', 
		'Preview the game by running a node server and opening it in the web browser',
		['connect:server']
	);

	grunt.registerTask(
		'sync-version',
		'Update the bower file verison and name from the build file',
		function()
		{	
			// Get the paths and files
			var bowerPath = process.cwd() + '/bower.json',
				bower = grunt.file.readJSON(bowerPath),
				build = grunt.file.readJSON(process.cwd() + '/build.json');

			// Update the bower version
			bower.version = build.version;
			bower.name = build.name;

			// Write the bower file
			grunt.file.write(bowerPath, JSON.stringify(bower, null, "\t"));
		}
	);
};
