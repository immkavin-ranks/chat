const express = require('express');
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = 3000;


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


const path = require('path');

app.use(
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist/"))
);

app.use(
    express.static(path.join(__dirname, "../node_modules/@popperjs/core/dist/"))
)


app.get('/', (req, res) => {

    const indexPath = path.join(__dirname, '..', 'frontend', 'public', 'index.html');
    res.sendFile(indexPath);
});


const main = io.of('/');

main.on('connection', (socket) => { 
    console.log('A user connected');
    socket.emit('message', {kavin: 'hey how are you?'})

    socket.on('another event', (data) => {
        console.log('Message:', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

});

