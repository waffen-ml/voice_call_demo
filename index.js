const express = require("express")
const https = require('https')
const app = express()
const fs = require('fs')
const server = https.createServer({
    key: fs.readFileSync(`cert/key.pem`),
    cert: fs.readFileSync(`cert/cert.pem`)
}, app);
const io = require('socket.io')(server)
const {v4: uuidV4} = require('uuid');

app.get('/', (req, res) => {
    res.redirect('/' + uuidV4())
})

app.get('/:room', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(3000)