var beefy = require('beefy'),
    http = require('http')

var handler = beefy({
    entries: ['main.js'],
    cwd: __dirname,
    watchify: true,
    live: true
})

console.log("creating server on http://localhost:8080")
http.createServer(handler).listen(8080)