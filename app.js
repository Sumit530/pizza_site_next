const express = require("express")
const app = express()
const https = require("https")
const moment = require("moment")
const { CLIENT_RENEG_LIMIT } = require("tls")
const router = require("./routes/routes")
const multer = require("multer")
const fs =require("fs")
const path = require("path")
const upload = multer()
app.use(upload.none()) 
const bodyparser= require("body-parser")
const server = https.createServer(
   {
     key:fs.readFileSync(path.join(__dirname,"cert",'key.pem')),
  cert:fs.readFileSync(path.join(__dirname,"cert",'cert.pem')),
},
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
//app.use(con)

app.get("/",(req,res)=>{
    res.send("hey")
})
server.listen(8000,()=>{
console.log("server is running on 8000");
})  