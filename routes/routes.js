const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

//const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
jsonparser = bodyParser.json();
const multer = require("multer");
const form = multer()
const path = require("path")
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require('fs');
const crypto = require("crypto");
const session = require('express-session');
//const auth = require("../middleware/oath");
const moment = require("moment")
const usercontroller = require("../controller/userController")
const videocontroller = require("../controller/VideosController")
const notificationcontroller = require("../controller/NotificationController")
const VideoBookmarkController = require("../controller/VideoBookmarkController")
const  VideoWatchHistoryController = require("../controller/VideoWatchHistoryController")
const VideoCommentPinnedController = require("../controller/VideoCommentPinnedController")
const VideoCommentLikesController  = require("../controller/VideoCommentLikesController")
const VideoNotInterestedController = require("../controller/VideoNotInterestedController")
const VideoDuetsController = require("../controller/VideoDuetsController")
const SearchHistoryController = require("../controller/SearchHistoryController")
const LanguageController = require("../controller/LanguageController")
const SettingController = require("../controller/SettingController")
const HelpCenterController = require("../controller/HelpCenterController")
const SongsController = require("../controller/SongsController")
const SoundBookmarksController = require("../controller/SoundBookmarksController")
const NotificationController = require("../controller/NotificationController")
const VideoEffectsController = require("../controller/VideoEffectsController")
const HashtagBookmarksController = require("../controller/HashtagBookmarksController")
const BlockUserContoller = require("../controller/BlockUserContoller")
const RecentEmojisController = require("../controller/RecentEmojisController")
const RestrictAccountsController  = require("../controller/RestrictAccountsController")
const VideoReportController  = require("../controller/VideoReportController")
const VideoEffectBookmarkController  = require("../controller/VideoEffectBookmarkController")
const AccountVerificationController  = require("../controller/AccountVerificationController")
const videoFavoriteController  = require("../controller/videoFavoriteController")
const Generalontroller  = require("../controller/GeneralController")
const Message = require("../model/messages")
const Chat = require("../model/chats")
const Videos = require("../model/videos")

const UserAuth = require("../middleware/UserMiddleware");
const { default: mongoose } = require("mongoose");


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
//uploads/videos/cover_image
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

const EffectStorage = multer.diskStorage ({
  destination: function (req, file, cb) {
    cb(null, "uploads/effects");
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

const EffectUpload = multer({
  storage: EffectStorage,
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

const DocumentStorage = multer.diskStorage ({
  destination: function (req, file, cb) {
    cb(null, "uploads/users/verification_documents");
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

const  DocumentUpload = multer({
  storage: DocumentStorage,
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


const SongStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(file.fieldname == 'attachment'){

      cb(null, "uploads/songs");
    }
    else if(file.fieldname == 'banner_image'){
      cb(null, "uploads/song_banner_image");
    }
  },
  filename: function (req, file, cb) {
    if(file.fieldname == 'attachment'){

      const uniqueSuffix =
      Date.now() + "-" + crypto.randomBytes(16).toString("hex");
      cb(
        null,
        uniqueSuffix +
        ".mp3"
        );
      }
      else if (file.fieldname == 'banner_image'){
        const uniqueSuffix =
      Date.now() + "-" + crypto.randomBytes(16).toString("hex");
    cb(
      null,
      uniqueSuffix + '.webp'
      )
      }
  },
});

const SongUpload = multer({
  storage: SongStorage,
  fileFilter: (req, file, cb) => {
    console.log(file)
    if(file.fieldname == 'attachment'){

      if (
        file.mimetype == "audio/mpeg" || file.mimetype == "audio/wave" 
        ) {
          cb(null, true);
        } else {
          return cb("Only .mp3 avi format allowed!");
        }
      }
      else if (file.fieldname == 'banner_image'){
        if (
          file.mimetype == "image/png" ||
          file.mimetype == "image/jpg" ||
          file.mimetype == "image/jpeg"
        ) {
          cb(null, true);
        } else {
          return cb("Only .png, .jpg and .jpeg format allowed!");
        }
      }
  },
  limits:{
      fileSize: 20 * 1024 * 1024 
    
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


const ReportStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/reports");
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

const ReportUpload = multer({
  storage: ReportStorage,
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



  router.post("/registration",form.array(),usercontroller.registration)
router.post("/social_signup",form.array(),usercontroller.social_signup)
router.post("/login",form.array(),usercontroller.LoginUser)
//router.post("/get_all_users",usercontroller.get_all_users)
router.post("/check_otp",form.array(),usercontroller.check_otp)
router.post("/check_username",form.array(),usercontroller.check_username)
router.post("/send_otp",usercontroller.send_otp)
router.post("/resend_otp",form.array(),usercontroller.resend_otp)
router.post("/update_location",form.array(),usercontroller.update_location)
//router.post("/update_profile",form.array(),usercontroller.update_profile)
//router.post("/get_user_language",usercontroller.USE)
router.post("/update_password",form.array(),usercontroller.update_password)
router.post("/reset_password",form.array(),usercontroller.reset_password)
router.post("/update_mobile_no",form.array(),usercontroller.update_mobile_no)
router.post("/update_username",form.array(),usercontroller.update_username)
router.post("/update_dob",form.array(),usercontroller.update_dob)
router.post("/update_privacy",form.array(),usercontroller.update_privacy)
router.post("/update_page_name",form.array(),usercontroller.update_page_name)
router.post("/update_safeties",form.array(),usercontroller.update_safeties)
router.post("/update_profile",ProfileUpload.single("profile_image"),usercontroller.update_profile)
router.post("/get_user_safeties",form.array(),usercontroller.get_user_safeties)
router.post("/update_notification_settings",form.array(),usercontroller.update_notification_settings)
router.post("/get_all_users",form.array(),usercontroller.get_all_users)
router.post("/all_user_list",form.array(),usercontroller.all_user_list)
router.post("/get_my_accounts",form.array(),usercontroller.get_my_accounts)
  //router.post("/get_all_users",form.array(),form.array(),usercontroller.)
//router.post("/get_all_users",form.array(),usercontroller.all)
router.post("/get_my_accounts",form.array(),usercontroller.get_my_accounts)
router.post("/user_details",form.array(),usercontroller.user_details)
router.post("/user_detail",form.array(),usercontroller.user_details)
router.post("/following_list",form.array(),usercontroller.following_list)
router.post("/get_notification_settings",form.array(),UserAuth,usercontroller.get_notification_settings)
router.post("/update_language",form.array(),usercontroller.update_language)
router.post("/get_user_language",form.array(),UserAuth, LanguageController.get_user_language)
router.post("/getmyqrcode",form.array(),UserAuth, usercontroller.getmyqrcode)

//router.post("/get_notification_settings",notificationcontroller.get)
//router.post("/distance",GeneralController.distance)


//follow

router.post("/to_follow",UserAuth,form.array(),usercontroller.to_follow)
router.post("/to_unfollow",UserAuth,form.array(),usercontroller.to_unfollow)
router.post("/following_list",UserAuth,form.array(),usercontroller.following_list)

router.post("/follow_list",UserAuth,form.array(),usercontroller.follow_list)

//language controller 

router.get("/language",form.array(), LanguageController.Index)

//upload video

//function for upload files to different destination 
router.post("/upload_video",UserAuth,VideoUpload.fields([{name:'cover_image',maxCount:1},{name:'video_file',maxCount:1}]), videocontroller.upload_video)
router.post("/video_list",form.array(),videocontroller.video_list)
router.post("/video_details",form.array(),videocontroller.video_details)
router.post("/private_position_video_list",form.array(),videocontroller.private_position_video_list)
router.post("/position_video_list",form.array(),videocontroller.position_video_list)
router.post("/remove_video_like",UserAuth,form.array(),videocontroller.remove_video_like)
router.post("/add_video_like",UserAuth,form.array(),videocontroller.add_video_like)
router.post("/get_video_likes",UserAuth,form.array(),videocontroller.get_video_likes)
router.post("/update_video_status",UserAuth,form.array(),videocontroller.update_video_status)

 

//watch history 
router.post("/get_watch_video_history",UserAuth,form.array(),VideoWatchHistoryController.get_watch_video_history)
router.post("/add_watch_video_history",UserAuth,form.array(),VideoWatchHistoryController.add_watch_video_history)


//  video comments
router.post("/add_video_comments",UserAuth,form.array(),videocontroller.add_video_comments)
router.post("/add_parent_comment",UserAuth,form.array(),videocontroller.add_parent_comment)
router.post("/remove_video_comments",UserAuth,form.array(),videocontroller.remove_video_comments)
router.post("/get_parent_video_comments",UserAuth,form.array(),videocontroller.get_parent_video_comments)
router.post("/get_video_comments",UserAuth,form.array(),videocontroller.get_video_comments)
router.post("/add_comment_pinned",UserAuth,form.array(),VideoCommentPinnedController.add_comment_pinned)
router.post("/remove_comment_pinned",UserAuth,form.array(),VideoCommentPinnedController.remove_comment_pinned)
//router.post("/add_parent_comment")

// add comment like
router.post("/add_comment_like",UserAuth,form.array(),VideoCommentLikesController.add_comment_like)
router.post("/remove_comment_like",UserAuth,form.array(),VideoCommentLikesController.remove_comment_like)

// video bookmarks
router.post("/add_video_bookmark",UserAuth,form.array(),VideoBookmarkController.add_video_bookmark)
router.post("/get_video_bookmarks",UserAuth,form.array(),VideoBookmarkController.get_video_bookmarks)
router.post("/remove_video_bookmark",UserAuth,form.array(),VideoBookmarkController.remove_video_bookmark)
//video favorite
router.post("/add_video_favorite",UserAuth,form.array(),videoFavoriteController.add_video_favorite)
router.post("/get_video_favorite",UserAuth,form.array(),videoFavoriteController.get_video_favorite)
router.post("/remove_video_favorite",UserAuth,form.array(),videoFavoriteController.remove_video_favorite)


// adding complaint 

router.post("/add_complaint",UserAuth,form.array(),usercontroller.add_complaint)
// video not intersted 

router.post("/add_video_not_interested",UserAuth,form.array(),VideoNotInterestedController.add_video_not_interested)
router.post("/remove_video_not_interested",UserAuth,form.array(),VideoNotInterestedController.remove_video_not_interested)
router.post("/get_video_not_interested",UserAuth,form.array(),VideoNotInterestedController.get_video_not_interested)

//video duets
router.post("/add_video_duet",UserAuth,form.array(),VideoDuetsController.add_video_duet)
router.post("/remove_video_duet",UserAuth,form.array(),VideoDuetsController.remove_video_duet)
router.post("/get_video_duets",UserAuth,form.array(),VideoDuetsController.get_video_duets)


//search history controller
router.post("/add_search_history",UserAuth,form.array(),SearchHistoryController.add_search_history)
router.post("/get_search_history",UserAuth,form.array(),SearchHistoryController.get_search_history)
router.post("/delete_search_history",UserAuth,form.array(),SearchHistoryController.delete_search_history)
router.post("/search_top_list",UserAuth,form.array(),SearchHistoryController.search_top_list)
router.post("/search_hashtag",UserAuth,form.array(),SearchHistoryController.search_hashtag)
router.post("/search_song",UserAuth,form.array(),SearchHistoryController.search_song)
router.post("/search_user",UserAuth,form.array(),SearchHistoryController.search_user)
router.post("/search_video",UserAuth,form.array(),SearchHistoryController.search_video)

//router.post("/search_hashtags_list",UserAuth,form.array(),SearchHistoryController.search_hashtags_list)
//router.post("/search_video_list",UserAuth,form.array(),SearchHistoryController.search_video_list)
//router.post("/hashtags_to_videos",UserAuth,form.array(),SearchHistoryController.hashtags_to_videos)
//router.post("/search_username_list",UserAuth,form.array(),SearchHistoryController.search_username_list)

// setting controller 

router.get("/terms_of_use",SettingController.terms_of_use)
router.get("/copyright_policy",SettingController.copyright_policy)
router.get("/privacy_policy",SettingController.privacy_policy)

//help center data
router.get("/gethelp",HelpCenterController.gethelp)
router.post("/gethelpbyid",form.array(),HelpCenterController.gethelpbyid)
router.post("/add_help_center_problem_resolved",form.array(),HelpCenterController.add_help_center_problem_resolved)

//songs controller 
router.post("/add_song",UserAuth,SongUpload.fields([{name:'attachment',maxCount:1},{name:'banner_image',maxCount:1}]),SongsController.add_song)
router.post("/add_banner_image",UserAuth,SongUpload.single("banner_image"),SongsController.add_banner_image)
router.post("/add_favortie_song",UserAuth,form.array(),SongsController.add_favortie_song)
router.post("/get_categories",UserAuth,form.array(),SongsController.get_categories)
router.post("/get_favorties_song",UserAuth,form.array(),SongsController.get_favorties_song)
router.get("/get_singers",UserAuth,form.array(),SongsController.get_singers)
router.post("/get_song",UserAuth,form.array(),SongsController.get_song)
router.post("/get_song_to_video",UserAuth,form.array(),SongsController.get_song_to_video)
router.post("/removed_favortie_song",UserAuth,form.array(),SongsController.removed_favortie_song)
router.post("/add_sound_bookmark",UserAuth,form.array(),SoundBookmarksController.add_sound_bookmark)
router.post("/get_song_bookmarks",UserAuth,form.array(),SoundBookmarksController.get_song_bookmarks)
router.post("/remove_song_bookmark",UserAuth,form.array(),SoundBookmarksController.remove_song_bookmark)


// notification route
router.post("/notification",UserAuth,form.array(),NotificationController.allNotification)
router.post("/like_notification_list",UserAuth,form.array(),NotificationController.like_notification_list)
router.post("/comment_notification_list",UserAuth,form.array(),NotificationController.comment_notification_list)
router.post("/follower_notification_list",UserAuth,form.array(),NotificationController.follower_notification_list)
router.post("/mentions_notification_list",UserAuth,form.array(),NotificationController.mentions_notification_list)



// vidoe effect
 router.post("/add_effect",UserAuth,EffectUpload.single("attachment"),VideoEffectsController.add_effect)
 router.post("/get_effect",UserAuth,form.array(),VideoEffectsController.get_effect)
 
 // video effect bookmark 
 router.post("/add_effect_bookmark",UserAuth,form.array(),VideoEffectBookmarkController.add_effect_bookmark)
 router.post("/get_effect_bookmarks",UserAuth,form.array(),VideoEffectBookmarkController.get_effect_bookmarks)
 router.post("/remove_effect_bookmark",UserAuth,form.array(),VideoEffectBookmarkController.remove_effect_bookmark)
 
 // hashtag controller
 router.post("/add_hashtag_bookmark",UserAuth,form.array(),HashtagBookmarksController.add_hashtag_bookmark)
 router.post("/remove_hashtag_bookmark",UserAuth,form.array(),HashtagBookmarksController.remove_hashtag_bookmark)
 router.post("/get_hashtag_bookmarks",UserAuth,form.array(),HashtagBookmarksController.get_hashtag_bookmarks)
 router.post("/hashtags_to_videos",UserAuth,form.array(),SearchHistoryController.hashtags_to_videos)
 
 // block user controller
 router.post("/add_block_user",UserAuth,form.array(),BlockUserContoller.add_block_user)
 router.post("/get_block_user_list",UserAuth,form.array(),BlockUserContoller.get_block_user_list)
 router.post("/remove_block_user",UserAuth,form.array(),BlockUserContoller.remove_block_user)

 //recent emoji controller
 router.post("/add_recent_emoji",UserAuth,form.array(),RecentEmojisController.add_recent_emoji)
 router.post("/get_recent_emoji",UserAuth,form.array(),RecentEmojisController.get_recent_emoji)
 
 
 // restric account controller 
 router.post("/get_recent_emoji",UserAuth,form.array(),RecentEmojisController.get_recent_emoji)
 
 //  video report controller

// account verification 
router.post("/add_account_verification",UserAuth,DocumentUpload.single("document"),AccountVerificationController.add_account_verification)


 router.post("/add_video_report",UserAuth,ReportUpload.array("report_files",5),VideoReportController.add_video_report)
 router.get("/get_video_report_types",UserAuth,form.array(),VideoReportController.get_video_report_types)
 
 // restrict account 
 router.post("/add_restrict_accounts",UserAuth,form.array(),RestrictAccountsController.add_restrict_accounts)
 
 
 // support request 
 router.post("/user_support_request",UserAuth,form.array(),usercontroller.user_support_request)



 // general controller 
 //router.post("/account_category_list",form.array(),GeneralController.getaccountcategory)
 //router.post("/country_list",form.array(),GeneralController.getcountries)
 
//  router.post('/demo',async(req,res)=>{
//     const video = await Videos.find({createdAt:{$gte:moment().subtract(1,"day").format()}})
//     console.log(video)
//  })
 

module.exports = router