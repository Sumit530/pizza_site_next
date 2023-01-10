var admin = require("firebase-admin");
var fcm = require('fcm-notification');
var serviceAccount = require("../config/privateKey.json");
const certPath = admin.credential.cert(serviceAccount);
var FCM = new fcm(certPath);

exports.sendPushNotification= (fcm_token, title, body,content,notification_id,type,user_id,image,sound,vibrate) => {

    try{
        let message = {
            data: {
                message: {
                    title: title,
                    body: body,
                    content : content,
                    notification_id :notification_id,
                    type:type,
                    id:user_id,
                    image : image,
                    sound : sound,
                    vibrate : vibrate
                },
            },
            token: fcm_token
        };

        FCM.send(message, function(err, resp) {
            if(err){
                throw err;
            }else{
                console.log('Successfully sent notification');
            }
        });

    }catch(err){
        throw err;
        }

    }
