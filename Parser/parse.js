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
    var dict = {}
    result.forEach(function(item) {
        switch(item.type) {
            case "Class":
                if (item.id in dict) {    
                    dict[item.id]["name"] = item.name;
                    dict[item.id]["metrics"] = {"NOA": 0, "NOM": item.NOM, "WLOC": item.LOC};
                }
                else {
                    dict[item.id] = {
                        "name": item.name,
                        "metrics": {"NOA": 0, "NOM": item.NOM, "WLOC": item.LOC},
                        "subclass": [],
                        "parent": 0
                    };
                }
                break;

            case "InheritanceDefinition":
                subclass = item.subclass.ref
                parent = item.superclass.ref
                if (subclass in dict) {
                    dict[subclass]["parent"] = parent;
                }
                else {
                    dict[subclass] = {
                        "parent": parent
                    };
                }                              
                if (parent in dict) {
                    dict[parent]["subclass"].concat(subclass)
                }
                else {
                    dict[parent] = {
                        "subclass":[parent]
                    }
                }
                break;


        }
    });
     console.log(dict)
});


