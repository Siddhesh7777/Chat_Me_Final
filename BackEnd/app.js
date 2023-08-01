const express = require('express');
const connectDB = require('./db/connect')
const userRouter = require('./routes/userRouter')
const { notFound, errorHandler } = require('./routes/error')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')

const app = express();
const port = 5100;

require('dotenv').config();


const cors = require('cors');

app.use(cors())

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Jai Sia Ram Jai Bajrangbali')
})

app.use('/api', userRouter);
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

app.use(notFound)
app.use(errorHandler)




const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        const server = await app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
        //socket code 
        const io = require('socket.io')(server
            , {
                pingTimeout: 60000,
                cors: {
                    origin: "http://localhost:3000"
                }
            }
        )
        io.on('connection', (socket) => {
            console.log('connected socket')
            socket.on("setup", (userData) => {
                socket.join(userData._id);//new Room is created
                // console.log(userData._id)
                socket.emit("connected");
            });
            socket.on("join chat", (room) => {
                socket.join(room);
                // console.log("User Joined Room: " + room);
            });

            socket.on('typing', (room) => {
                socket.in(room).emit("typing");
            })

            socket.on('stopTyping', (room) => {
                socket.in(room).emit("stopTyping");
            })

            socket.on('Rename',(data)=>{
                // console.log(data);
                if(!data.users){
                    return console.log('chat.users is not defined');
                }
                data.users.forEach((user) => {
                    socket.in(user._id).emit("Renamed");
                })
            })
            socket.on('AddUser',(data)=>{
                // console.log(data);
                if(!data.users){
                    return console.log('chat.users is not defined');
                }
                data.users.forEach((user) => {
                    socket.in(user._id).emit("UpdateUser");
                })
            })
            socket.on('RemoveUser1',(data)=>{
                // console.log(data);
                if(!data){
                    return console.log('chat.users is not defined');
                }
               
                    socket.in(data._id).emit("RemovedUser1");
              
            })




            socket.on('RemoveUser',(data)=>{
                // console.log(data);
                if(!data.users){
                    return console.log('chat.users is not defined');
                }
                data.users.forEach((user) => {
                    socket.in(user._id).emit("RemovedUserk");
                })
            })

            socket.on('newMessage', (newMessageReceived) => {
                var chat = newMessageReceived.chat;
                // console.log(chat)
                if (!chat.users) {
                    return console.log('chat.users is not defined');
                }
                //when a new message received we want to send that message to all the users of that chat except who send it and for all other 
                // users we have here different rooms

                chat.users.forEach((user) => {
                    if (user._id === newMessageReceived.sender._id) return;
                    socket.in(user._id).emit("message Received", newMessageReceived);
                })
            })
            socket.off("setup", (userData) => {
                console.log("USER DISCONNECTED");
                socket.leave(userData._id);
            });


        })
    }
    catch (error) {
        console.log(error)
    }
}
start();



