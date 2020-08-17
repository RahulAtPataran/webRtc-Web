const express=require('express');
const http=require('http')
const socketio=require('socket.io')
const UserModel=require('./users')
const { v4: uuidV4 } = require('uuid')
const app=express()
const cors=require('cors')

const server=http.createServer(app);

const io=socketio(server);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
    });

const port=process.env.PORT || 4000;

app.use(cors({
    origin: '*'
  }));
app.get('/generateRoomId',(req,res)=>{


    let Uid=uuidV4()
    console.log(Uid)
    res.json({success:true,roomId:`${Uid}`})

})


io.on('connect',(socket)=>{
     

    socket.on("join",({name,email,roomId,userId},callback)=>{
          console.log(roomId)
        const {user,existingUser}=UserModel.addUser({id:socket.id,name,email,roomId,userId});

        if(existingUser)
        {
            existingUser.roomId=roomId;
            existingUser.userId=userId;
        }

    socket.join(roomId);

    socket.to(roomId).broadcast.emit('user-connected', userId)
    console.log("user added")


    callback({success:true,message:'done '});


    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })

       
    })


})






server.listen(port,()=>{


    console.log("Server is listening at :"+port);
})