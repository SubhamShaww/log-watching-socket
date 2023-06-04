// Importing only required modules
const express = require('express')
const { Server } = require('socket.io')
const path = require('path')
const fs = require('fs')
const readline = require("readline")

// Creating the server
const app = express()
// Using http module to create server instance
const httpServer = require("http").createServer(app)
// Passing the http server instance to socket.io
const io = new Server(httpServer)

// Serving static files from public directory
app.use(express.static(path.join(__dirname, 'public')))

// Reading log file and returning its content
function readLog() {
    const readInterface = readline.createInterface({
        input: fs.createReadStream('log.txt')
    })

    return readInterface
}

// make connections from server side
io.on('connection', (socket) => {
    console.log("new user connected")
    const contents = []

    // watch for file changes and emit new message when change is detected.
    fs.watch('log.txt', (eventType, fileName) => {
        console.log(`File ${fileName} has been ${eventType}`);

        if (eventType === "change") {
            const readInterfaceCreated = readLog()

            readInterfaceCreated.on("line", (line) => {
                if (!contents.includes(line)) {
                    contents.push(line)
                }
            })

            readInterfaceCreated.on("close", () => {
                let count = 10
                for (let i = contents.length - 1; i >= 0 && count > 0; i--) {
                    socket.emit("newMessage", contents[i])
                    count -= 1
                }
            })
        }
    })

    // when server disconnects from user
    socket.on('disconnect', () => {
        console.log("disconnected from user")
    })
})

// Routes for rest api
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

app.get('/socket.io/socket.io.js', function(req, res) {
    res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});

httpServer.listen(process.env.PUBLIC_PORT, () => {
    console.log(`Server is listening on port ${process.env.PUBLIC_PORT}`)
})