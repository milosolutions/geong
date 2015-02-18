var open = require('open'),
    sys = require("sys"),
    http = require("http"),
    path = require("path"),
    url = require("url"),
    fs = require("fs");


// get initial params ::
var port = 8000;
var file = '';

process.argv.forEach(function (val, index) {
    switch (index){
        case 2:
            port = val;
            break;
        case 3:
            file = val;
            break;
    }
});





http.createServer(function (request, response) {
    var my_path = url.parse(request.url).pathname;
    var full_path = path.join(process.cwd(), my_path);
    fs.exists(full_path, function (exists) {
        if (!exists) {
            response.writeHeader(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n url::" + full_path);
            response.end();
        } else {
            fs.readFile(full_path, "binary", function (err, file) {
                if (err) {
                    response.writeHeader(500, {"Content-Type": "text/plain"});
                    response.write(err + "\n url::" + full_path);
                    response.end();

                } else {
                    response.writeHeader(200);
                    response.write(file, "binary");
                    response.end();
                }

            });
        }
    });
}).listen(port);
open('http://localhost:' + port + '/' + file);