const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.url === '/happy-birthday') {
        fs.readFile(path.join(__dirname, 'dist/index.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

const PORT = 3000; // 使用 80 端口
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
