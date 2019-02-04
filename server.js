// =========== REQUIRE MODULES ==============
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const http = require('http');

// const flash = require('express-flash')
const port = 5000;

// var session = require('express-session');
var path = require('path');

// =========== Use =================
// app.use(session({
//     secret: 'keyboardkitteh',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 60000 }
// }))

// app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Points to the angular file to server the index.html
app.use(express.static(__dirname + '/public/dist/public'));

// =========== LISTEN PORT ===========
const server = http.createServer(app)

server.listen(port, function () {
    console.log(`You are listening on port ${port}`)
})

// =========== MONGOOSE CONNECTION ===========
// Here is where you can change the database information
// from the name to the collections 

// mongoose.connect('mongodb://localhost/database-table');
// var UserSchema = new mongoose.Schema({
//     first_name: { type: Number, required: [true, "First name cannot be empty"], minlength: 3 },
// }, { timestamps: true });

// const user = mongoose.model('User', UserSchema)
// mongoose.Promise = global.Promise;


// =========== SOCKET.IO CONNECTION ===========
const io = require('socket.io')(server)

var users = []
var messages = []

io.on('connection', (socket) => {
    function allUsers() {
        io.sockets.emit('allusers', users);
    }
    function sendmessages() {
        io.sockets.emit('allMessages', messages);
    }
    
    allUsers()
    // messages()
    console.log("---- WELCOME ---- Socket connection successfull", socket.id)
    socket.on('new_user', function(username){
        console.log(username)
        // users.push({name: username, userid : socket.id})
        socket.user = {username}
        users.push(socket.user)
        // console.log(users)
        // allMessages()
        allUsers();
    });

    socket.on('sendMessage', (data) => {
        console.log("New Message: +++ ", data)
        socket.messages = {data}
        messages.push(socket.messages)
        console.log("all messages +++",messages)
        sendmessages();
    })

    socket.on('iframe', (iframe) => {
        io.sockets.emit('newIframe', iframe)
    })

    socket.on('disconnect', () => {
        console.log('User Disconnected')
    })
})

// =========== ROUTES ===========

app.get('/', function (req, res) {
    res.json({ message: "Succes", text: "you made it to the root route" })
})

app.all("*", (req, res, next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});
