var parser = require("./parser_wrapper.js")


var fs = require('fs');
 
fs.readFile('phoenix.mse', 'utf8', function(err, contents) {
    //console.log(contents);
    var result = parser.parse(contents)
    console.log(result)
});

