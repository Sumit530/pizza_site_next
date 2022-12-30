const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

//const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
jsonparser = bodyParser.json();
const multer = require("multer");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require('fs');
const session = require('express-session');
//const auth = require("../middleware/oath");
const { json } = require("body-parser");
const usercontroller = require("../controller/userController")
//connection of sql server
router.post("/registration",usercontroller.RegiserUser)
router.post("/social_signup",usercontroller.social_signup)
router.post("/login",usercontroller.LoginUser)
//router.post("/get_all_users",usercontroller.get_all_users)
router.post("/send_otp",usercontroller.send_otp)
router.post("/get_my_accounts",usercontroller.get_my_accounts)
router.post("/user_details",usercontroller.user_details)
router.post("/following_list",usercontroller.following_list)

module.exports = router