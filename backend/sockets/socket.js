import {Server} from "socket.io"
import express from 'express';
import { createServer } from 'node:http';

const app = express();
const server = createServer(app);

const io=new Server(server,{
    cors:{
        origin:process.env.URL,
        methods:['GET','POST']
    }
}
)


const userSocketMap={};
export const getReciverSocketId=(receiverId)=>userSocketMap[receiverId];

io.on('connection',(socket)=>{
        const userId=socket.handshake.query.userId
        if(userId)
        {
            userSocketMap[userId]=socket.id;
            console.log(`User connected:UserId=${userId},SocketId=${socket.id}`);
            
        }
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
        socket.on('disconnect',()=>{
            if(userId){
                console.log(`User disconnect:UserId=${userId},SocketId=${socket.id}`);
                delete userSocketMap[userId]
            }
            io.emit('getOnlineUsers',Object.keys(userSocketMap));
        })
       
})

export {io,server,app} ;
