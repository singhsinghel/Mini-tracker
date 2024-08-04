const express=require('express');
const socketio=require('socket.io');
const http=require('http');
const path = require('path');
const app=express();

const server=http.createServer(app);
const io=socketio(server);

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,"public")));

io.on("connection",(uniqueSocket)=>{
   console.log('connected');
   uniqueSocket.on('send-location',(data)=>{
     io.emit('receive-location',{id:uniqueSocket.id,...data});
   });
   
   uniqueSocket.on('disconnect',()=>{
    io.emit('user-disc',uniqueSocket.id)
   })
})
app.get('/',(req,res)=>{
res.render('index')
})
server.listen(8080,()=>{
    console.log('app is listining');  
});
