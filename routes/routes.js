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
const notificationcontroller = require("../controller/NotificationController")
const GeneralController = require("../controller/GeneralController")
const SharpMulter  =  require("sharp-multer");


const ProfileStorage = SharpMulter({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile");
  },
  imageOptions : {
    fileFormat:"webp",
    quality : 80,
    resize : {width:600}
},
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + crypto.randomBytes(6).toString("hex");
    cb(
      null,
      uniqueSuffix +
        "-" +
        file.originalname.slice(
          file.originalname.length - 10,
          file.originalname.length
        )
    );
  },
});

const ProfileUpload = multer({
  storage: ProfileStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb("Only .png, .jpg and .jpeg format allowed!");
    }
  },
  limits:{
    fileSize:5 * 1024 * 1024
  }
});

const CoverImageStorage = SharpMulter({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile");
  },
  imageOptions : {
    fileFormat:"webp",
    quality : 80,
    resize : {width:600}
},
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + crypto.randomBytes(6).toString("hex");
    cb(
      null,
      uniqueSuffix +
        "-" +
        file.originalname.slice(
          file.originalname.length - 10,
          file.originalname.length
        )
    );
  },
});

const CoverImageUpload = multer({
  storage: CoverImageStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb("Only .png, .jpg and .jpeg format allowed!");
    }
  },
  limits:{
    fileSize:5 * 1024 * 1024
  }
});

const VideoStorage = SharpMulter({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile");
  },
  imageOptions : {
    fileFormat:"mp4",
    quality : 80,
},
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + crypto.randomBytes(6).toString("hex");
    cb(
      null,
      uniqueSuffix +
        "-" +
        file.originalname.slice(
          file.originalname.length - 10,
          file.originalname.length
        )
    );
  },
});

const VideoUpload = multer({
  storage: VideoStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "video/mp4" ||
      file.mimetype == "video/x-msvideo" ||
      file.mimetype == "video/3gpp"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb("Only .mp4, .3gpp and .avi format allowed!");
    }
  },
  limits:{
    fileSize:20 * 1024 * 1024
  }
});






router.post("/registration",usercontroller.registration)
router.post("/social_signup",usercontroller.social_signup)
router.post("/login",usercontroller.LoginUser)
//router.post("/get_all_users",usercontroller.get_all_users)
router.post("/check_otp",usercontroller.check_otp)
router.post("/check_username",usercontroller.check_username)
router.post("/send_otp",usercontroller.send_otp)
router.post("/update_password",usercontroller.update_password)
router.post("/update_mobile_no",usercontroller.update_mobile_no)
router.post("/update_username",usercontroller.update_username)
router.post("/update_privacy",usercontroller.update_privacy)
router.post("/update_safeties",usercontroller.update_safeties)
router.post("/get_user_safeties",usercontroller.get_user_safeties)
router.post("/update_notification_settings",usercontroller.update_notification_settings)
router.post("/get_all_users",usercontroller.get_all_users)
router.post("/get_my_accounts",usercontroller.get_my_accounts)

  //router.post("/get_all_users",usercontroller.)
//router.post("/get_all_users",usercontroller.all)
router.post("/get_my_accounts",usercontroller.get_my_accounts)
router.post("/user_details",usercontroller.user_details)
router.post("/user_detail",usercontroller.user_details)
router.post("/following_list",usercontroller.following_list)
router.post("/get_notification_settings",usercontroller.get_notification_settings)
//router.post("/get_notification_settings",notificationcontroller.get)
//router.post("/distance",GeneralController.distance)

module.exports = router