// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var comments = [];
var server = http.createServer(function(req, res) {
    var parseUrl = url.parse(req.url, true);
    var pathname = parseUrl.pathname;
    if (pathname === '/') {
        fs.readFile('./index.html', function(err, data) {
            if (err) {
                console.log('404 Not Found');
                res.writeHead(404, {'Content-Type': 'text/html'});
                res.end('404 Not Found');
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            }
        });
    } else if (pathname === '/comment') {
        if (req.method === 'POST') {
            var postData = '';
            req.setEncoding('utf8');
            req.on('data', function(chunk) {
                postData += chunk;
            });
            req.on('end', function() {
                var comment = qs.parse(postData);
                comments.push(comment);
                res.writeHead(302, {'Location': '/'});
                res.end();
            });
        } else {
            var data = JSON.stringify(comments);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(data);
        }
    } else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('404 Not Found');
    }
});
server.listen(3000, function() {
    console.log('Server is running...');
});