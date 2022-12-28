const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
require("./db/connection")
//app.use(con)


app.listen(8000,()=>{
console.log("server is running on 8000");
})