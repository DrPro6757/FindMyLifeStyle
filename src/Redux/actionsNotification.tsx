import * as types from "./actionTypes";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import axios from "axios";

const EventJoinNotification =()=>({
    type: types.MYEvent_JoinNotification,
});
export const EventJoinNotificationSend = (props, eventFcmToken, myNameHere) =>{
    return function(dispatch){
        var data = JSON.stringify({
            data: {},
            notification: {
              body: myNameHere + ' Just Requested to Join ' + props.eventName,
              title: 'People Like Your'+'<p style="color: #4caf50;"><b> Event</span></p></b></p> &#x2764;&#x2764;',//&#128576
              image: 'https://cdn.britannica.com/84/73184-050-05ED59CB/Sunflower-field-Fargo-North-Dakota.jpg',
              icon : 'ic_small_icon',
              redirect_to:'EventJoin'
            },
            to: eventFcmToken,
          });
          console.log('Notification send Data ::: ' + JSON.stringify(data));
          var config = {
            method: 'post',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {
              Authorization:
                'key=AAAAZflHU5c:APA91bGirnbXx_FqDR8OoT4-MZPBSYJxn794pqiwZDhi7dUkYAfsxPUd3bQMY0z5Q7KG52PvmYguWRAEGGe94cZvzu32vjMst8g7cuL3triz2mMf9d0oT2U3QhuSeH5bobmuSVBKYdne',
              'Content-Type': 'application/json',
            },
            data: data,
          };
          axios(config)
            .then(function (response) {
            //   console.log('Notification send OutPut ::: ' + JSON.stringify(response.data));
      
      
            })
            .catch(function (error) {
              console.log(error)
            });
        dispatch(EventJoinNotification());
    }
}
const EventJoinRequestApprove=()=>({
  type: types.MYRequest_ApprovedNotification
});
export const EventJoinRequestApproveNotificationSend = (currentEventName, fcmToken, myName) =>{
  return function(dispatch){
      var data = JSON.stringify({
          data: {},
          notification: {
            body: myName +' Has Approved Your Request For Event '+currentEventName,
            title: 'Wow You Are Doing '+'<p style="color: #4caf50;"><b> Awesome</span></p></b></p> &#x2764;&#x2764;',//&#128576
            image: 'https://cdn.britannica.com/84/73184-050-05ED59CB/Sunflower-field-Fargo-North-Dakota.jpg',
            icon : 'ic_small_icon',
            redirect_to:'EventJoin'
          },
          to: fcmToken,
        });
        console.log('Notification send Data ::: ' + JSON.stringify(data));
        var config = {
          method: 'post',
          url: 'https://fcm.googleapis.com/fcm/send',
          headers: {
            Authorization:
              'key=AAAAZflHU5c:APA91bGirnbXx_FqDR8OoT4-MZPBSYJxn794pqiwZDhi7dUkYAfsxPUd3bQMY0z5Q7KG52PvmYguWRAEGGe94cZvzu32vjMst8g7cuL3triz2mMf9d0oT2U3QhuSeH5bobmuSVBKYdne',
            'Content-Type': 'application/json',
          },
          data: data,
        };
        axios(config)
          .then(function (response) {
          //   console.log('Notification send OutPut ::: ' + JSON.stringify(response.data));
    
    
          })
          .catch(function (error) {
            console.log(error)
          });
      dispatch(EventJoinRequestApprove());
  }
}
const userFollow=()=>({
  type: types.MyFollowing_Notification
});
export const UserFollowingNotification = (followerName, myName, fcmToken) =>{
  return function(dispatch){
      var data = JSON.stringify({
          data: {},
          notification: {
            body: myName + ' Is Now Following You',
            title: 'Wow '+followerName+' You Are Becoming '+'<p style="color: #4caf50;"><b>Popular</span></p></b></p> &#x2764;&#128576;',//&#128576
            image: 'https://cdn.britannica.com/84/73184-050-05ED59CB/Sunflower-field-Fargo-North-Dakota.jpg',
            icon : 'ic_small_icon',
            redirect_to:'EventJoin'
          },
          to: fcmToken,
        });
        console.log('Notification send Data ::: ' + JSON.stringify(data));
        var config = {
          method: 'post',
          url: 'https://fcm.googleapis.com/fcm/send',
          headers: {
            Authorization:
              'key=AAAAZflHU5c:APA91bGirnbXx_FqDR8OoT4-MZPBSYJxn794pqiwZDhi7dUkYAfsxPUd3bQMY0z5Q7KG52PvmYguWRAEGGe94cZvzu32vjMst8g7cuL3triz2mMf9d0oT2U3QhuSeH5bobmuSVBKYdne',
            'Content-Type': 'application/json',
          },
          data: data,
        };
        axios(config)
          .then(function (response) {
          //   console.log('Notification send OutPut ::: ' + JSON.stringify(response.data));
    
    
          })
          .catch(function (error) {
            console.log(error)
          });
      dispatch(userFollow());
  }
}

const messageSend=()=>({
  type: types.MessageSend_Notification
});

export const messageSendNotification = (myName, fcmToken) =>{
  return function(dispatch){
      var data = JSON.stringify({
          data: {},
          notification: {
            body: myName + ' Wrote You A Message',
            title: 'Check What '+myName +' Wrote In '+'<p style="color: #4caf50;"><b>Message</span></p></b></p> &#x2764;&#9997;;',//&#128576
            image: 'https://cdn.britannica.com/84/73184-050-05ED59CB/Sunflower-field-Fargo-North-Dakota.jpg',
            icon : 'ic_small_icon',
            redirect_to:'EventJoin'
          },
          to: fcmToken,
        });
        console.log('Notification send Data ::: ' + JSON.stringify(data));
        var config = {
          method: 'post',
          url: 'https://fcm.googleapis.com/fcm/send',
          headers: {
            Authorization:
              'key=AAAAZflHU5c:APA91bGirnbXx_FqDR8OoT4-MZPBSYJxn794pqiwZDhi7dUkYAfsxPUd3bQMY0z5Q7KG52PvmYguWRAEGGe94cZvzu32vjMst8g7cuL3triz2mMf9d0oT2U3QhuSeH5bobmuSVBKYdne',
            'Content-Type': 'application/json',
          },
          data: data,
        };
        axios(config)
          .then(function (response) {
          //   console.log('Notification send OutPut ::: ' + JSON.stringify(response.data));
    
    
          })
          .catch(function (error) {
            console.log(error)
          });
      dispatch(userFollow());
  }
}


