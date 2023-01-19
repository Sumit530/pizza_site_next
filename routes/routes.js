const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

//const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
jsonparser = bodyParser.json();
const multer = require("multer");
const form = multer()
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require('fs');
const crypto = require("crypto");
const session = require('express-session');
//const auth = require("../middleware/oath");
const { json } = require("body-parser");
const usercontroller = require("../controller/userController")
const videocontroller = require("../controller/VideosController")
const notificationcontroller = require("../controller/NotificationController")
const GeneralController = require("../controller/GeneralController")
const VideoBookmarkController = require("../controller/VideoBookmarkController")
const  VideoWatchHistoryController = require("../controller/VideoWatchHistoryController")
const VideoCommentPinnedController = require("../controller/VideoCommentPinnedController")
const VideoNotInterestedController = require("../controller/VideoNotInterestedController")
const VideoDuetsController = require("../controller/VideoDuetsController")
const UserAuth = require("../middleware/UserMiddleware")


const ProfileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile");
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

const ProfileUpload = multer.diskStorage({
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

const CoverImageStorage = multer.diskStorage ({
  destination: function (req, file, cb) {
    cb(null, "uploads/videos/cover_image");
  },
  
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + crypto.randomBytes(16).toString("hex");
    cb(
      null,
      uniqueSuffix + '.webp'
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

const VideoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(file.fieldname == 'video_file'){

      cb(null, "uploads/videos/videos");
    }
    else if(file.fieldname == 'cover_image'){
      cb(null, "uploads/videos/cover_image");
    }
  },
  filename: function (req, file, cb) {
    if(file.fieldname == 'video_file'){

      const uniqueSuffix =
      Date.now() + "-" + crypto.randomBytes(16).toString("hex");
      cb(
        null,
        uniqueSuffix +
        ".mp4"
        );
      }
      else if (file.fieldname == 'cover_image'){
        const uniqueSuffix =
      Date.now() + "-" + crypto.randomBytes(16).toString("hex");
    cb(
      null,
      uniqueSuffix + '.webp'
      )
      }
  },
});

const VideoUpload = multer({
  storage: VideoStorage,
  fileFilter: (req, file, cb) => {
    if(file.fieldname == 'video_file'){

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
      }
      else if (file.fieldname == 'cover_image'){
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
      }
  },
  limits:{
      fileSize: 20 * 1024 * 1024 
    
  }
});






router.post("/registration", form.array(),usercontroller.registration)
router.post("/social_signup",form.array(),usercontroller.social_signup)
router.post("/login",form.array(),usercontroller.LoginUser)
//router.post("/get_all_users",usercontroller.get_all_users)
router.post("/check_otp",form.array(),usercontroller.check_otp)
router.post("/check_username",form.array(),usercontroller.check_username)
router.post("/send_otp",form.array(),usercontroller.send_otp)
router.post("/resend_otp",form.array(),usercontroller.resend_otp)
router.post("/update_location",form.array(),usercontroller.update_location)
//router.post("/get_user_language",usercontroller.USE)
router.post("/update_password",form.array(),usercontroller.update_password)
router.post("/update_mobile_no",form.array(),usercontroller.update_mobile_no)
router.post("/update_username",form.array(),usercontroller.update_username)
router.post("/update_privacy",form.array(),usercontroller.update_privacy)
router.post("/update_safeties",form.array(),usercontroller.update_safeties)
router.post("/get_user_safeties",form.array(),usercontroller.get_user_safeties)
router.post("/update_notification_settings",form.array(),usercontroller.update_notification_settings)
router.post("/get_all_users",form.array(),usercontroller.get_all_users)
router.post("/get_my_accounts",form.array(),usercontroller.get_my_accounts)
  //router.post("/get_all_users",form.array(),form.array(),usercontroller.)
//router.post("/get_all_users",form.array(),usercontroller.all)
router.post("/get_my_accounts",form.array(),usercontroller.get_my_accounts)
router.post("/user_details",form.array(),usercontroller.user_details)
router.post("/user_detail",form.array(),usercontroller.user_details)
router.post("/following_list",form.array(),usercontroller.following_list)
router.post("/get_notification_settings",form.array(),usercontroller.get_notification_settings)

//router.post("/get_notification_settings",notificationcontroller.get)
//router.post("/distance",GeneralController.distance)


//follow

router.post("/to_follow",UserAuth,form.array(),usercontroller.to_follow)
router.post("/to_unfollow",UserAuth,form.array(),usercontroller.to_unfollow)
router.post("/following_list",UserAuth,form.array(),usercontroller.following_list)
router.post("/follow_list",UserAuth,form.array(),usercontroller.follow_list)


//upload video

//function for upload files to different destination 
router.post("/upload_video",UserAuth,VideoUpload.fields([{name:'cover_image',maxCount:1},{name:'video_file',maxCount:1}]), videocontroller.upload_video)
router.post("/video_list",form.array(),videocontroller.video_list)
router.post("/video_details",form.array(),videocontroller.video_details)
//router.post("/position_video_list",form.array(),videocontroller.private_position_video_list)
router.post("/remove_video_like",UserAuth,form.array(),videocontroller.remove_video_like)
router.post("/add_video_like",UserAuth,form.array(),videocontroller.add_video_like)
router.post("/get_video_likes",UserAuth,form.array(),videocontroller.get_video_likes)



//watch history 
router.post("/get_watch_video_history",UserAuth,form.array(),VideoWatchHistoryController.get_watch_video_history)
router.post("/add_watch_video_history",UserAuth,form.array(),VideoWatchHistoryController.add_watch_video_history)


//  video comments
router.post("/add_video_comments",UserAuth,form.array(),videocontroller.add_video_comments)
router.post("/add_parent_comment",UserAuth,form.array(),videocontroller.add_parent_comment)
//router.post("/get_parent_video_comments",UserAuth,form.array(),videocontroller.get_parent_video_comments)
router.post("/add_comment_pinned",UserAuth,form.array(),VideoCommentPinnedController.add_comment_pinned)
router.post("/remove_comment_pinned",UserAuth,form.array(),VideoCommentPinnedController.remove_comment_pinned)
//router.post("/add_parent_comment")

// video bookmarks
router.post("/add_video_bookmark",UserAuth,form.array(),VideoBookmarkController.add_video_bookmark)
//router.post("/get_video_bookmarks",UserAuth,form.array(),VideoBookmarkController.get_video_bookmarks)
router.post("/remove_video_bookmark",UserAuth,form.array(),VideoBookmarkController.remove_video_bookmark)



// video not intersted 

router.post("/add_video_not_interested",UserAuth,form.array(),VideoNotInterestedController.add_video_not_interested)
router.post("/remove_video_not_interested",UserAuth,form.array(),VideoNotInterestedController.remove_video_not_interested)
router.post("/get_video_not_interested",UserAuth,form.array(),VideoNotInterestedController.get_video_not_interested)

//video duets
router.post("/add_video_duet",UserAuth,form.array(),VideoDuetsController.add_video_duet)
router.post("/remove_video_duet",UserAuth,form.array(),VideoDuetsController.remove_video_duet)
router.post("/get_video_duets",UserAuth,form.array(),VideoDuetsController.get_video_duets)

module.exports = router