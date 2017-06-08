


MSE = {}


/*
require("jsdom/lib/old-api.js").env("", function(err, window) {
if (err) {
    console.error(err);
    return;
}

var $ = require('jquery')(window);
*/

MSE.createNode = function(type, attrs) { // <- this is defined in msegrammar.js and gets called for each node when parsed
	var metrics = [
		/* class  */ "NOPA", "NOM","WLOC", "WMC", "NOAM","BUR", "AMW", "NAS","BOvR",
		/* method */ "CM", "CC", "LOC" ,"MAXNESTING"
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
	//var parser = require("./parser.js")
	//var result = parser.parse(content)
	var result = peg$parse(content)
	// console.log(result)
	var dict = {};
    var namespaces = {};
    result.forEach(function(item) {
        switch(item.type) {
            case "Namespace":
            	// console.log(item.name[0])
                namespaces[item.id[0]] = item.name[0];
                break;

            case "Class":
                if (item.id[0] in dict) {
                    dict[item.id[0]]["name"] = item.name[0];
                    dict[item.id[0]]["metrics"] = {"NOPA": item.NOPA, "NOM": item.NOM, "WLOC": item.WLOC,
                		"WMC":item.WMC,"NOAM":item.NOAM,"BUR":item.BUR,"AMW":item.AMW,"NAS":item.NAS,"BOvR":item.BOvR};
                    dict[item.id[0]]["namespace"] = namespaces[item.belongsTo[0].ref];
                }
                else {
                    dict[item.id[0]] = {
                        "name": item.name[0],
                        "metrics": {"NOPA": item.NOPA, "NOM": item.NOM, "WLOC": item.WLOC,
                			"WMC":item.WMC,"NOAM":item.NOAM,"BUR":item.BUR,"AMW":item.AMW,"NAS":item.NAS,"BOvR":item.BOvR},
                        // "subclass": [],
                        "parent": "",
                        "namespace": namespaces[item.belongsTo[0].ref]
                    };
                }
                break;

            case "InheritanceDefinition":
                subclass = item.subclass[0].ref;
                parent = item.superclass[0].ref;
                if (subclass in dict) {
                    dict[subclass]["parent"]=Math.max(dict[subclass]["parent"],parent);
                }
                else {
                    dict[subclass] = {
                        // "subclass": [],
                        "parent": parent
                    };
                }
                // if (parent in dict) {
                //     dict[parent]["subclass"].push(subclass);
                // }
                // else {
                //     dict[parent] = {
                //         "subclass":[subclass],
                //         "parent":[]
                //     };
                // }
                break;


        }
    });
    // console.log(namespaces)
    // console.log(dict)
    result = jsonToArray(dict);
	return result
}
//});
function jsonToArray(data) {
    array = []
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            temp = data[key];
            temp["id"] = key
            array.push(temp)
        }
    }
    // console.log(array)
    return array
}
//module.exports = MSE
