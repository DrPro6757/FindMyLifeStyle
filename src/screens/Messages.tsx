import { View, Text, Image, TouchableOpacity, Platform } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { Bubble, GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat'
import { useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import { TextInput } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import { messageSendNotification } from '../Redux/actionsNotification';
import notifee, {AndroidColor, AndroidImportance, AndroidStyle} from '@notifee/react-native';

//later
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
messaging().getInitialNotification();


const Messages = () => {
  const [messages, setMessages] = useState([]);

  const [chatNotificationCount, setChatNotificationCount] = useState(0);
  const [chatNotificationContent, setChatNotificationContent] = useState('');
  const [chatNotificationBody, setChatNotificationBody] = useState('');
  const [chatNotificationTitle, setChatNotificationTitle] = useState('');
  const [userList, setUserslist] = useState([]);

  let myID = "";
  let myName = "";
  let myImage = "";

  const dispatch = useDispatch();
  const route = useRoute();
  useEffect(() => {

    const subscriber = firestore().collection('chats').
      doc(route.params.id + route.params.data.id).collection('messages').
      orderBy("createdAt", "desc");
    subscriber.onSnapshot(querysnapshot => {
      const allmessages = querysnapshot.docs.map(item => {

        return { ...item._data, createdAt: item._data.createdAt };

      });
      setMessages(allmessages);
    });
    return () => subscriber;
  }, [])
useEffect(() => {
  let tempUsers = []
  users && users.map((item)=>{
    // console.log('All User Data Direct == ',userList)
    // if(item.id!==myID){
      tempUsers.push(item)
    // }
  })
  setUserslist(tempUsers)
}, [])
//later
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      //   Alert.alert('A new FCM message arrived! in foreground mode', JSON.stringify(remoteMessage));
    //laer
      //  displayNotification(remoteMessage);
    });

    return unsubscribe;
  }, []);
  const {mydata} = useSelector(state => state.myUserData)
  const {users} = useSelector(state => state.myUserData)

  mydata && 
  mydata.map(item=>{
   myID = item.id;
   myName = item.name;
   myImage = item.profileImage;
  })
  //later
//   const displayNotification = async data => {
//     // Request permissions (required for iOS)
//     if(Platform.OS == 'ios'){
//       await notifee.requestPermission()
//     }
    

//     // Create a channel (required for Android)
//     const channelId = await notifee.createChannel({
//       id: 'default10',
//       name: 'Default Channel10',
//       sound:'whistle',
//       importance:AndroidImportance.HIGH,
//       vibration:true,
//       vibrationPattern: [300, 500],
//       lights: true,
//       lightColor: AndroidColor.RED,
//     });

//     // Display a notification
//     await notifee.displayNotification({
//       title: data.notification.title,
//       body: data.notification.body,
//       android: {
//         channelId,
//         smallIcon: 'ic_small_icon', // optional, defaults to 'ic_launcher'.
//         // pressAction is needed if you want the notification to open the app when pressed
//         pressAction: {
//           id: 'default',
//         },
//         style: 
//         { type: 
//             AndroidStyle.BIGPICTURE, picture: myImage,
//         },
//       },
//     });
// };
  const onSend = useCallback((messages = []) => {
    const msg = messages[0];
    const myMsg = {
      ...msg,
      sendBy: route.params.id,
      sendTo: route.params.data.id,
      createdAt: Date.parse(msg.createdAt),
      // avatar:'https://firebasestorage.googleapis.com/v0/b/fir-login-f23d7.appspot.com/o/profile%2Frn_image_picker_lib_temp_5526c9a4-758c-4316-b076-42c9c5fedcfd.jpg?alt=media&token=b8fc4bf7-0571-46db-8dc2-34b3aa0a5974&_gl=1*19wxkwo*_ga*MTAxMzM5MDgwOC4xNjkxMjUxNDc4*_ga_CW55HF8NVT*MTY5Njc3OTc0Mi4xNzYuMS4xNjk2Nzc5NzgzLjE5LjAuMA..',

    }
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, myMsg),
    );
    firestore().collection('chats').doc("" + route.params.id + route.params.data.id).
      collection('messages').add(myMsg);
      
    firestore().collection('chats').doc("" + route.params.data.id + route.params.id).
      collection('messages').add(myMsg);

      firestore()
      .collection('users')
      .doc(route.params.id)
      .update({
        chatsBy: firestore.FieldValue.arrayUnion(
          route.params.data.id.toString(),
        ),
        
      })
      .then(res => {})
      .catch(error => {
        console.log(error);
      });
      firestore()
      .collection('users')
      .doc(route.params.data.id)
      .update({
        chatsBy: firestore.FieldValue.arrayUnion(
          route.params.id.toString(),
        ),
        messageFrom: firestore.FieldValue.arrayUnion(
          route.params.id.toString(),
        ),
      })
      .then(res => {})
      .catch(error => {
        console.log(error);
      });
    console.log("my id senderID" + route.params.id)
    console.log("id of every one" + route.params.data.id);
    // sendNotificationMessageSent();
    // NotifyFunction()
    // sendNotificationMessageSent();
    getFcmTokenForNotification(route.params.data.id)
  }, [])
  const getFcmTokenForNotification=(sendToId)=>{
    console.log('user list data for notification == '+userList)
    let fcmToken;
    userList.map(item=>{
      if (item.id === sendToId){
        fcmToken = item.fcmToken;
        console.log('id of poster == ',item.id)
      }
      // if (item.id === myID){
      //   fcmToken = item.fcmToken
      //   console.log('My Id Here On Join Pressed == ',item.id)
      // }
    })
    console.log('My FcmToken Here On Join Pressed == ',fcmToken)
    dispatch(messageSendNotification(myName,fcmToken));
  }
  const NotifyFunction = () =>{
    console.log('Send Notification to Token '+route.params.data.name+ ' FCM TOKEN '+route.params.data.fcmToken);
    console.log("Some Send Message "+route.params.name+ " Send you a message");
    setChatNotificationContent(route.params.name+ " Send you a message");
    console.log("notifcation sent first function:: " + chatNotificationContent);
  }
  const sendNotificationMessageSent = async () => {
    
    // var axios = require('axios');

    const notificationData =route.params.name + " send you a message at " + new Date();
    // setChatNotificationContent("notificationData");
    console.log("notifcation sent :: " + chatNotificationContent);

    var data = JSON.stringify({
      data: {},
      notification: {
        body: route.params.name + ' send you a message ',
        title: 'some one send a message to you',
      },
      to: route.params.data.fcmToken,
    });
    setChatNotificationBody(JSON.stringify(data));
    setChatNotificationTitle(JSON.stringify(data));
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
        console.log('Notification send OutPut ::: ' + JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error)
      });

    ///
    /// storing notification in firebase
    ///
    let tempNotificationCount;
    await firestore()
      .collection('notifications')
      .doc(route.params.data.id)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);

        if (documentSnapshot.exists) {
          console.log('User data for events: ', documentSnapshot.data());
          console.log('User data for event notification counter :: ', documentSnapshot.data().notificationCounter);
          tempNotificationCount = documentSnapshot.data().notificationCounter;
          setChatNotificationCount(tempNotificationCount + 1)
          // setMyPhotos(documentSnapshot.data().photos)

        }

      });



    await firestore()
      .collection('notifications')
      .doc(route.params.data.id)
      .update({
        notificationCounter: chatNotificationCount,
        messageContent: firestore.FieldValue.arrayUnion(route.params.name+ " Send you a message at "+new Date()),
        messageBody: firestore.FieldValue.arrayUnion(chatNotificationBody.toString()),
        messageTitle: firestore.FieldValue.arrayUnion(chatNotificationTitle.toString()),
        messageType: 'chat',
        receiverId: route.params.data.id,
        receiverToken: route.params.data.fcmToken,
        senderId: 'myUserId',
        senderToken: 'myFcmToken',
        senderProfileImage: route.params.myProfileImage,
        senderUserName: route.params.name,
        timeStamp: new Date(),
      }).then(res => {
        console.log("notifcation sent :: " + chatNotificationContent);
      }

      ).catch(error => {
        console.log(error);
      })

  };
  return (
    <View style={{ flex: 1, backgroundColor:'white' }}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        
        showAvatarForEveryMessage={true}
        isTyping
        user={{
          _id: route.params.id,
          avatar: route.params.myProfileImage,
        }}
        renderSend={props=>{
          return(
            <View style={{flexDirection:'row', alignItems:'center', height:60}}>
              <TouchableOpacity>
              <Image source={require('../Images/image.png')}
                style={{height:24, width:24, marginRight:10}}
                />
              </TouchableOpacity>
              <Send {...props} containerStyle={{justifyContent:'center', marginLeft:2}}>
                <Image source={require('../Images/send.png')}
                style={{height:24, width:24, marginRight:10, tintColor:'white'}}
                />
              </Send>
            </View>
          )
        }}
        renderInputToolbar={props=>{
          return(
            <InputToolbar {...props} containerStyle={{backgroundColor:'black'}} ></InputToolbar>//#088F8F
          )
        }}
        // renderAvatar={}
        // renderBubble={
        //   props => {
        //     return <Bubble {...props} wrapperStyle={{
        //       left: {
        //         backgroundColor: 'blue',//#e75480
        //       }
        //     }} />
        //   }
        // }
      renderBubble={
        props=>{
          return <Bubble {...props} wrapperStyle = {{right:{
            backgroundColor :'purple',
          },
          left:{
            backgroundColor :'#89CFF0',
          },
        }}/>
        }
      }
      />
      
    </View>


  )
}

export default Messages