const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

let users = [];
let channels = ['#accueil'];
let messageHistory = {};
channels.forEach(channel => messageHistory[channel] = []);

io.on('connection', (socket) => {
    let currentUser = '';

    socket.on('login', (user) => {
        if (!user || !user.username) {
            console.error('Invalid user data');
            return;
        }
    
        currentUser = user.username;
        users.push(currentUser);
        socket.emit('messageHistory', messageHistory);
        socket.emit('listChannels', channels);
        
        io.emit('listUsers', users);
        socket.broadcast.emit('newuser', { username: currentUser });
    });

    socket.on('disconnect', () => {
        if (currentUser) {
            users = users.filter((user) => user !== currentUser);
            io.emit('listUsers', users);
            socket.broadcast.emit('disuser', { username: currentUser });
        }
    });

    socket.on('newmessage', (message) => {
        if (!message || !message.messages) {
            console.error('Invalid message data');
            return;
        }
        
        const messageData = message.messages;
        const channel = messageData.channel;
        
        if (!messageHistory[channel]) {
            messageHistory[channel] = [];
        }
        
        const newMessage = {
            channel: messageData.channel,
            author: messageData.author,
            content: messageData.content,
            time: messageData.time,
            to: messageData.to || '',
            chucho: messageData.chucho || 'no'
        };
        
        messageHistory[channel].push(newMessage);
        io.emit('newmsg', { messages: newMessage });
    });

    socket.on('rename', (data) => {
        if (!data || !data.username || !data.rename) {
            console.error('Invalid rename data');
            return;
        }

        const { username, rename } = data;
        users = users.filter((user) => user !== username);
        users.push(rename);
        currentUser = rename;

        io.emit('listUsers', users);
        io.emit('renameuser', { username, rename });
    });

    socket.on('newChannel', (data) => {
        if (!data || !data.channel) {
            console.error('Invalid channel data');
            return;
        }
    
        const newChannel = `#${data.channel}`;
        if (!channels.includes(newChannel)) {
            channels.push(newChannel);
            messageHistory[newChannel] = [];
            io.emit('listChannels', channels);
        }
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});