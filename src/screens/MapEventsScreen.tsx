import { View, Text, StyleSheet, Image, FlatList, Alert, TouchableOpacity, Button, Modal, ScrollView, Platform } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import MapView, { Callout, CalloutSubview, MapCalloutSubview, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDistance, getPreciseDistance } from 'geolib';
// import { AnimatedView } from 'react-native-reanimated/lib/typescript/reanimated2/component/View';
import CustomMarker from './CustomMarker';
import Slider from '@react-native-community/slider';
import { el } from 'date-fns/locale';
import GestureRecognizer from 'react-native-swipe-gestures';
import TabNavigationCustom from '../navigations/TabNavigationCustom';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import {useDispatch, useSelector} from "react-redux";
import { getAllEventsInitiate, getEventJoinRequestOperation } from '../Redux/actionsEvents';
import axios from 'axios';
import { getMyUserDataAction, getUsersInitiate } from '../Redux/actionsUser';
import { configureStore } from '@reduxjs/toolkit';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidStyle, AndroidImportance, AndroidColor } from '@notifee/react-native';
import { EventJoinNotificationSend } from '../Redux/actionsNotification';
import QRCode from 'react-native-qrcode-svg';


// import {userFilterData} from './EventsScreen';


const MapEventsScreen = (props) => {

    //later
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
   
  });
  messaging().onNotificationOpenedApp(async remotemMessage =>{
    
    if(!!remotemMessage?.data && remotemMessage?.data?.redirect_to == "EventJoin")
    console.log('we are redirectting to screen Admin Dashboard for notification management %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
    console.log('navigate to == ',props.selectedTab)
    setTimeout(()=>{
  console.log('we are redirectting to screen Admin Dashboard for notification management %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
  //navigateTo event Join Screen
  },1200)
  })
  messaging().getInitialNotification();


  const snapPoints =['30%', '60%', '90%']
    let childRef = useRef(null)
    const [refVisible, setRefVisible] = useState(false)

    const [postData, setPostData] = useState([]);
    const [Loading, setLoading] = useState(false);
    const [getLatitude, setGetLatitude] = useState('');
    const [getLongitutde, setGetLongitude] = useState('');

    const [getPostion, setGetPosition] = useState();
    const [allEventData, setAllEventData] = useState(null);

    const [myUserId, setMyUserId] = useState('');
    const [myName, setMyUserName] = useState('');
    const [myProfileImage, setMyProfileImage] = useState('');
    const [myFcmToken, setMyFcmToken] = useState('');
    const [myData, setMyData] = useState([]);
    const [myDistance, setMyDistance] = useState([]);
    const [minDistance, setMinDistance] = useState(1);
    const [maxDistance, setMaxDistance] = useState(1000);
    const [filterGender, setFilterGender] = useState('')
    const [filterGenderAll, setFilterGenderAll] = useState('Both')
    const [filterModal, setFilterModal] = useState(false);

    const [eventInfoModal, setEventInfoModal] = useState(false)

    const [selectedEvent, setSelectedEvent] = useState([]);
    const [fullScreen, setFullScreen] = useState(false);
    const[myTotalFollowers, setMyTotalEventReq] = useState([]);
    const[myTotalEventMembers, setMyTotalEventMem] = useState([]);
    const [likeButton, setLikeButton] = useState(false);
    const [eventFcmToken, setEventFcmToken] = useState('');
    const [eventNotificationSentContent, setEventNotificationSentContent] = useState('');
    const [eventNotificationCount, setEventNotificationCount] = useState(0);
    const [eventPostDateTime, seteventPostDateTime] = useState('');
    const [eventStatus, setEventStatus] = useState('');
    const [interestModal, setInterestModal] = useState(false);
    const [selectedInterest, setSelectedInterest] = useState('Hobbies and Activities');
    const [selected, setSelected] = useState([])
    const [selectedView, setSelectedView] = useState();
    const [updateState, setUpdateState] = useState(false);
    const [userList, setUserslist] = useState([]);
    const [notificaitonSent, setNotificationSent] = useState(false);
    const [setNotificationImage, notificationImage] = useState('')
    const [qrCodeValue, setQrCodeValue] = useState('');
    let UserId = '';
    let myUserName = '';
    let ProfileImage = '';
    let myEmail = '';
    let FcmToken = '';
    let myMembers;
    let MLat = 0
    let MLong = 0
    let myLat = '';
    let myLong = '';
    let dataMapPostion = []
    let eventsAllData = []
    let arrayLat = []
    let arrayLong = []

    const interests = [
      {
        interestName: 'Hobbies and Activities',
        index: 0,
      },
      {interestName: 'Professional Interests', index: 1},
      {interestName: 'Health and Lifestyle', index: 2},
      {interestName: 'Food and Dining', index: 3},
      {interestName: 'Technology and Gaming', index: 4},
      {interestName: 'Social Causes', index: 5},
      {interestName: 'Travel', index: 6},
      {interestName: 'Arts and Culture', index: 7},
      {interestName: 'Learning and Education', index: 8},
      {interestName: 'Regional and Cultural Interests', index: 9},
      {interestName: 'Entertainment', index: 10},
      {interestName: 'Dating And Party', index: 11},
    ];
    const MapCoordinates = [
        { latitude: 51.51477, longitude: -0.07231 },
        { latitude: 51.52138, longitude: -0.12845 },
        { latitude: 51.50152, longitude: -0.14184 },

    ]
    const [selectedId, setSelectedId] = useState('');
    const [checkJoinStatus, setJoinStatus] = useState(0);
    const [houseFull, setHouseFull] = useState(false);
    const [joinedConfirm, setJoniedConfirm] = useState(false);
    //later
//     useEffect(() => {
//       const unsubscribe = messaging().onMessage(async remoteMessage => {
//         // Alert.alert('A new FCM message arrived! in foreground mode', JSON.stringify(remoteMessage.notification?.body));
//         if (remoteMessage) {
//           {
//             // setNotificationImage(remotemMessage.data.url)
//           }
//           // notificationCount = notificationCount + 1;
//           // console.log('total notificationssssssssssss ' + notificationCount)
//           setNotificationSent(!notificaitonSent);
//         }
//         // if(!!remoteMessage?.data && remoteMessage?.data?.url)
//         // {
          
//           // setNotificationImage(remotemMessage.data.url)
//         // }
//         displayNotification(remoteMessage);
//       });
//   messaging().onNotificationOpenedApp(async remotemMessage =>{
//     if(!!remotemMessage?.data && remotemMessage?.data?.redirect_to == "EventJoin")
//     console.log('navigate to == ',props.selectedTab)
//     setTimeout(()=>{
//   console.log('we are redirectting to screen Admin Dashboard for notification management %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
//   //navigateTo event Join Screen
//   },1200)
//   })
//       return unsubscribe;
//     }, []);
    useEffect(() => {
      getJoinStatus();
    }, [likeButton])
    const displayNotification = async (data) => {
      // Request permissions (required for iOS)
      if(Platform.OS == 'ios'){
        await notifee.requestPermission()
      }
      
  
      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'default10',
        name: 'Default Channel10',
        sound:'whistle',
        importance:AndroidImportance.HIGH,
        vibration:true,
        vibrationPattern: [300, 500],
        lights: true,
        lightColor: AndroidColor.RED,
      });
  
      // Display a notification
      await notifee.displayNotification({
        title: data.notification.title,
        body: data.notification.body,
        android: {
          channelId,
          smallIcon: 'ic_small_icon', // optional, defaults to 'ic_launcher'.
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'default',
          },
          style: 
          { type: 
              AndroidStyle.BIGPICTURE, picture: myProfileImageHere,
          },
        },
      });
    }
    const dispatch = useDispatch();
    useEffect(() => {
      // getAllEVentData()
        dispatch(getMyUserDataAction());
        dispatch(getUsersInitiate());
        dispatch(getAllEventsInitiate());
        getFcmToken()
        getUserId();
    }, [likeButton, updateState, selectedId])
    const {mydata} = useSelector(state => state.myUserData);
    const {users} = useSelector(state => state.myUserData);
  
    let myID = "";
  let myNameHere = "";
  let myProfileImageHere = "";
    mydata && 
    mydata.map(item=>{
     myID = item.id;
     myNameHere = item.name;
     myProfileImageHere = item.profileImage;
    })
  
    const {allevents} = useSelector(state => state.eventData);
    const {myRequests} = useSelector(state => state.eventData);
    // allevents && allevents.map((item)=>{
    // setPostData(allevents)
    //     })
    useEffect(() => {
      let tempData = [];
      console.log('all req Id&&&&&&&&&&&&& ',myRequests)
      allevents && allevents.map((item)=>{
        if(item.postId === selectedId){
          item.eventMembersList.map(itemMem=>{
              // if(itemMem.length > item.members){
            item.eventJoinRequests.map(itemReq=>{
          
          //  item.eventJoinRequests && 
          if(itemMem === myID && itemReq !== myID){
            setJoinStatus(2);
            console.log('join status mem Id***********&&&&&&&&&&&&&', item.eventName)
            console.log('joined mem Id***********&&&&&&&&&&&&& Status == ',checkJoinStatus)
            console.log('all mem Id***********&&&&&&&&&&&&& ',itemMem)
            
          }else if(itemReq === myID && itemMem !== myID){
            setJoinStatus(1)
            console.log('all req Id***********&&&&&&&&&&&&& ',itemReq)
            console.log('all req Id***********&&&&&&&&&&&&& Status == ',checkJoinStatus)
             console.log('join status req Id***********&&&&&&&&&&&&&', item.eventName)
             console.log('join status req Id***********&&&&&&&&&&&&&', item.eventJoinRequests)
          }
          else if(itemReq !== myID && itemMem !== myID){
            setJoinStatus(0)
            console.log('join status req Id not found ***********&&&&&&&&&&&&&', item.eventName)
            console.log('join status req Id not found ***********&&&&&&&&&&&&& status == ',checkJoinStatus )
            console.log('join status req Id not found ***********&&&&&&&&&&&&&', item.eventJoinRequests)
            
          }else{
            setJoinStatus(11);
          }
        })
      // }else{
      //   setJoinStatus(3)
      // }
          }) 
        }
        tempData.push(item)
        
       })
       setPostData(tempData);
    }, [allevents, updateState, myRequests, selectedId, notificaitonSent])
    useEffect(() => {
      let tempData = []
      users && users.map((item)=>{
        // console.log('All User Data Direct == ',userList)
        // if(item.id!==myID){
          tempData.push(item)
        // }
      })
      setUserslist(tempData)
      // console.log('All User Data == ',tempData)
    }, [])
    
    const getUserId = async () => {
      const data = await firestore().collection('users')
      .doc(auth().currentUser?.uid).get();
      setMyData(data._data);
    }
    //later
    const getFcmToken = async () => {
      let oldfcmToken = '';
      let newfcmToken = '';
      oldfcmToken = await AsyncStorage.getItem('fcmToken');
      console.log(oldfcmToken, 'the old token');
      if (!oldfcmToken) {
        try {
          newfcmToken = await messaging().getToken();
  
          if (newfcmToken) {
            console.log(newfcmToken, 'new generated token');
            await AsyncStorage.setItem('fcmToken', newfcmToken);
          }
          setEventFcmToken(newfcmToken);
          firestore()
            .collection('users')
            .doc(auth().currentUser?.uid)
            .update({
              fcmToken: newfcmToken,
            })
            .then(res => {})
            .catch(error => {
              console.log(error);
            });
        } catch (error) {
          console.log(error, 'error raised in fcmToken');
        }
      } else {
        setEventFcmToken(oldfcmToken);
        firestore()
          .collection('users')
          .doc(auth().currentUser?.uid)
          .update({
            fcmToken: oldfcmToken,
          })
          .then(res => {})
          .catch(error => {
            console.log(error);
          });
      }
      // let myFcmTokenHere = ''
      //  myFcmTokenHere = await AsyncStorage.getItem('fcmToken');
    };
    //later
    const getFcmTokenFunction=async(props)=>{
      console.log('user list data for notification == '+userList)
      let fcmToken;
      userList.map(item=>{
        if (item.id === props.userId){
          fcmToken = item.fcmToken
          console.log('id of poster == ',item.id)
        }
      })
      setEventFcmToken(fcmToken);
      console.log('My FcmToken Here On Join Pressed == ',eventFcmToken)
        dispatch(EventJoinNotificationSend(props,eventFcmToken, myNameHere));
    }
    const sendNotificationEventJoined = async (eventFcmToken, props) => {
    
      // var axios = require('axios');
  
      const notificationData = myNameHere + " Just Requested to Join " + props.eventName;
      setEventNotificationSentContent(myNameHere + " Just Requested to Join " + props.eventName + " at " + new Date());
      var data = JSON.stringify({
        data: {},
        notification: {
          body: myNameHere + ' Just Requested to Join ' + props.eventName,
          title: 'Someone Requested To join Your Event',
          url: 'https://cdn.britannica.com/84/73184-050-05ED59CB/Sunflower-field-Fargo-North-Dakota.jpg',
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
  
    //   ///
    //   /// storing notification in firebase
    //   ///
    //   let tempNotificationCount;
    //   await firestore()
    //     .collection('notifications')
    //     .doc(props.userId)
    //     .get()
    //     .then(documentSnapshot => {
    //       console.log('User exists: ', documentSnapshot.exists);
  
    //       if (documentSnapshot.exists) {
    //         // console.log('User data for events: ', documentSnapshot.data());
    //         // console.log('User data for event notification counter :: ', documentSnapshot.data().notificationCounter);
    //         tempNotificationCount = documentSnapshot.data().notificationCounter;
    //         setEventNotificationCount(tempNotificationCount + 1)
    //         // setMyPhotos(documentSnapshot.data().photos)
  
    //       }
  
    //     });
  
  
  
    //   await firestore()
    //     .collection('notifications')
    //     .doc(props.userId)
    //     .update({
    //       notificationCounter: eventNotificationCount,
    //       messageContent: firestore.FieldValue.arrayUnion(eventNotificationSentContent.toString()),
    //       messageBody: '123',
    //       messageTitle: firestore.FieldValue.arrayUnion(eventNotificationSentContent.toString()),
    //       messageType: '123',
    //       receiverId: '123',
    //       receiverToken: eventFcmToken,
    //       senderId: myUserId,
    //       senderToken: myFcmToken,
    //       senderProfileImage: myProfileImage,
    //       senderUserName: myUserName,
    //       timeStamp: new Date(),
    //     }).then(res => {
    //     //   console.log("Event Joiner Data Has been Added :: " + myUserId);
    //     }
  
    //     ).catch(error => {
    //       console.log(error);
    //     })
  
    // };
    // const JoinRequestEventFTN=(selectedEventData)=>{
    //   console.warn('Event Data', myID,selectedEventData.postId,selectedEventData.userId);
    //   dispatch(getEventJoinRequestOperation(myID,selectedEventData.userId,selectedEventData.postId))
    //   setUpdateState(!updateState);
    }
    
  const sendJoinRequestFtn=(props)=>{
    let tempMembers = [];
    
    // if (tempMembers.length < membersNumbers) {
  
        if (tempMembers.length > 0) {
          tempMembers.map(item3 => {
  
            if (item3 !== myUserId) {
              firestore()
                .collection('events')
                .doc(props.postId)
                .update({
                  // eventMembersList: firestore.FieldValue.arrayUnion(myUserId),
                  eventJoinRequests: firestore.FieldValue.arrayUnion(myUserId),
                }).then(res => {
                  console.log("Another member requested to Join event :: " + UserId);
               //   statusJoinReq = true;
                  // return statusJoinReq;
                }
  
                ).catch(error => {
                  console.log(error);
                })
              console.log('UUUUUUUUUUUUUUion 2nd array for likes::' + UserId.toString());
              Alert.alert("Your Join Request Has Been Sent, Wait For Admin Permission");
            }
            else if (item3 === myUserId) {
              Alert.alert("Your Join Request Has Already Been Sent");
            }
  
          });
  
        } else {
          firestore()
            .collection('events')
            .doc(props.postId)
            .update({
              // eventMembersList: firestore.FieldValue.arrayUnion(myUserId),
              eventJoinRequests: firestore.FieldValue.arrayUnion(myUserId),
            }).then(res => {
              console.log("Another member Joined your event :: " + myUserId);
             // statusJoinReq = true;
                  // return statusJoinReq;
            }
  
            ).catch(error => {
              console.log(error);
            })
        }
    //   } else {
    //     Alert.alert("Memeber List Is Full Please Contact Admin");
    //   }
  }

    
    const JoinEventFtn = async (props) => {
      let tempMembers = [];
      let membersNumbers;
      let tempMyEventMembers = [];
  
      // if (tempFollowing.length >= 1) {
      myMembers = await firestore().collection('events').doc(props.postId)//EventPostId
        .get()
        .then(snapshot => {
          tempMembers = snapshot._data.eventJoinRequests;
          membersNumbers = snapshot._data.members;
  
        //   console.log("My Event Memebrs list :: " + tempMembers);
  
        })
        .catch(error => {
          console.log(error)
        });
      if (tempMembers.length < membersNumbers) {
  
        if (tempMembers.length > 0) {
          tempMembers.map(item3 => {
  
            if (item3 !== myID) {
              firestore()
                .collection('events')
                .doc(props.postId)
                .update({
                  // eventMembersList: firestore.FieldValue.arrayUnion(myUserId),
                  eventJoinRequests: firestore.FieldValue.arrayUnion(myID),
                }).then(res => {
                  console.log("Another member requested to Join event :: " + myID);
               //   statusJoinReq = true;
                  // return statusJoinReq;
                }
  
                ).catch(error => {
                  console.log(error);
                })
              console.log('UUUUUUUUUUUUUUion 2nd array for likes::' + myID.toString());
              Alert.alert("Request Sent, Wait For Admin Permission");
            }
            else if (item3 === myID) {
              Alert.alert("Your Join Request Has Already Been Sent");
            }
  
          });
  
        } else {
          firestore()
            .collection('events')
            .doc(props.postId)
            .update({
              // eventMembersList: firestore.FieldValue.arrayUnion(myUserId),
              eventJoinRequests: firestore.FieldValue.arrayUnion(myID),
            }).then(res => {
              console.log("Another member Joined your event :: " + myID);
              Alert.alert("Request Sent, Wait For Admin Permission");
             // statusJoinReq = true;
                  // return statusJoinReq;
            }
  
            ).catch(error => {
              console.log(error);
            })
        }
      } else {
        Alert.alert("Memeber List Is Full Please Contact Admin");
      }
      myMembers = await firestore().collection('events').doc(props.postId)
        .get()
        .then(snapshot => {
          tempMembers = snapshot._data.eventJoinRequests;
          tempMyEventMembers = snapshot._data.eventMembersList;
          console.log("My Event Memebrs list :: " + tempMembers);
          setMyTotalEventReq(tempMembers);
          setMyTotalEventMem(tempMyEventMembers);
  
          // setTotalEventMembers(item.tempMembers.length);
          console.log("My total Event Memebrs :: " + item.tempMembers.length);
        })
        .catch(error => {
          console.log(error)
        });
  
  
      console.log("Event owner Fcm Token ************************** " + eventFcmToken);
      sendNotificationEventJoined(eventFcmToken, props);
  
  
      // setEventInfoModal(false);
      // getJoinStatus(props);
      // getJoinStatusConfirm(props);
      setLikeButton(true);
      
    }
    const getJoinStatusConfirm = () => {
      let status = false;
      if(myTotalEventMembers.length > 0){
     myTotalEventMembers.map(itemMem=>{
            if (itemMem == myID) {
              status = true;
              setQrCodeValue('Joined')
            } else {
              status = false;
            }
      })
      }else{
         status = false;
      }
      
    
      // }
      
      return status;
    };
    const getJoinStatus = () => {
      let status = false;
    let tempMembers = []
    let tempMyEventMembers = []
       
        myTotalFollowers.map(item2=>{
          if(item2 == myID){
            status  = true;
            setQrCodeValue('Request Sent')
          }else{
            status = false;
            setQrCodeValue('not  Joined')
          }
        })
    console.log('current status value '+status)
    return status;
    };
 
    const userFilterDataEvents = () => {
        let tempData = [];
        let distanceValuesToPush
        let distanceArray = []

                    console.log('check location data for myself Latitude Location my data = ' + myData.myLocation.latitude);
                  //  props.allpostData
                   allevents.map(results => {
                        let distanceValue = getDistance(
                            { latitude: results.eventLocation.latitude, longitude: results.eventLocation.longitude },
                            { latitude: myData.myLocation.latitude, longitude: myData.myLocation.longitude }
                        );
                        distanceValuesToPush = distanceValue / 1000;

                        distanceArray.push(distanceValuesToPush)
                        console.log('Distance = '+distanceValue/1000+' Kms')

                        if (distanceValuesToPush >= minDistance && distanceValuesToPush <= maxDistance
                        ) {
                          
                          if (
                          results.interest == selectedInterest
                          )
                          {
                            tempData.push(results)
                            console.log('temp with data ' + tempData)
                          // tempData.push(results)
                          setPostData(tempData);
                          }
                        }
                    });

                    console.log('i am done with data ' + postData.length)
           
        setFilterModal(false);
    }
    const selectInterest = (item) => {
      setSelectedInterest(item.interestName)
      console.log("Selected Interest = " + selectedInterest);
      setSelectedView(item.index);
      console.log("Selected View = " + selectedView);
      setInterestModal(false);
    }
    const showInterestModal = () => {
      setInterestModal(true);
      setSelectedInterest('Hobbies and Activities')
      setSelected([]);
    }

    const JoinEventBtn = () => {
        console.log('Join event button click')
    }
    const userFilterData = () => {
    }
    const selectedEventModal = async(marker) => {
      let tempMembers=marker;
      // let tempMyEventMembers=[]
       setEventInfoModal(true)
       setSelectedId(marker.postId)
       setSelectedEvent(marker);
       getSelectEventMembers(marker);
       setUpdateState(!updateState);
      }
      const getSelectEventMembers =async (item)=>{
        let tempMembers = []
        let tempMyEventMembers = []
        console.log('my clicked event data ------------- '+item.postId)
    
        console.log('my clicked event data ______________ '+item.selectedEvent)
    
        console.log('my clicked event data *********______________------------- '+selectedEvent)
        await firestore().collection('events').doc(item.postId)
        .get()
        .then(snapshot => {
          tempMembers = snapshot._data.eventJoinRequests;
          tempMyEventMembers = snapshot._data.eventMembersList;
          console.log("My Event Memebrs Req list :: " + tempMembers);
          setMyTotalEventReq(tempMembers);
          setMyTotalEventMem(tempMyEventMembers);
    
          // setTotalEventMembers(tempMembers.length);
          console.log("My total Event Memebrs Req :: " + tempMembers.length);
        })
        .catch(error => {
          console.log(error)
        });
    
    
      }
    const SelectedEventInModal = (props) => {
     
      const dateEventPosted = new Date((props.selectedEvent.postTimeDate.seconds + props.selectedEvent.postTimeDate.nanoseconds / 1000000000) * 1000);

      const dt = new Date(dateEventPosted);
      const x = dt.toISOString().split("T");
  
      const x1 = x[0].split('-');
      const x2 = props.selectedEvent.eventDate.split('/')
    //   console.log('Event Date Time ===='+x1[0] + "/" + x1[1] + "/" + x1[2]);
      seteventPostDateTime(x1[0] + "/" + x1[1] + "/" + x1[2]);
  
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); 
      var yyyy = today.getFullYear();
  
      const currentDate = yyyy + '/' + mm + '/' + dd;
    //   console.log("both dates === Current Date: " + currentDate, "Event Date: "+x2[2] + "/" + x2[1] + "/" + x2[0])
      if(x2[0] >= yyyy.toString() && x2[1] >= mm){
      if (x2[1] > mm) {
        setEventStatus('Active')
      }
      if (x2[1] == mm) {
        if (x2[0] > dd) {
          setEventStatus('Active')
          // console.log('Active')
  
        } else {
          setEventStatus('Expired')
        }
        console.log('Active' + x2[1] + ' > ' + mm)
  
      } else if (x2[1] < mm) {
        setEventStatus('Expired')
      }
    }else{
      setEventStatus('Expired')
    }

                var myDistanceFromEvent = getDistance(
                  { latitude: props.selectedEvent.eventLocation.latitude, longitude: props.selectedEvent.eventLocation.longitude },
                  { latitude: myLat, longitude: myLong }
                );
            
                myDistanceFromEvent = myDistanceFromEvent / 10000;
            
                setMyDistance(myDistanceFromEvent);
          return (
            <View style={{
              flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%', width:'100%', 
            }}>
              {/* <ScrollView> */}
              <View style={{
                height: '100%', width: '100%', backgroundColor: '#1e1e1e', borderRadius: 20,
            //    borderWidth: 1, borderColor: 'orange'
              }}>
       <TouchableOpacity onPress={()=>[setEventInfoModal(false), setFullScreen(false)]}
              style={[
                { alignSelf:'flex-end', marginRight:20, marginTop:20},
              ]}>
              <Image
              source={require('../Images/close.png')}
              style={[
                { height: 40, width: 40, borderRadius: 20, tintColor:'red'},
              ]}
            />
              </TouchableOpacity>
                <View style={styles.mainContainer}>        
                 {
                    // this.state.ImageURI !== '' ? <Image source={this.state.ImageURI} /> :null
                    props.selectedEvent.profileImage === undefined || props.selectedEvent.profileImage === ""?
                      <Image
                        source={(require('../Images/user.png'))}
                        style={[styles.userImage, { width: 50, height: 50, borderRadius: 25 }]}
                      />
                      :
                      <Image
                        source={{ uri: props.selectedEvent.profileImage }}
                        style={[styles.userImage, { width: 50, height: 50, borderRadius: 25 }]}
                      />
      
                  }
                  <Text numberOfLines={1} style={[styles.userName, { color: '#fff', fontSize: 30 }]}>{props.selectedEvent.name}</Text>
      
                </View>
                <View>
                  <Text numberOfLines={2} ellipsizeMode='tail' style={{ color: '#fff', marginLeft: 25, marginVertical: 10 }}>
                    {props.selectedEvent.eventDescription}</Text>
                </View>
                <View>
                  <Text style={{ color: '#fff', marginLeft: 25, marginVertical: 10 }}>
                    {props.selectedEvent.caption}</Text>
                </View>
      
                <View >
                {
                props.selectedEvent.img  === undefined || props.selectedEvent.img  === ""?
                      <Image
                        source={(require('../Images/user.png'))}
                        style={[styles.postImage, { width: '100%', height: 200, }]}
                      />:
                  <Image source={{ uri: props.selectedEvent.img }}
                    style={[styles.postImage, { width: '100%', height: 200, }]}
                />
                }
                </View>
      
                <View style={[styles.detailBox, {
                  marginLeft: 20, borderWidth: 0,
                  marginVertical: 5, justifyContent: 'space-evenly', backgroundColor: 'black'
                }]}>
                  <TouchableOpacity onPress={() => { setEventInfoModal(false) }}>
                    <View
                      style={{
                        height: 35, borderRadius: 12, width: 120, borderWidth: 1,
                        borderColor: 'black', backgroundColor: 'blue'
                      }}
                    >
                      <Text style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>View Later</Text>
                    </View>
                  </TouchableOpacity>
                  
                  {
            props.selectedEvent.userId !== myID
             ?
            getJoinStatusConfirm()
            ?
              <TouchableOpacity style={{ flexDirection: 'row' }}
              onPress={() => Alert.alert('You Have Already Joined This Event')}
            >
              <View
                style={{
                  height: 35, borderRadius: 12, width: 120, borderWidth: 1,
                  borderColor: 'black',  backgroundColor: '#3373C4',
                }}
              >
                <Text
                  style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>
                  Joined
                </Text>
              </View>
            </TouchableOpacity>
              :
              <TouchableOpacity style={{ flexDirection: 'row' }}
                onPress={() => getJoinStatus() ? Alert.alert('Request Has Already Been Sent'): [JoinEventFtn(selectedEvent),getFcmTokenFunction(selectedEvent)
                ]}
              >
                <View
                  style={{
                    height: 35, borderRadius: 12, width: 120, borderWidth: 1,
                    borderColor: 'black', backgroundColor: getJoinStatus() ? '#FF337B' : '#46D300',
                  }}
                >
                  <Text
                    style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>
                    {
                     getJoinStatus()
                        ?
                        'Request Sent'
                        :
                        'Join'
                    }
                  </Text>
                </View>
              </TouchableOpacity>
              :
              null
              // <Text
              //   style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>
              //   My Event
              // </Text>
            }
          
                </View>
                <View style={{flexDirection:'row', padding:20,height:200, width:'100%', alignSelf:'center', backgroundColor:eventStatus == 'Active' ? 'green' : 'orange', justifyContent:'space-between', alignItems:'center'}}>
                  <Text style={{color:'white', fontSize:20,width:100}}>Scan QR Code To Know
                   Your Status</Text>
                  <QRCode 
                  value={
                    `${props.selectedEvent.eventName} posted by ${props.selectedEvent.name} with status ${qrCodeValue}`
}
                   size={150} 
                   color='black' 
                   backgroundColor='white' 
                   logo={require('../Images/logoFml.png')} 
                   logoSize={20} 
                   logoBorderRadius={10}
                   logoBackgroundColor='green'
                  />
                  </View>
      
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 140 }}>
                  <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
                    {
                      myDistance !== null ? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
                        Event Distance : {myDistance} km away
                      </Text> :
                        <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                          Event Distance : Not Mentioned
                        </Text>
                    }
                  </View>
                  <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
                    {
                      props.selectedEvent.eventName !== null ? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
                        Event Name : {props.selectedEvent.eventName}
                      </Text> :
                        <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                          Members Joined : Not Mentioned
                        </Text>
                    }
                  </View>
                  <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
              {
                props.selectedEvent.eventMembersList.length !== 0 || props.selectedEvent.eventMembersList.length !== undefined? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
                  Participants Joined : {props.selectedEvent.eventMembersList.length}
                </Text> :
                  <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                    Participants Joined : 0
                  </Text>
              }
            </View>
      
                  <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
      
                    <TouchableOpacity style={{ flexDirection: 'row' }}
                    // onPress={() => item.likes == UserId ? onPostDislike(item) : onPostLiked(item)}
                    >
                      {
                        props.selectedEvent.members !== null ? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
                          Total Members : {props.selectedEvent.members}
                        </Text> :
                          <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                            Total Members : Not Mentioned
                          </Text>
                      }
      
                    </TouchableOpacity>
      
                  </View>
                  <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
                    {
                      props.selectedEvent.eventDate !== null ? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
                        Event Date : {props.selectedEvent.eventDate}
                      </Text> :
                        <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                          Event Date : Not Mentioned
                        </Text>
                    }
                  </View>
                  <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
                    {
                      props.selectedEvent.eventTime !== null ? <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                        Event Time : {props.selectedEvent.eventTime}
                      </Text> :
                        <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                          Event Time : Not Mentioned
                        </Text>
                    }
                  </View>
                  <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
                    {
                      eventPostDateTime !== '' ? <Text style={{ marginLeft: 10, fontSize: 16, color: '#fff', fontWeight: '500' }}>
                        Event Posted Date : {eventPostDateTime}
                      </Text> :
                        <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                          Event Posted Date : Not Mentioned
                        </Text>
                    }
                  </View>
      
                  <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
                    {
                      eventStatus !== null ? <Text
                        style={{
                          marginLeft: 10, fontSize: 20, color: '#fff', fontWeight: '500', padding: 10,
                          borderWidth: 2, borderColor: 'black', backgroundColor: eventStatus == 'Active' ? 'green' : 'red'
                        }}>
                        Event Status : {eventStatus == 'Active' ? 'Active' : 'Expired'}
                      </Text> :
                        <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                          Event Status : Not Mentioned
                        </Text>
                    }
                  </View>
                  
                </View>
      
              </View>
              {/* </ScrollView> */}
            </View>
          )
    }
    return (
        <View style={{ height: '100%', width: '100%'}}>
         
            {/* <Button title='Filter Results' //onPress={handlePresentModal}// 
            onPress={() => setFilterModal(true)} 
            /> */}
            <View  
            style={{
            height: 60,
            width: '100%',
            // backgroundColor: '#f5f7fa',
            // borderWidth: 1,
            // borderColor: 'white',
          }}
          >
            <TouchableOpacity onPress={() => setFilterModal(true)} 
          style={{
            height: 50,
            width: 90,
            margin:5,
            backgroundColor: '#202A44',
            flexDirection: 'row',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'white',
          }}
          >
          <Image
                  source={require('../Images/filter.png')}
                  style={{height: 30, width: 30, tintColor: 'white'}}
                /><Text style={{color: 'white', fontSize: 18, fontWeight: '600'}}>
                Filter
              </Text>
          </TouchableOpacity>
            </View>
         
            <MapView
                style={{ width: '100%', height: '100%' }}
                initialRegion={{
                    latitude: 51.50746, // 33.51995346211034, 73.08200449215008// 51.50746, -0.1277,
                    longitude: -0.1277,
                    latitudeDelta: 0.0922,//2
                    longitudeDelta: 0.0421,//2
                }}
                onRegionChange={x => {
                    // console.log(x);
                }}>
                {
              postData.length > 0 ?
              postData && postData.map((marker, index) => {
                            return (

                                //  <Marker coordinate={marker.eventLocation}
                                <Marker coordinate={{ latitude: marker.eventLocation.latitude, longitude: marker.eventLocation.longitude }}
                                    title='Test Map marker'
                                    description='Test map marker with custom image'
                                    // icon={require('../Images/user.png')}
                                    key={index}
                                    onPress={() => selectedEventModal(marker) }

                                >
                                    <View style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }}>


                                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => selectedEventModal(marker) }
                                            //onPress={() => { console.log('button clicked'); setFilterModal(true) }}
                                            >


                                                <Image source={require('../Images/map-marker.png')}
                                                    style={{ height: 50, width: 50 }} />
                                                <View style={{ position: "absolute" }}>

                                                    {
                                                        marker.img === undefined || marker.img === ''
                                                        ?
                                                        null
                                                        :
                                                        <Image source={{ uri: marker.img }}
                                                        style={{ height: 30, width: 30, borderRadius: 15, marginLeft:10, marginTop:5 }} />
                                                        }
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                    </View>

                                    <Callout tooltip>
                                        {/* <MapCalloutSubview> */}
                                        <View>

                                            <View style={styles.bubble}>

                                                {/* <View style={{width: 60, height: 44,}} > */}
                                                <Text //style={{height:44, width: 44, borderWidth:1, borderColor:'red'}}
                                                >
                                                    
                                                    {
                                                        marker.img === undefined || marker.img === ""
                                                        ?
                                                        null
                                                        :
                                                        <Image source={{ uri: marker.img }} resizeMode='cover'
                                                        style={{
                                                            width: 30, height: 30,borderRadius:15
                                                        }}
                                                    />
                                                    }
                                                </Text>
                                                {/* </View> */}
                                                <View style={{
                                                    flex: 1, height: '100%', width: '80%',
                                                    flexDirection: 'column', marginLeft: 2,
                                                    borderWidth: 1, borderColor: 'white', 
                                                    flexWrap: 'wrap'
                                                }}>
                                                    <View style={{ height: '70%', width: '100%', margin: 3 }}>
                                                        <Text style={{ fontSize: 15, fontWeight: '600', color:'white' }}>{marker.eventName}</Text>
                                                


                                                        <View style={{ height: 30, width: 100 }}>

                                                        </View>
                                                    </View>

                                                </View>
                                            </View>
                                        </View>
                                    </Callout>
                                </Marker>
                            )
                        })
                        :
                        null

                }
            </MapView>
            <GestureRecognizer
             style={{ flex: 1 }}
             onSwipeUp={() => setFullScreen(true)}
             onSwipeRight={() => setFullScreen(true)}
            //  onSwipeUp={}

             onSwipeDown={() =>{setEventInfoModal(false), setFullScreen(false)}}
            >
             
              <Modal visible={eventInfoModal}
                onRequestClose={() => {setEventInfoModal(false), setFullScreen(false)}}
                transparent={true}
                // style={{ justifyContent: 'flex-end', alignSelf:'flex-end', backgroundColor:'black',
                // alignItems: 'flex-end', alignContent: 'flex-end', height: fullScreen ? '100%':'30%',width: '100%' }}

            >
              {/* <View style={{flex:1}}> */}
              <ScrollView showsVerticalScrollIndicator={false}>
                 <View 
                 style={{ flex: 1, alignSelf: 'flex-end', 
                justifyContent: 'flex-end', alignItems: 'flex-end', height: '30%', width: '100%' }}
                >
                    <View 
                    style={{ 
                        backgroundColor: '#1e1e1e', alignSelf: 'flex-end', height: fullScreen ? '100%':'30%',width: '100%', justifyContent: 'center', alignItems: 'center',
                        borderTopLeftRadius: 30, borderTopRightRadius: 30,// borderWidth: 1, borderColor: 'purple'
                    }}
                    >
                       {/* <View style={{ flex: 1 }}> */}
                        
                          <SelectedEventInModal selectedEvent={selectedEvent} />
                        
                      {/* </View> */}
                    </View>
                </View>
              </ScrollView>
                {/* </View> */}
            </Modal>
           
            </GestureRecognizer>
            <Modal
                visible={filterModal}
                transparent={true}
                onRequestClose={()=>setFilterModal(false)}
                style={{ flex: 1, width: '100%', height: '100%',
                 justifyContent: 'flex-end', alignItems: 'flex-end', alignContent: 'flex-end' }}
            >
                <View style={{ flex: 1, alignSelf: 'flex-end', 
                justifyContent: 'flex-end', alignItems: 'flex-end', height: '50%', width: '100%' }}>
                    <View style={{
                        backgroundColor: 'white', alignSelf: 'flex-end', height: '95%', width: '100%', justifyContent: 'center', alignItems: 'center',
                        borderTopLeftRadius: 30, borderTopRightRadius: 30, borderWidth: 4, borderColor: 'purple'
                    }}>
                        <View style={{ width: '90%', height: '90%', backgroundColor: 'white', marginBottom: 110, marginTop: 40 }}>
                        <TouchableOpacity style={{marginLeft:160, marginTop:10}} onPress={()=>setFilterModal(false)}>
           <Image source={require('../Images/close.png')}
                        style={{ width: 30, height: 30, alignSelf:'flex-end',tintColor: 'red', marginRight:20 }}
                      />
           </TouchableOpacity>
                            <Text style={{ fontSize: 20, color: '#707070', fontWeight: '700', margin: 10 }}>
                                Distance Range : {Math.floor(minDistance)} to {Math.floor(maxDistance)}
                            </Text>
                            <View style={{ flex: 1 }}>

                                <Text style={{ fontSize: 20, color: '#707070', fontWeight: '700', margin: 10 }}>
                                    Minimum Distance {Math.floor(minDistance)}
                                </Text>

                                <Slider
                                    style={{ width: 300, height: 50 }}
                                    minimumValue={1}
                                    maximumValue={300}
                                    minimumTrackTintColor='black' //"#FFFFFF"
                                    maximumTrackTintColor='blue'//"#000000"
                                    onValueChange={(value) => setMinDistance(value)}
                                />
                                <Text style={{ fontSize: 20, color: '#707070', fontWeight: '700', margin: 10 }}>
                                    Maximum Distance {Math.floor(maxDistance)}
                                </Text>

                                <Slider
                                    style={{ width: 300, height: 50 }}
                                    minimumValue={minDistance}
                                    maximumValue={300}
                                    minimumTrackTintColor='black' //"#FFFFFF"
                                    maximumTrackTintColor='blue' //"#000000"
                                    // inverted={true}
                                    onValueChange={(value) => setMaxDistance(value)}
                                />
                                <Text style={{ fontSize: 20, color: '#707070', fontWeight: '700', margin: 10 }}>
                                    {/* Maximum Distance {Math.floor(maxDistance)} kM */}
                                </Text>
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 50 }}>
                  <TouchableOpacity onPress={() => showInterestModal()}
                    style={[styles.userButton, { backgroundColor: 'blue', width: 250, justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: '400' }}>Filter Interest</Text>
                  </TouchableOpacity>
                </View>
                                
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 50 }}>
                                    <TouchableOpacity
                                        onPress={() => userFilterDataEvents()}
                                        style={[styles.userButton, { backgroundColor: 'blue', width: 300, justifyContent: 'center', alignItems: 'center' }]}>
                                        <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>Apply Filters</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>


                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
        animationType="slide"
        transparent={true}
        visible={interestModal}
        onRequestClose={() => {
          setInterestModal(false);
        }}>
        <View
          style={{
            height: '80%',
            width: '90%',
            padding: 10,
            borderRadius: 15,
            elevation: 100,
            shadowColor: 'indigo',
            shadowOffset: {
              width: 3,
              height: 3,
            },
            shadowRadius: 5,
            shadowOpacity: 1.0,
            backgroundColor: 'white',
            alignSelf: 'center',
            marginTop: 100,
            marginBottom: 50,
            flexWrap: 'wrap',
          }}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <View style={{margin: 5}}>
              {interests.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignContent: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        borderRadius: 40,
                        width: 300,
                        height: 50,
                        backgroundColor: '#E2DFD2',
                        marginVertical: 5,
                        justifyContent: 'flex-start',
                        marginLeft: 2,
                        flexDirection: 'row',
                      }}
                      onPress={() => selectInterest(item)}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {selectedView === index ? (
                          <View
                            style={{
                              backgroundColor: 'red',
                              marginTop: 6,
                              marginLeft: 15,
                              borderWidth: 1,
                              height: 25,
                              width: 25,
                              borderRadius: 15,
                              borderColor: 'blue',
                            }}
                          />
                        ) : (
                          <View
                            style={{
                              borderWidth: 1,
                              height: 25,
                              width: 25,
                              marginLeft: 15,
                              borderRadius: 15,
                              borderColor: 'blue',
                              marginTop: 6,
                            }}
                          />
                        )}
                      </View>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{fontSize: 18, color: 'blue', marginLeft: 10}}>
                          {item.interestName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Modal>
        </View>
    )
}
const styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height: '100%',
        width: '100%',
    },
    bubble: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        backgroundColor: 'black',
        borderRadius: 6,
       // borderColor: 'white',
        // borderWidth: 0.5,
        padding: 15,
        width: 190,
        height: 80,
        marginBottom: 10
    },
    name: {
        fontSize: 16,
        marginBottom: 5,
    },
    arrow: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#fff',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -32,
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: 'black',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -0.5,
    },
    image: {
        width: 50,
        height: 50,
    },
    marker: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        backgroundColor: "#007bff",
        borderColor: "#eee",
        borderRadius: 5,
        elevation: 10,
    },
    text: {
        color: "#fff",
    },
    userButton: {
        backgroundColor: '#4867A9',
        borderRadius: 10,
        height: 35,
        width: 110,
        marginLeft: 10
    },
    mainContainer: {
      flexDirection: 'row',
      margin: 10,
    },
    userImage: {
      width: 35,
      height: 35,
      margin: 5,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: 'white',
      // tintColor: 'white'
    },
    userName: {
      fontSize: 18,
      fontWeight: '600',
      margin: 3,
      color: 'white'
  
    },
    postImage: {
      width: '100%',
      height: '100%',
      // margin: 5,
      // alignSelf: 'center',
      // borderRadius: 30,
      borderWidth: 1,
      borderColor: 'black',
    },
    detailBox: {
      flexDirection: 'row',
      width: '90%',
      height: 70,
      // marginBottom: 10,
      // justifyContent: 'space-evenly',
      alignItems: "center",
      backgroundColor: 'white',
      borderWidth: 2,
      borderColor: 'black',
      marginVertical: 10,
      borderRadius: 10,
    },
});

export default MapEventsScreen


// {
//   props.selectedEvent.userId !== myID//myUserId
//    ?
//   // getJoinStatusConfirm()
//   // ?
//   //   <TouchableOpacity style={{ flexDirection: 'row' }}
//   //   onPress={() => Alert.alert('You Have Already Joined This Event')}
//   // >
//   //   <View
//   //     style={{
//   //       height: 35, borderRadius: 12, width: 120, borderWidth: 1,
//   //       borderColor: 'black',  backgroundColor: '#3373C4',
//   //     }}
//   //   >
//   //     <Text
//   //       style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>
//   //       Joined
//   //     </Text>
//   //   </View>
//   // </TouchableOpacity>
//   //   :
//   // props.selectedevent.eventMembersList < 
//   // houseFull 
//   // ?
//   //     <TouchableOpacity style={{ flexDirection: 'row' }}
//   //   onPress={() => Alert.alert('House Full Please Contact Admin')}
//   // >
//   //   <View
//   //     style={{
//   //       height: 35, borderRadius: 12, width: 120, borderWidth: 1,
//   //       borderColor: 'black',  backgroundColor:'red'//backgroundColor: '#3373C4',
//   //     }}
//   //   >
//   //     <Text
//   //       style={{ marginTop: 3, alignSelf: 'center', color: 'white', fontWeight:'700', fontSize:18 }}>
//   //       House Full
//   //     </Text>
//   //   </View>
//   // </TouchableOpacity>
//   // :
//   joinedConfirm 
//   ?
//     <TouchableOpacity style={{ flexDirection: 'row' }}
//     onPress={() => Alert.alert('You Have Already Joined This Event')}
//   >
//     <View
//       style={{
//         height: 35, borderRadius: 12, width: 120, borderWidth: 1,
//         borderColor: 'black',  backgroundColor: '#3373C4',
//       }}
//     >
//       <Text
//         style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>
//         Joined
//       </Text>
//     </View>
//   </TouchableOpacity>
//   :
//     <TouchableOpacity style={{ flexDirection: 'row' }}
//       onPress={() => checkJoinStatus === 1 ?  Alert.alert('Request Has Already Been Sent.') : 
//       checkJoinStatus === 0 ? [//JoinEventFtn(selectedEvent),]
//       getFcmTokenFunction(selectedEvent)]
//       // getFcmTokenFunction(selectedEvent)
//       :
//       checkJoinStatus === 2 ?  Alert.alert('You Have Already Joined This Event')
//       :
//       'House Full'
//     }
//     >
//       <View
//         style={{
//           height: 35, borderRadius: 12, width: 120, borderWidth: 1,
//           borderColor: 'black', backgroundColor: checkJoinStatus === 1 ? '#FF337B':
//           checkJoinStatus === 0 ?  '#46D300'
//           :checkJoinStatus === 2 ?  '#3373C4'
//           :
//           'red'
//           , //backgroundColor: getJoinStatus() ? '#FF337B' : '#46D300'
//         }}
//       >
//         <Text
//           style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>
//           {
//            //getJoinStatus()
//             checkJoinStatus === 1 
//               ?
//               'Request Sent'
//               : 
//               checkJoinStatus === 0 
//               ?
//               'Join'
//               :
//               checkJoinStatus === 2 
//               ?
//               'Joined' 
//               :
//               'House Full'
//           }
//         </Text>
//       </View>
//     </TouchableOpacity>
//     :
//     null
//   }