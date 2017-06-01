// Make sure mushi_project.mse, parser_wrapper.js, 
var parser = require("./parser_wrapper.js")
var fs = require('fs');

function processMSE(callback) {
    // any async callback invokes callback with response
    fs.readFile('mushi_project.mse','utf8',function(err,contents) {
        var result = parser.parse(contents)

        fs.writeFile("output.txt",JSON.stringify(result,null,4),function(err) {
            if (err) 
                return callback(err);
            console.log("The file was saved!");
            return callback(null,result)
        });
    });
}

processMSE(function(err, result) {
    // process the async result
    var dict = {};
    var namespaces = {};
    result.forEach(function(item) {
        switch(item.type) {
            case "Namespace":
                namespaces[item.id] = item.name;
                break;

            case "Class":
                if (item.id in dict) {    
                    dict[item.id]["name"] = item.name;
                    dict[item.id]["metrics"] = {"NOA": 0, "NOM": item.NOM, "WLOC": item.WLOC};
                    dict[item.id]["namespace"] = namespaces[item.belongsTo.ref];
                }
                else {
                    dict[item.id] = {
                        "name": item.name,
                        "metrics": {"NOA": 0, "NOM": item.NOM, "WLOC": item.WLOC},
                        "subclass": [],
                        "parent": [],
                        "namespace": namespaces[item.belongsTo.ref]
                    };
                }
                break;

            case "InheritanceDefinition":
                subclass = item.subclass.ref;
                parent = item.superclass.ref;
                if (subclass in dict) {
                    dict[subclass]["parent"].push(parent);
                }
                else {
                    dict[subclass] = {
                        "subclass": [],
                        "parent": [parent]
                    };
                }                              
                if (parent in dict) {
                    dict[parent]["subclass"].push(subclass);
                }
                else {
                    dict[parent] = {
                        "subclass":[subclass],
                        "parent":[]
                    };
                }
                break;


        }
    });
    console.log(namespaces)
    // console.log(dict);
    fs.writeFile("dict.txt",JSON.stringify(dict,null,4),function(err) {
            if (err) 
                return console.log(err);
            console.log("The dict file was saved!");
    });
});


