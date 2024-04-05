const express = require('express');
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = 3000;


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


const path = require('path');

app.use(
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist/"))
);

app.use(
    express.static(path.join(__dirname, "../node_modules/@popperjs/core/dist/"))
)

app.use(
    express.static(path.join(__dirname, "../node_modules/jquery/dist/"))
)

app.use(
    express.static(path.join(__dirname, "../frontend/src/"))
)

app.get('/', (req, res) => {

    const indexPath = path.join(__dirname, '..', 'frontend', 'public', 'index.html');
    res.sendFile(indexPath);
});

app.get('/login', (req, res) => {

    const indexPath = path.join(__dirname, '..', 'frontend', 'public', 'login.html');
    res.sendFile(indexPath);
});

app.get('/register', (req, res) => {

    const indexPath = path.join(__dirname, '..', 'frontend', 'public', 'register.html');
    res.sendFile(indexPath);
});

app.get('/chat', (req, res) => {

    const indexPath = path.join(__dirname, '..', 'frontend', 'public', 'chat.html');
    res.sendFile(indexPath);
});

app.get('/logout', (req, res) => {

    const indexPath = path.join(__dirname, '..', 'frontend', 'public', 'register.html');
    res.sendFile(indexPath);
});

const main = io.of('/');

main.on('connection', (socket) => { 
    

    socket.on('join', (data) => {
        socket.join(data.room);
        main.in(data.room).emit('message', `New user joined ${data.room} room!`);
    })

    socket.on('message', (data) => {
        console.log(`Message: ${data.msg}`);
        main.in(data.room).emit('message', data.msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');

        main.emit('message', 'user disconnected');
    });
});

