const express = require("express")
const app = express()
const https = require("http")
const moment = require("moment")
const { CLIENT_RENEG_LIMIT } = require("tls")
const router = require("./routes/routes")
const fs =require("fs")
const path = require("path")
const bodyparser= require("body-parser")
const server = https.createServer(
//    {
//      key:fs.readFileSync(path.join(__dirname,"cert",'key.pem')),
//   cert:fs.readFileSync(path.join(__dirname,"cert",'cert.pem')),
// },
app)
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);
app.use(express.static("public"));
require("./db/connection")
app.use('/api',router)
const { v4: uuidv4 } = require("uuid");     
app.set("view engine", "ejs");
io.on("connection", (socket) => {
    console.log("join")
    socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId)
    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  }); 
});



//app.use(con)

app.get("/",(req,res)=>{
    res.send("hey")
})
server.listen(8000,()=>{
console.log("server is running on 8000");
})  