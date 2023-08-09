const express = require("express")
const app = express()
const https = require("http")
const moment = require("moment")
const router = require("./routes/routes")
const adminRoute = require("./routes/adminRoutes")
const fs =require("fs")
const path = require("path")
const bodyparser= require("body-parser")
const mongoose = require("mongoose")
const models = path.join(__dirname,"model")
const multer = require("multer");
const Message = require("./model/messages")
const cors = require("cors")
app.use(bodyparser.json())
app.use(multer().array())
app.use(bodyparser.urlencoded({extended:true}))
app.use(cors())
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

fs.readdirSync(models)
  .filter(file => ~file.search(/^[^.].*\.js$/))
  .forEach(file => require(path.join(models, file)));

const rootsocket = require("./socket/socket")(io)
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.get("/",(req,res)=>{
  res.render('index')
})
app.get("/room",(req,res)=>{
  res.render('vc',{roomId : "1234"})
})

app.use("/peerjs", peerServer);
app.use(express.static("public"));
require("./db/connection")
app.use('/api',router)
app.use('/admin',adminRoute)
const { v4: uuidv4 } = require("uuid");
app.set("view engine", "ejs");



//  Hashtag.insertMany([
//   {name:"News/media"},
//   {name:"Sports"},
//   {name:"Government and politics"},
//   {name:"Music"},
//   {name:"Fashion"},
//   {name:"Entertainment"},
//   {name:"Digital creator/blogger/influencer"},
//   {name:"Gamer"},
//   {name:"Global business/brand/organization"},
//   {name:"Other"},
  

//  ]).then((e)=>{
//   console.log("insterd")
//  })

app.use('/', express.static('public'))

app.use("/upload",express.static('uploads/'))
app.get("/",(req,res)=>{
    res.send("hey")
})

server.listen(8000,()=>{
console.log("server is running on 8000");
})

