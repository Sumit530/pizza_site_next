const express = require("express");
const adminRoute = express.Router();
const bodyParser = require("body-parser");



//const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
jsonparser = bodyParser.json();
const multer = require("multer");
const form = multer().array()
const path = require("path")
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require('fs');
const crypto = require("crypto");
const session = require('express-session');
const userController = require("../adminController/userController")
const ProfileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/users/profile");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix =
        Date.now() + "-" + crypto.randomBytes(12).toString("hex");
      cb(
        null,
        uniqueSuffix +
          ".webp"
    
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

  adminRoute.post("/getallusers",form,userController.GetAllUser)
  adminRoute.post("/update_profile",ProfileUpload.single("profile_image"),userController.updateProfile)
  adminRoute.post("/get_two_factor_disable_user",form,  userController.getTwoFactorDisableUser)
  adminRoute.post("/require_two_factor",form,  userController.require_two_factor)
  adminRoute.post("/verify_email",form,  userController.verify_email)
  adminRoute.get("/show_verification_requests",userController.show_verification_requests)
  adminRoute.post("/email_not_verified_user",form, userController.email_not_verified_user)

  module.exports = adminRoute