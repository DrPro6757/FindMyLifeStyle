import { View, Text, TouchableOpacity, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore, { firebase } from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Notifications from './Notifications';
import notifee, { AndroidStyle } from '@notifee/react-native';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';

let UserId: string | null | undefined;
let myFcmToken;
let getName;
let getEmail;
let getId;
let getFcm;
let getProfilepic;
const SendNotifications = () => {

    const [notificationBody, setnotificationBody] = useState('');
    const [notificationTitle, setnotificationTitle] = useState('');
    const [notificationData, setnotificationData] = useState('');
    const [totalNotifications, setTotalNotifications] = useState(0);
    const [notificationCount, setNotificationCount] = useState(0);

    const [notificationState, setnotificationState] = useState(false);



    useEffect(() => {
        console.log('send notification script')
        
          getMyFcmToken();
          getUserId();
          GetNotificationsData();
        //   GetNotificationsOnButton();
        //   getDatabase();

    }, [notificationState])
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            Alert.alert('A new FCM message arrived! in foreground mode', JSON.stringify(remoteMessage.notification?.body));
           if(remoteMessage){
            // notificationCount = notificationCount+1;
            // console.log('total notificationssssssssssss '+notificationCount)
            // setNotificationSent(!notificaitonSent);
           }
          displayLocalNotification(remoteMessage);
        });
        return unsubscribe;
    }, []);
    const GetNotificationsData=async()=>{
        await firestore().collection('notifications').doc(UserId)
        .get()
        .then(snapshot => {
            // myNotifications = snapshot._data.notificationData;

            // console.log('notifications from Db :: '+myNotifications)
            // console.log('total notifications :: '+myNotifications.length)

            // setTotalNotifications(myNotifications.length)
        })
        .catch(error => {
            console.log(error)
        })
    }
    const getMyFcmToken = async () => {
        myFcmToken = await AsyncStorage.getItem('MYFCMTOKEN');
        console.log('my fcm token ::' + myFcmToken);
    }
    const getUserId = async () => {
        UserId = await AsyncStorage.getItem('USERID');
        console.log('my user id  ::' + UserId);

    }
    let token = 'fA1vxTmSTHONFMDiHBRrVn:APA91bHau6-dStYdhf8d_Y6lJo2gLnbXZcyu_iIufvcd6nEPRKZejwL0w_Y5B2r96tJVqxYQHy0lykTrV0vlMekrCM8el4Qyvuo-AQjsbnsSHqvGwMyfV_58130HYgAl5iidEfEpnEbT';
    
    const sendNotification = async (token) => {
    //   var axios = require('axios');
      var data = JSON.stringify({
        data: {},
        notification: {
          body: 'Someone like your post',
          title: 'Someone click like button on your post',
        },
        to: token,
      });
    //   setnotificationData(data);
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        // Alert.alert('A new FCM message arrived! in foreground mode', JSON.stringify(remoteMessage.notification?.body));
        setnotificationBody(JSON.stringify(remoteMessage.notification?.body));
        setnotificationTitle(JSON.stringify(remoteMessage.notification?.title));
        setnotificationData(JSON.stringify(remoteMessage.notification?.body+', '
        + remoteMessage.notification?.title));
        // console.log("notification data ::"+notificationBody);
        // console.log("notification title ::"+notificationTitle);
        console.log("notification Data ::"+notificationData);


        
        let notifications = await firestore().collection('notifications').doc(UserId)
        .get()
        .then(snapshot => {
            let totalNotifications = snapshot._data.notificationCount;

            console.log('notifications from Db :: '+totalNotifications)
            // console.log('total notifications :: '+totalNotifications.length)

            setTotalNotifications(totalNotifications)
        })
        .catch(error => {
            console.log(error)
        });
        firestore().collection('notifications').doc(UserId).update({
            senderId:UserId,
            senderToken: firestore.FieldValue.arrayUnion(myFcmToken.toString()),
            receiverId:UserId,
            receiverToken:firestore.FieldValue.arrayUnion(myFcmToken.toString()),
            messageBody:notificationBody,
            messageTitle:notificationTitle,
            notificationData: firestore.FieldValue.arrayUnion(notificationData),
            messageType:'test',
            notificationCount: totalNotifications+1,
        })
        setTotalNotifications(totalNotifications);
        console.log("Data added to firebase");
        setnotificationState(!notificationState);
    });
    
       
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
          console.log(JSON.stringify(response.data));
          Alert.alert(notificationData);
         
        })
        .catch(function (error) {
          console.log(error)
        });

        
      

    };
    ////
    ///      Get Notification Data and Display
    ///
    // const DisplayTotalNotificationNumber=async()=>{
    //     let notifications = await firestore().collection('notifications').doc(UserId)
    //     .get()
    //     .then(snapshot => {
    //         let totalNotifications = snapshot._data.notificationCount;

    //         console.log('notifications from Db :: '+totalNotifications)
    //         // console.log('total notifications :: '+totalNotifications.length)

    //         setTotalNotifications(totalNotifications)
    //     })
    //     .catch(error => {
    //         console.log(error)
    //     });
    //     setnotificationState(!notificationState)
    // }
    const GetNotificationsOnButton=async()=>{
        // let myNotifications = [];
        // let notifications = await firestore().collection('notifications').doc(UserId)
        // .get()
        // .then(snapshot => {
        //     myNotifications = snapshot._data.notificationCount;

        //     console.log('notifications from Db :: '+myNotifications)
        //     console.log('total notifications :: '+myNotifications.length)

        //     setNotificationCount(myNotifications.length)
        // })
        // .catch(error => {
        //     console.log(error)
        // });
        // setnotificationState(!notificationState)
        firestore().collection('notifications').doc(UserId).update({
            notificationCount: 0,
        })
        setTotalNotifications(0);
        console.log("total remaining notifications ::" + totalNotifications)
        setnotificationState(!notificationState)
    }
  
    const displayLocalNotification = async (data) => {
        // Request permissions (required for iOS)
        await notifee.requestPermission()
    
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });
    
        // Display a notification
        await notifee.displayNotification({
            title : "My Local Notification Title",
            body: "My Local Notification Body",
        //   title: data.notification.title,
        //   body: data.notification.body,
          android: {
            channelId,
            //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
              id: 'default',
            },
            // style: 
            // { type: 
            //     AndroidStyle.BIGPICTURE, picture: 'https://cdn.cdnparenting.com/articles/2018/03/407263582-H-1024x700.webp' 
            // },
          },
        });
      }
    
    return (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text>My Notifications</Text>
            <View style ={{marginVertical:10}}>

                <TouchableOpacity 
                style={{borderWidth:2, borderRadius:1, borderColor:'black'}}
                onPress={()=>sendNotification(token)}

                >
                    <Text>Send Notification</Text>
                    <Text>Total Notifications</Text>
            <Text>{totalNotifications}</Text>
                </TouchableOpacity>
            </View>
            <View style ={{marginVertical:10}}>
                <TouchableOpacity 
                style={{borderWidth:2, borderRadius:1, borderColor:'black'}}
                // onPress={()=>displayLocalNotification()}
                >
                    <Text>Display Local Notification</Text>
                </TouchableOpacity>
            </View>
            <View style ={{marginVertical:10}}>
                <TouchableOpacity 
                style={{borderWidth:2, borderRadius:1, borderColor:'black'}}
                // onPress={()=>DisplayTotalNotificationNumber()}
                >
                    <Text>Display Notification From Db</Text>
                </TouchableOpacity>
            </View>
            
            <View style ={{marginVertical:10}}>
                <TouchableOpacity 
                style={{borderWidth:2, borderRadius:1, borderColor:'black'}}
                onPress={()=>GetNotificationsOnButton()}
                >
                    <View style = {{flexDirection:'row'}}>
                    <Text>Open Notification From Db</Text>
                    <Image source ={require('../Images/notification.png')}
                    style={{width:30, height:30, marginLeft:10, 
                        tintColor: totalNotifications?'red':'black'}}
                    />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )

}

export default SendNotifications