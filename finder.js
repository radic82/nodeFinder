var fs = require('graceful-fs');
var path = require('path');
var PropertiesReader = require('properties-reader');
const chalk=require("chalk");

var walk = function (dir, done) {
	var results = [];
	fs.readdir(dir, function (err, list) {
		if (err) {
			return done(err);
		}
		var pending = list.length;
		if (!pending) {
			return done(null, results);
		}
		list.forEach(function (file) {
			file = path.resolve(dir, file);
			fs.stat(file, function (err, stat) {
				if (stat && stat.isDirectory()) {
					walk(file, function (err, res) {
						results = results.concat(res);
						if (!--pending) {
							done(null, results);
						}
					});
				} else {
					if (!file.includes('\\target\\')) {
						var ext = extensions.split("|");
						for(var i = 0; i < ext.length; i++){
							if (path.extname(file) == '.' + ext[i]) {
								results.push(file);
								break;
							}
						}
					}

					if (!--pending) {
						done(null, results);
					}
				}
			});
		});
	});
};

var readFile = function (file, searchWord, searchType, searchOnlyInName) {
	if(searchOnlyInName) {
		if(file.toUpperCase().includes(searchWord.toUpperCase())) {
			updateMap(file);
		}
	} else {
		var data = fs.readFileSync(file, 'utf8');
		if (!searchType) {
			if (data.includes(searchWord)) {
				updateMap(file);
			}
		} else {
			var found = data.match(new RegExp(searchWord));
			if (found != null) {
				updateMap(file);
			}
		}
	}
}

var updateMap = function (file) {
	console.log(chalk.green(file));
	count++;
	var key = file.replace(scanDir, "").split("\\")[0];
	var value = mapUsage.get(key);
	if(value == undefined) {
		value = 0;
	}
	value ++;
	mapUsage.set(key, value);
	if(countRow) {
		var data = fs.readFileSync(file, 'utf8');
		var lines = data.split("\n");
		countRowNumber += lines.length;
	}
}

var properties = PropertiesReader('configuration.properties');
var searchW;
var searchType = properties.get('search.regexp');
var searchOnlyInName = properties.get('search.only.in.name');
var scanDir = properties.get('search.path.0');
var extensions = properties.get('search.ext');
var countRow = properties.get('search.count.row');
var count = 0;
var mapUsage = new Map();
var countRowNumber = 0;
process.argv.forEach(function (val, index, array) {
	if (index == 2) {
		searchW = val;
	}
	if (index == 3) {
		searchType = val;
	}

	if (index == 4) {
		scanDir = properties.get('search.path.' + val);
	}
});
console.log("****** searchW[" + chalk.green.bold(searchW) + "] and scanDir[" + chalk.green.bold(scanDir) + "] and regexp[" + chalk.green.bold(searchType) + "] and extensions[" + chalk.green.bold(extensions) + "]");

walk(scanDir, function (err, results) {
	if (err) {
		throw err;
	}
	for (var i = 0; i < results.length; i++) {
		readFile(results[i], searchW, searchType, searchOnlyInName);
	}
	mapUsage.forEach((value, key) => {
		console.log(key, chalk.red.bold(value));
	})
	console.log("****** total[" + chalk.green.bold(count) + "]");
	if(countRow) {
		console.log("****** total rows[" + chalk.green.bold(countRowNumber) + "]");
	}
});