const http = require("http");

const port = 4000;

http.createServer(function(req, res){
    res.writeHead(200, {"Content-Type":"text/plain"});
    res.end("Hello World! Hello again");
}).listen(port, ()=> console.log("listening on port " + port))
