


MSE = {}

require("jsdom/lib/old-api.js").env("", function(err, window) {
if (err) {
    console.error(err);
    return;
}
var $ = require('jquery')(window);

MSE.createNode = function(type, attrs) { // <- this is defined in msegrammar.js and gets called for each node when parsed
	var metrics = [
		/* class  */ "CBO", "NOA", "NOM", "NOPUBM",
		/* method */ "LOC", "CYCLO" 							
	];
	var node = { type: type };


	$(attrs).each(function(i, a) {
		
		if(a.name.charAt(0) == a.name.charAt(0).toLowerCase()) {
		 	node[a.name] = (a.values.length > 1) ? a.values : a.values[0];
		} else if(metrics.indexOf(a.name) >= 0) {
			node[a.name] = parseFloat(a.values[0]);
		}
	});

	return node;
		
};

MSE.parse = function(content){
	var parser = require("./parser.js")
	var result = parser.parse(content)
	return result
}
});

module.exports = MSE