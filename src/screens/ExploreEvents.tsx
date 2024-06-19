// import { View, Text, StyleSheet, Image, FlatList, Alert, TouchableOpacity, Button, Modal, ScrollView } from 'react-native'
// import React, { useRef, useEffect, useState } from 'react'
// import MapView, { Callout, CalloutSubview, MapCalloutSubview, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getDistance, getPreciseDistance } from 'geolib';
// import { AnimatedView } from 'react-native-reanimated/lib/typescript/reanimated2/component/View';
// import CustomMarker from './CustomMarker';
// import Slider from '@react-native-community/slider';
// import { el } from 'date-fns/locale';
// import GestureRecognizer from 'react-native-swipe-gestures';
// import TabNavigationCustom from '../navigations/TabNavigationCustom';
// import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
// import 'react-native-gesture-handler';
// import { BottomSheetModal, BottomSheetModalProvider, BottomSheetTextInput } from '@gorhom/bottom-sheet';
// import {useDispatch, useSelector} from "react-redux";
// import { getAllEventsInitiate, getEventJoinRequestOperation } from '../Redux/actionsEvents';
// import axios from 'axios';
// import { getMyUserDataAction } from '../Redux/actionsUser';
// import { configureStore } from '@reduxjs/toolkit';
// // import {userFilterData} from './EventsScreen';
// const ExploreEvents = (props) => {
//   const snapPoints =['30%', '60%', '90%']
//     let childRef = useRef(null)
//     const [refVisible, setRefVisible] = useState(false)

//     const [postData, setPostData] = useState([]);
//     const [Loading, setLoading] = useState(false);
//     const [getLatitude, setGetLatitude] = useState('');
//     const [getLongitutde, setGetLongitude] = useState('');

//     const [getPostion, setGetPosition] = useState();
//     const [allEventData, setAllEventData] = useState(null);

//     const [myUserId, setMyUserId] = useState('');
//     const [myName, setMyUserName] = useState('');
//     const [myProfileImage, setMyProfileImage] = useState('');
//     const [myFcmToken, setMyFcmToken] = useState('');
//     const [myData, setMyData] = useState([]);
//     const [myDistance, setMyDistance] = useState([]);
//     const [minDistance, setMinDistance] = useState(1);
//     const [maxDistance, setMaxDistance] = useState(1000);
//     const [filterGender, setFilterGender] = useState('')
//     const [filterGenderAll, setFilterGenderAll] = useState('Both')
//     const [filterModal, setFilterModal] = useState(false);

//     const [eventInfoModal, setEventInfoModal] = useState(false)

//     const [selectedEvent, setSelectedEvent] = useState([]);
//     const [fullScreen, setFullScreen] = useState(false);
//     const[myTotalEventReq, setMyTotalEventReq] = useState([]);
//     const[myTotalEventMembers, setMyTotalEventMem] = useState([]);
//     const [likeButton, setLikeButton] = useState(false);
//     const [eventFcmToken, setEventFcmToken] = useState('');
//     const [eventNotificationSentContent, setEventNotificationSentContent] = useState('');
//     const [eventNotificationCount, setEventNotificationCount] = useState(0);
//     const [eventPostDateTime, seteventPostDateTime] = useState('');
//     const [eventStatus, setEventStatus] = useState('');
//     const [interestModal, setInterestModal] = useState(false);
//     const [selectedInterest, setSelectedInterest] = useState('Hobbies and Activities');
//     const [selected, setSelected] = useState([])
//     const [selectedView, setSelectedView] = useState();



//     let UserId = '';
//     let myUserName = '';
//     let ProfileImage = '';
//     let myEmail = '';
//     let FcmToken = '';
//     let myMembers;
//     let MLat = 0
//     let MLong = 0
//     let myLat = '';
//   let myLong = '';
//     let dataMapPostion = []
//     let eventsAllData = []
//     let arrayLat = []
//     let arrayLong = []

//     const interests = [
//       {
//         interestName: 'Hobbies and Activities',
//         index: 0,
//       },
//       {interestName: 'Professional Interests', index: 1},
//       {interestName: 'Health and Lifestyle', index: 2},
//       {interestName: 'Food and Dining', index: 3},
//       {interestName: 'Technology and Gaming', index: 4},
//       {interestName: 'Social Causes', index: 5},
//       {interestName: 'Travel', index: 6},
//       {interestName: 'Arts and Culture', index: 7},
//       {interestName: 'Learning and Education', index: 8},
//       {interestName: 'Regional and Cultural Interests', index: 9},
//       {interestName: 'Entertainment', index: 10},
//       {interestName: 'Dating And Party', index: 11},
//     ];
//   //  let statusJoinReq = false;
//     // 51.51477, -0.07231
//     // 51.52138, -0.12845
//     // 51.52085, -0.13215
//     // 51.50152, -0.14184
//     const MapCoordinates = [
//         { latitude: 51.51477, longitude: -0.07231 },
//         { latitude: 51.52138, longitude: -0.12845 },
//         { latitude: 51.50152, longitude: -0.14184 },

//     ]
//     const dispatch = useDispatch();
//     useEffect(() => {
//       dispatch(getMyUserDataAction());
//       GetUserData();
//         // detected rendering
//         getUserId();
       
//         dispatch(getAllEventsInitiate());
//         // getEventData();
// // console.log('fuck it idsajfldj '+props.allUserData);
// // console.log('fuck it my daata = '+ UserId);
        
//         // calculatePreciseDistance();
//     }, [!likeButton])
//     const {mydata} = useSelector(state => state.myUserData);
  
//     let myID = "";
  
//     mydata && 
//     mydata.map(item=>{
//      myID = item.id;
//     })
//     const {allevents} = useSelector(state => state.eventData);
//     const [checkJoinStatus, setJoinStatus] = useState(false);
//     useEffect(() => {
//       allevents && allevents.map((item)=>{
        
//         // item.map(item2=>{
//         //   console.log('all Request &&&&&&&************+====', item2.eventjoinRequests)
//         // })
       
//           if(item.eventName === 'Cycling Event'){
//             if(item.eventJoinRequests === myID){
//               setJoinStatus(true)
//               console.log('join status req Id***********&&&&&&&&&&&&&', item.eventName)
//               console.log('join status req Id***********&&&&&&&&&&&&&', item.eventJoinRequests)
//             }else{
//               console.log('join status req Id not found ***********&&&&&&&&&&&&&', item.eventName)
//               console.log('join status req Id not found ***********&&&&&&&&&&&&&', item.eventJoinRequests)
//               setJoinStatus(false)
//             }
         
          

//         // console.log('join status my Id ***********&&&&&&&&&&&&&', myID)
//         }
//         // else{
//         //   setJoinStatus(false)
//         // }
      
//        })
//     }, [allevents])
    
//     // const bottomSheetModalRef = useRef(null);
//     // function handlePresentModal(){
//     //   bottomSheetModalRef.current?.present();
//     // }
//     const GetUserData = async () => {
//       const name ='' ;
//       const email = '';
//       const id = '';
//       const profileImage ='' ;
//       const myLatitude  ='';
//       const myLongitude = '' ;
//       const data = await firestore().collection('users').doc(auth().currentUser?.uid).get();
//       // const {mydata} = useSelector(state => state.myUserData);
//       // console.log('user function in tab navigation '+props.updateMessage)
  
//       // const name = data._data.name;
//   //     mydata && 
//   // mydata.map(item=>{
//   //     name = item.name;
//   //     email = item.email;
//   //     id = item.id;
//   //     profileImage = item.profileImage;
//   //     myLatitude = item.myLocation.latitude;
//   //     myLongitude = item.myLocation.longitude;
//   // })
//       name = data._data.name;
//       email = data._data.email;
//       id = data._data.id;
//       profileImage = data._data.profileImage;
//       myLatitude = data._data.myLocation.latitude;
//       myLongitude = data._data.myLocation.longitude;
  
//         goToNext(name, email, id, profileImage, myLatitude, myLongitude);
     
//     }
//     const goToNext = async (name, email, id, profileImage, myLatitude, myLongitude) => {
//       name = await AsyncStorage.setItem('NAME', name);
//       email = await AsyncStorage.setItem('EMAIL', email);
//       id = await AsyncStorage.setItem('USERID', id);
//       profileImage = await AsyncStorage.setItem('profileImage', profileImage);
//       myLatitude = await AsyncStorage.setItem('MyLat', myLatitude);
//       myLongitude = await AsyncStorage.setItem('MyLong', myLongitude);
//       let checkUserName = await AsyncStorage.getItem('NAME');
//       // setMyUserName(checkUserName);
//       let checkProfileImage = await AsyncStorage.getItem('profileImage');
//       // setMyProfileImage(checkProfileImage);
//       console.warn("My User Id Stored And Set Asynchronysly:" + id);
//       console.warn("My Profile Image Link Stored And Set Asynchronysly:" + myProfileImage);
//       console.warn("My Name Stored And Set Asynchronysly:" + myUserName);
  
//     };
//     const getUserId = async () => {
//       const data = await firestore().collection('users')
//       .doc(auth().currentUser?.uid).get();
//       // const {mydata} = useSelector(state => state.myUserData);
//       // setMyUserId(mydata.id);
//       //   setMyUserName(mydata.name);
//       //   setMyFcmToken(mydata.fcmToken);
//       //   setMyProfileImage(mydata.profileImage);
//       // setMyData(mydata);
//   // setMyData(data._data);
//   // mydata && 
//   // mydata.map(item=>{
//   //       setMyUserId(item.id);
//   //       setMyUserName(item.name);
//   //       setMyFcmToken(item.fcmToken);
//   //       setMyProfileImage(items.profileImage);
//   // })
//   console.log('show all my data '+myData);


//         UserId = await AsyncStorage.getItem("USERID");
//         myUserName = await AsyncStorage.getItem("NAME");
//         ProfileImage = await AsyncStorage.getItem('profileImage');
//         myEmail = await AsyncStorage.getItem('EMAIL');
//         myLat = await AsyncStorage.getItem('MyLat');
//         myLong = await AsyncStorage.getItem('MyLong');

//         FcmToken = await AsyncStorage.getItem('MYFCMTOKEN');
//         setMyUserId(UserId);
//         setMyUserName(myUserName);
//         setMyFcmToken(FcmToken);
//         setMyProfileImage(ProfileImage);
        
//         // UserId = UserId.toString();
//         // return UserId
//         console.log("my user id stored and name from redux on explore:: ", myUserId, myUserName);
//         // console.log("my userName stored in event screen:: " + myUserName);
//         // console.log("my profile stored in event screen:: " + ProfileImage);
//         // console.log("my Email stored in event screen:: " + myEmail);
//         // console.log("my user fcm stored in event screen:: " + senderFcmToken);
       
      
        
//     }
//     const getEventData = () => {
//         setLoading(true);
//         let tempData = [];
//         var myDistanceFromEvent = [];
//         let finalDistanceFromLoc = [];
//         // firestore()
//         //     .collection('events')
//         //     .get()
//         //     .then(querySnapshot => {
//         //         // console.log('Total posts: ', querySnapshot.size);

//         //         querySnapshot.forEach(documentSnapshot => {
//         //             tempData.push(documentSnapshot.data());
//         //             console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
//         //             console.log('all user id ' + documentSnapshot.data().userId);
//         //             console.log('show my data = ' + documentSnapshot.data().eventLocation.latitude)
//         //             setLoading(false);
//         //         });
//         //         if (props.Filter == '') {
//         //             // setPostData(tempData)
//         const {allevents} = useSelector(state => state.eventData);
//         setPostData(allevents);
//                     // setPostData(props.allpostData);
//                     // console.log('exact data ' + props.Filter);
//             //     } else {
//             //         console.log('filter data ' + props.Filter);
//             //         setPostData(tempData);
//             //     }
//             // });
//     }
//     const getFcmTokenFunction=async(props)=>{
//       let eventOwnerToken;
//       let eventTokenData = [];
//       eventTokenData = await firestore().collection('users').doc(props.userId)
//           .get()
//           .then(snapshot => {
//             eventOwnerToken = snapshot._data.fcmToken;
//             console.log("Event owner Fcm Token **************************:: " + eventOwnerToken);
    
//             setEventFcmToken(eventOwnerToken);
//             console.log("Event TOken From USer DBBB ****))()(*)(*) " + eventFcmToken);
//           })
//           .catch(error => {
//             console.log(error)
//           });
    
    
//         console.log("User ID OF Event Poster ************************** " + props.userId);
//         console.log("event name ********************** = "+props.eventName)
        
//         sendNotificationEventJoined(eventFcmToken, props);
//     }
    
//     const sendNotificationEventJoined = async (eventFcmToken, props) => {
    
//       // var axios = require('axios');
  
//       const notificationData = myName + " Just Requested to Join " + props.eventName;
//       setEventNotificationSentContent(myName + " Just Requested to Join " + props.eventName + " at " + new Date());
//       var data = JSON.stringify({
//         data: {},
//         notification: {
//           body: myName + ' Just Requested to Join ' + props.eventName,
//           title: 'Someone Requested To join Your Event',
//         },
//         to: eventFcmToken,
//       });
//       console.log('Notification send Data ::: ' + JSON.stringify(data));
//       var config = {
//         method: 'post',
//         url: 'https://fcm.googleapis.com/fcm/send',
//         headers: {
//           Authorization:
//             'key=AAAAZflHU5c:APA91bGirnbXx_FqDR8OoT4-MZPBSYJxn794pqiwZDhi7dUkYAfsxPUd3bQMY0z5Q7KG52PvmYguWRAEGGe94cZvzu32vjMst8g7cuL3triz2mMf9d0oT2U3QhuSeH5bobmuSVBKYdne',
//           'Content-Type': 'application/json',
//         },
//         data: data,
//       };
//       axios(config)
//         .then(function (response) {
//           console.log('Notification send OutPut ::: ' + JSON.stringify(response.data));
  
  
//         })
//         .catch(function (error) {
//           console.log(error)
//         });
  
//       ///
//       /// storing notification in firebase
//       ///
//       let tempNotificationCount;
//       await firestore()
//         .collection('notifications')
//         .doc(props.userId)
//         .get()
//         .then(documentSnapshot => {
//           console.log('User exists: ', documentSnapshot.exists);
  
//           if (documentSnapshot.exists) {
//             console.log('User data for events: ', documentSnapshot.data());
//             console.log('User data for event notification counter :: ', documentSnapshot.data().notificationCounter);
//             tempNotificationCount = documentSnapshot.data().notificationCounter;
//             setEventNotificationCount(tempNotificationCount + 1)
//             // setMyPhotos(documentSnapshot.data().photos)
  
//           }
  
//         });
  
  
  
//       await firestore()
//         .collection('notifications')
//         .doc(props.userId)
//         .update({
//           notificationCounter: eventNotificationCount,
//           messageContent: firestore.FieldValue.arrayUnion(eventNotificationSentContent.toString()),
//           messageBody: '123',
//           messageTitle: firestore.FieldValue.arrayUnion(eventNotificationSentContent.toString()),
//           messageType: '123',
//           receiverId: '123',
//           receiverToken: eventFcmToken,
//           senderId: myUserId,
//           senderToken: myFcmToken,
//           senderProfileImage: myProfileImage,
//           senderUserName: myUserName,
//           timeStamp: new Date(),
//         }).then(res => {
//           console.log("Event Joiner Data Has been Added :: " + myUserId);
//         }
  
//         ).catch(error => {
//           console.log(error);
//         })
  
//     };
//     const JoinRequestEventFTN=(selectedEventData)=>{
//       console.warn('Event Data', myID,selectedEventData.postId,selectedEventData.userId);
//       dispatch(getEventJoinRequestOperation(myID,selectedEventData.userId,selectedEventData.postId))
//     }
    
  
    
//     const JoinEventFtn = async (props) => {
//       let tempMembers = [];
//       let membersNumbers;
//       let tempMyEventMembers = [];
  
//       // if (tempFollowing.length >= 1) {
//       myMembers = await firestore().collection('events').doc(props.postId)//EventPostId
//         .get()
//         .then(snapshot => {
//           tempMembers = snapshot._data.eventJoinRequests;
//           membersNumbers = snapshot._data.members;
  
//           console.log("My Event Memebrs list :: " + tempMembers);
  
//         })
//         .catch(error => {
//           console.log(error)
//         });
//       if (tempMembers.length < membersNumbers) {
  
  
//         if (tempMembers.length > 0) {
//           tempMembers.map(item3 => {
  
//             if (item3 !== myUserId) {
//               firestore()
//                 .collection('events')
//                 .doc(props.postId)
//                 .update({
//                   // eventMembersList: firestore.FieldValue.arrayUnion(myUserId),
//                   eventJoinRequests: firestore.FieldValue.arrayUnion(myUserId),
//                 }).then(res => {
//                   console.log("Another member requested to Join event :: " + UserId);
//                //   statusJoinReq = true;
//                   // return statusJoinReq;
//                 }
  
//                 ).catch(error => {
//                   console.log(error);
//                 })
//               console.log('UUUUUUUUUUUUUUion 2nd array for likes::' + UserId.toString());
//               Alert.alert("Your Join Request Has Been Sent, Wait For Admin Permission");
//             }
//             else if (item3 === myUserId) {
//               Alert.alert("Your Join Request Has Already Been Sent");
//             }
  
//           });
  
//         } else {
//           firestore()
//             .collection('events')
//             .doc(props.postId)
//             .update({
//               // eventMembersList: firestore.FieldValue.arrayUnion(myUserId),
//               eventJoinRequests: firestore.FieldValue.arrayUnion(myUserId),
//             }).then(res => {
//               console.log("Another member Joined your event :: " + myUserId);
//              // statusJoinReq = true;
//                   // return statusJoinReq;
//             }
  
//             ).catch(error => {
//               console.log(error);
//             })
//         }
//       } else {
//         Alert.alert("Memeber List Is Full Please Contact Admin");
//       }
//       myMembers = await firestore().collection('events').doc(props.postId)
//         .get()
//         .then(snapshot => {
//           tempMembers = snapshot._data.eventJoinRequests;
//           tempMyEventMembers = snapshot._data.eventMembersList;
//           console.log("My Event Memebrs list :: " + tempMembers);
//           setMyTotalEventReq(tempMembers);
//           setMyTotalEventMem(tempMyEventMembers);
  
//           // setTotalEventMembers(item.tempMembers.length);
//           console.log("My total Event Memebrs :: " + item.tempMembers.length);
//         })
//         .catch(error => {
//           console.log(error)
//         });
  
  
//       console.log("Event owner Fcm Token ************************** " + eventFcmToken);
//       // sendNotificationEventJoined(eventFcmToken);
  
  
//       setEventInfoModal(false);
//       // getJoinStatus(props);
//       // getJoinStatusConfirm(props);
//       setLikeButton(true);
      
//     }
//     const getJoinStatus = () => {
//       let status = false;
       
//         myTotalEventReq.map(item2=>{
//           if(item2 == myUserId){
//             status  = true;
//           }else{
//             status = false;
//           }
//         })
//     console.log('current status value '+status)
//     return status;
//     };
//     const getJoinStatusConfirm = () => {
//       let status = false;
//       if(myTotalEventMembers.length > 0){
//      myTotalEventMembers.map(itemMem=>{
//             if (itemMem == myUserId) {
//               status = true;
//             } else {
//               status = false;
      
//             }
//       })
//       }else{
//          status = false;
//       }
      
    
//       // }
      
//       return status;
//     };
//     const userFilterDataEvents = () => {
//         let tempData = [];
//         let distanceValuesToPush
//         let distanceArray = []

//         // firestore().
//         //     collection("events")
//         //     // .where('id', '!=', 'userId')
//         //     .get()

//         //     .then(
//         //         querySnapshot => {
//                     // querySnapshot._docs.
//                     console.log('check location data for myself Latitude Location my data = ' + myData.myLocation.latitude);
//                    props.allpostData.map(results => {
//                         // //  console.log('all event data if available  '+results._data.eventLocation.latitude, results._data.eventName)
//                         let distanceValue = getDistance(
//                             { latitude: results.eventLocation.latitude, longitude: results.eventLocation.longitude },
//                             { latitude: myData.myLocation.latitude, longitude: myData.myLocation.longitude }
//                         );
//                         distanceValuesToPush = distanceValue / 1000;

//                         distanceArray.push(distanceValuesToPush)
//                         console.log('Distance = '+distanceValue/1000+' Kms')
//                         // if (item._data.id !== userId) {

//                         // distanceArray.map((finalData, index)=>{
//                         // console.log('all distance values ' + distanceValuesToPush);

//                         if (distanceValuesToPush >= minDistance && distanceValuesToPush <= maxDistance
//                         ) {
                          
//                           if (//results.gender == filterGender  && 
//                           results.interest == selectedInterest
//                           // selectedInterest
//                           ){
//                           tempData.push(results)
//                           setPostData(tempData);
//                           }
                          

//                         }
//                         // else {
//                         //     setPostData(tempData)
//                         //     // setPostData(0);
//                         // }

//                     });

//                     console.log('i am done with data ' + tempData.length)
//             //     }
//             // );
//         setFilterModal(false);
//         // setRefVisible(true);
//     }
//     const selectInterest = (item) => {
//       setSelectedInterest(item.interestName)
//       console.log("Selected Interest = " + selectedInterest);
//       setSelectedView(item.index);
//       console.log("Selected View = " + selectedView);
//       setInterestModal(false);
//     }
//     const showInterestModal = () => {
//       setInterestModal(true);
//       setSelectedInterest('Hobbies and Activities')
//       setSelected([]);
//     }
//     const calculatePreciseDistance = () => {
//         // 33.55465562429129, 73.09811239200536   foundation
//         // 33.57648806993554, 73.0724787079291 golf club
//         // 33.60131911238899, 73.03083389464575 qasim market
//         var pdis = getPreciseDistance(
//             { latitude: 33.55465562429129, longitude: 73.09811239200536 },
//             { latitude: 33.60131911238899, longitude: 73.03083389464575 }
//         );
//         console.log('Distance = ' + pdis / 1000 + ' Km')
//         Alert.alert(`Precise Distance\n\n${pdis} Meter\nOR\n${pdis / 1000} KM`);
//     };
//     const mapCustomMarker = () => {
//         return (
//             <View style={styles.marker}>
//                 <Text style={styles.color}>Tokyo</Text>
//             </View>
//         );
//     }
//     const JoinEventBtn = () => {
//         console.log('Join event button click')
//     }
//     const userFilterData = () => {
//     }
//     const selectedEventModal = async(marker) => {
//       let tempMembers=marker;
//       // let tempMyEventMembers=[]
//        setEventInfoModal(true)
//       //  SelectedEventInModal(marker)
//        setSelectedEvent(marker);
//        getSelectEventMembers(marker);
//       }
//       const getSelectEventMembers =async (item)=>{
//         let tempMembers = []
//         let tempMyEventMembers = []
//         console.log('my clicked event data ------------- '+item.postId)
    
//         console.log('my clicked event data ______________ '+item.selectedEvent)
    
//         console.log('my clicked event data *********______________------------- '+selectedEvent)
//         await firestore().collection('events').doc(item.postId)
//         .get()
//         .then(snapshot => {
//           tempMembers = snapshot._data.eventJoinRequests;
//           tempMyEventMembers = snapshot._data.eventMembersList;
//           console.log("My Event Memebrs Req list :: " + tempMembers);
//           setMyTotalEventReq(tempMembers);
//           setMyTotalEventMem(tempMyEventMembers);
    
//           // setTotalEventMembers(tempMembers.length);
//           console.log("My total Event Memebrs Req :: " + tempMembers.length);
//         })
//         .catch(error => {
//           console.log(error)
//         });
    
    
//       }
//     const SelectedEventInModal = (props) => {
//       // console.log('Post Id '+ props.selectedEvent.postId);
//       // let tempMembers = []
//       // let tempMyEventMembers = [];
//     // const myMembers = 
//     // await firestore().collection('events').doc(props.postId)
//     //     .get()
//     //     .then(snapshot => {
//     //       // tempMembers = snapshot._data.eventJoinRequests;
//     //       // tempMyEventMembers = snapshot._data.eventMembersList;
//     //       console.log("My Event Memebrs list :: " + snapshot._data.eventJoinRequests);
//     //       // setMyTotalEventReq(tempMembers);
//     //       // setMyTotalEventMem(tempMyEventMembers);
  
//     //       // setTotalEventMembers(item.tempMembers.length);
//     //       // console.log("My total Event Memebrs :: " + item.tempMembers.length);
//     //     })
//     //     .catch(error => {
//     //       console.log(error)
//     //     });
//       //  setMyTotalEventReq(props.selectedEvent.eventJoinRequests);
//       //  setMyTotalEventMem(props.selectedEvent.eventMembersList);
//       //  getJoinStatus(props);
//       //  getJoinStatusConfirm(props);

       
//       const dateEventPosted = new Date((props.selectedEvent.postTimeDate.seconds + props.selectedEvent.postTimeDate.nanoseconds / 1000000000) * 1000);

//       // // // let dateEevenPosted
//       const dt = new Date(dateEventPosted);
//       const x = dt.toISOString().split("T");
//       // console.log('splitted time ' + x[0]);
//       // console.log('splitted time 2' + );
  
//       const x1 = x[0].split('-');
//       // console.log('event date'+eventDate);
//       const x2 = props.selectedEvent.eventDate.split('/')
//       // console.log(x1[2] + "/" + x1[1] + "/" + x1[0]);
//       // console.log(x2[2] + "/" + x2[1] + "/" + x2[0]);
//       console.log('Event Date Time ===='+x1[0] + "/" + x1[1] + "/" + x1[2]);
//       seteventPostDateTime(x1[0] + "/" + x1[1] + "/" + x1[2]);
  
//       var today = new Date();
//       var dd = String(today.getDate()).padStart(2, '0');
//       var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
//       var yyyy = today.getFullYear();
  
//       const currentDate = yyyy + '/' + mm + '/' + dd;
//       console.log("both dates === Current Date: " + currentDate, "Event Date: "+x2[2] + "/" + x2[1] + "/" + x2[0])
//       if(x2[0] >= yyyy.toString() && x2[1] >= mm){
//       if (x2[1] > mm) {
//         // console.log('date gone')
//         setEventStatus('Active')
//       }
//       if (x2[1] == mm) {
//         if (x2[0] > dd) {
//           // console.log('date gone')
//           setEventStatus('Active')
//           // console.log('Active')
  
//         } else {
//           setEventStatus('Expired')
//           // console.log('Expired' + x2[0] + ' < ' + dd)
//         }
//         console.log('Active' + x2[1] + ' > ' + mm)
  
//       } else if (x2[1] < mm) {
//         setEventStatus('Expired')
//         // console.log('Expired' + x2[1] + ' < ' + mm)
//       }
//     }else{
//       setEventStatus('Expired')
//     }

//                 var myDistanceFromEvent = getDistance(
//                   { latitude: props.selectedEvent.eventLocation.latitude, longitude: props.selectedEvent.eventLocation.longitude },
//                   { latitude: myLat, longitude: myLong }
//                   // { latitude: myData.myLocation.latitude, longitude: myData.myLocation.longitude }
//                 );
            
//                 myDistanceFromEvent = myDistanceFromEvent / 10000;
            
//                 setMyDistance(myDistanceFromEvent);
//       // console.log('Name '+ props.selectedEvent.name);
//       // console.log('Name '+ props.selectedEvent.postId);
//           return (
//             <View style={{
//               flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%', width:'100%', 
//             }}>
//               {/* <ScrollView> */}
//               <View style={{
//                 height: '100%', width: '100%', backgroundColor: '#1e1e1e', borderRadius: 20,
//             //    borderWidth: 1, borderColor: 'orange'
//               }}>
//        <TouchableOpacity onPress={()=>[setEventInfoModal(false), setFullScreen(false)]}
//               style={[
//                 { alignSelf:'flex-end', marginRight:20, marginTop:20},
//               ]}>
//               <Image
//               source={require('../Images/close.png')}
//               style={[
//                 { height: 40, width: 40, borderRadius: 20, tintColor:'red'},
//               ]}
//             />
//               </TouchableOpacity>
//                 <View style={styles.mainContainer}>        
//                  {
//                     // this.state.ImageURI !== '' ? <Image source={this.state.ImageURI} /> :null
//                     props.selectedEvent.profileImage === '' ?
//                       <Image
//                         source={(require('../Images/user.png'))}
//                         style={[styles.userImage, { width: 50, height: 50, borderRadius: 25 }]}
//                       />
//                       :
//                       <Image
//                         source={{ uri: props.selectedEvent.profileImage }}
//                         style={[styles.userImage, { width: 50, height: 50, borderRadius: 25 }]}
//                       />
      
//                   }
//                   <Text numberOfLines={1} style={[styles.userName, { color: '#fff', fontSize: 30 }]}>{props.selectedEvent.name}</Text>
      
//                 </View>
//                 <View>
//                   <Text numberOfLines={2} ellipsizeMode='tail' style={{ color: '#fff', marginLeft: 25, marginVertical: 10 }}>
//                     {props.selectedEvent.eventDescription}</Text>
//                 </View>
//                 <View>
//                   <Text style={{ color: '#fff', marginLeft: 25, marginVertical: 10 }}>
//                     {props.selectedEvent.caption}</Text>
//                 </View>
      
//                 <View >
//                   <Image source={{ uri: props.selectedEvent.img }}
//                     style={[styles.postImage, { width: '100%', height: 200, }]}
//                 />
//                 </View>
      
//                 <View style={[styles.detailBox, {
//                   marginLeft: 20, borderWidth: 0,
//                   marginVertical: 5, justifyContent: 'space-evenly', backgroundColor: 'black'
//                 }]}>
//                   <TouchableOpacity onPress={() => { setEventInfoModal(false) }}>
//                     <View
//                       style={{
//                         height: 35, borderRadius: 12, width: 120, borderWidth: 1,
//                         borderColor: 'black', backgroundColor: 'blue'
//                       }}
//                     >
//                       <Text style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>View Later</Text>
//                     </View>
//                   </TouchableOpacity>
//                   {
//             props.selectedEvent.userId !== myID//myUserId
//              ?
//             getJoinStatusConfirm()
//             ?
//               <TouchableOpacity style={{ flexDirection: 'row' }}
//               onPress={() => Alert.alert('You Have Already Joined This Event')}
//             >
//               <View
//                 style={{
//                   height: 35, borderRadius: 12, width: 120, borderWidth: 1,
//                   borderColor: 'black',  backgroundColor: '#3373C4',
//                 }}
//               >
//                 <Text
//                   style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>
//                   Joined
//                 </Text>
//               </View>
//             </TouchableOpacity>
//               :
//               <TouchableOpacity style={{ flexDirection: 'row' }}
//                 onPress={() => getJoinStatus() ?  Alert.alert('Request Has Already Been Sent.') : [JoinRequestEventFTN(selectedEvent),getFcmTokenFunction(selectedEvent)]}
//               >
//                 <View
//                   style={{
//                     height: 35, borderRadius: 12, width: 120, borderWidth: 1,
//                     borderColor: 'black', backgroundColor: checkJoinStatus ? '#FF337B' : '#46D300', //backgroundColor: getJoinStatus() ? '#FF337B' : '#46D300'
//                   }}
//                 >
//                   <Text
//                     style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>
//                     {
//                      //getJoinStatus()
//                       checkJoinStatus
//                         ?
//                         'Request Sent'
//                         :
//                         'Join show'
//                     }
//                   </Text>
//                 </View>
//               </TouchableOpacity>
//               :
//               null
//               // <Text
//               //   style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>
//               //   My Event
//               // </Text>
//             }
      
//                   {
//     //               eventPosterUserId !== myUserId ?
//     //                 <TouchableOpacity style={{ flexDirection: 'row' }}
//     //                   onPress={() => JoinEventFtn()}
//     //                 >
//     //                   {/* <Text style={{ marginRight: 20 }}>0</Text> */}
//     //                   <View
//     //                     style={{
//     //                       height: 35, borderRadius: 12, width: 120, borderWidth: 1,
//     //                       borderColor: 'black', backgroundColor: 'blue'
//     //                     }}
//     //                   >
//     //                     {/* {
//     //   totalEventMembersJoined === myUserId ?  */}
//     //                     <Text
//     //                       style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>
//     //                       {
//     //                         getJoinStatus(totalEventMembersJoinedList)
//     //                           ?
//     //                           'Joined'
//     //                           :
//     //                           'Join Event'
//     //                         // eventJoinBtnText
//     //                       }
//     //                     </Text>
//     //                     {/* :
//     //                 <Text
//     //                   style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>
//     //                   Join Event
//     //                 </Text>} */}
      
//     //                   </View>
//     //                 </TouchableOpacity>
//     //                 :
//     //                 <Text
//     //                   style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>
//     //                   My Event
//     //                 </Text>
//                   }
//                 </View>
      
      
//                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 140 }}>
//                   <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
//                     {
//                       myDistance !== null ? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
//                         Event Distance : {myDistance} km away
//                       </Text> :
//                         <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: '#fff' }}>
//                           Event Distance : Not Mentioned
//                         </Text>
//                     }
//                   </View>
//                   <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
//                     {
//                       props.selectedEvent.eventName !== null ? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
//                         Event Name : {props.selectedEvent.eventName}
//                       </Text> :
//                         <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: '#fff' }}>
//                           Members Joined : Not Mentioned
//                         </Text>
//                     }
//                   </View>
//                   <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
//               {
//                 props.selectedEvent.eventMembersList.length !== 0 || props.selectedEvent.eventMembersList.length !== undefined? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
//                   Participants Joined : {props.selectedEvent.eventMembersList.length}
//                 </Text> :
//                   <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: '#fff' }}>
//                     Participants Joined : 0
//                   </Text>
//               }
//             </View>
      
//                   <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
      
//                     <TouchableOpacity style={{ flexDirection: 'row' }}
//                     // onPress={() => item.likes == UserId ? onPostDislike(item) : onPostLiked(item)}
//                     >
//                       {
//                         props.selectedEvent.members !== null ? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
//                           Total Members : {props.selectedEvent.members}
//                         </Text> :
//                           <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: '#fff' }}>
//                             Total Members : Not Mentioned
//                           </Text>
//                       }
      
//                     </TouchableOpacity>
      
//                   </View>
//                   <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
//                     {
//                       props.selectedEvent.eventDate !== null ? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
//                         Event Date : {props.selectedEvent.eventDate}
//                       </Text> :
//                         <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: '#fff' }}>
//                           Event Date : Not Mentioned
//                         </Text>
//                     }
//                   </View>
//                   <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
//                     {
//                       props.selectedEvent.eventTime !== null ? <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: '#fff' }}>
//                         Event Time : {props.selectedEvent.eventTime}
//                       </Text> :
//                         <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: '#fff' }}>
//                           Event Time : Not Mentioned
//                         </Text>
//                     }
//                   </View>
//                   <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
//                     {
//                       eventPostDateTime !== '' ? <Text style={{ marginLeft: 10, fontSize: 16, color: '#fff', fontWeight: '500' }}>
//                         Event Posted Date : {eventPostDateTime}
//                       </Text> :
//                         <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: '#fff' }}>
//                           Event Posted Date : Not Mentioned
//                         </Text>
//                     }
//                   </View>
      
//                   <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
//                     {
//                       eventStatus !== null ? <Text
//                         style={{
//                           marginLeft: 10, fontSize: 20, color: '#fff', fontWeight: '500', padding: 10,
//                           borderWidth: 2, borderColor: 'black', backgroundColor: eventStatus == 'Active' ? 'green' : 'red'
//                         }}>
//                         Event Status : {eventStatus == 'Active' ? 'Active' : 'Expired'}
//                       </Text> :
//                         <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: '#fff' }}>
//                           Event Status : Not Mentioned
//                         </Text>
//                     }
//                   </View>
//                 </View>
      
//               </View>
//               {/* </ScrollView> */}
//             </View>
//           )
//     }
//     return (
//         <View style={{ height: '100%', width: '100%', backgroundColor: 'grey' }}>
//           {/* <BottomSheetModalProvider>
//           <View>
//           <BottomSheetModal
//           ref={bottomSheetModalRef}
//           index={0}
//           snapPoints = {snapPoints}
//           >
//               <View>
//                 <Text>
//                   Hello
//                 </Text>
//                 </View>
//             </BottomSheetModal>
//           </View>
           
//           </BottomSheetModalProvider> */}
//             <Button title='Filter Results' //onPress={handlePresentModal}// 
//             onPress={() => setFilterModal(true)} 
//             />
//             {/* <Button title='My Location' /> */}
//             {/* {
//                                                             myDistance.length > 0 ? myDistance.map((userDistance, index) => {
//                                                                 return (
//                                                                     <Text style={{ marginLeft: 10, color: 'black', fontSize: 16, fontWeight: '500' }}>
//                                                                         Event Distance : {userDistance} km away
//                                                                     </Text>
//                                                                 )
//                                                             }) :
//                                                                 <Text style={{ marginLeft: 10, color: 'black', fontSize: 16, fontWeight: '500' }}>
//                                                                     Event Distance : 01 km away
//                                                                 </Text>
//                                                         } */}
//             <MapView
//                 style={{ width: '100%', height: '100%' }}
//                 initialRegion={{
//                     latitude: 51.50746, // 33.51995346211034, 73.08200449215008// 51.50746, -0.1277,
//                     longitude: -0.1277,
//                     latitudeDelta: 2,//0.0922,
//                     longitudeDelta: 2,//0.0421,
//                 }}
//                 onRegionChange={x => {
//                     // console.log(x);
//                 }}>
//                 {

//                     allevents.length > 0 ?
//                     allevents && allevents.map((marker, index) => {
//                             return (

//                                 //  <Marker coordinate={marker.eventLocation}
//                                 <Marker coordinate={{ latitude: marker.eventLocation.latitude, longitude: marker.eventLocation.longitude }}
//                                     title='Test Map marker'
//                                     description='Test map marker with custom image'
//                                     // icon={require('../Images/user.png')}
//                                     key={index}
//                                     onPress={() => selectedEventModal(marker) }

//                                 >
//                                     <View style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }}>


//                                         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                                             <TouchableOpacity onPress={() => { console.log('button clicked'); setFilterModal(true) }}>


//                                                 <Image source={require('../Images/map-marker.png')}
//                                                     style={{ height: 70, width: 70 }} />
//                                                 <View style={{ position: "absolute" }}>
//                                                     <Image source={{ uri: marker.img }}
//                                                         style={{ height: 44, width: 44, borderRadius: 22, marginLeft:12, marginTop:7 }} />
//                                                 </View>
//                                             </TouchableOpacity>
//                                         </View>

//                                     </View>

//                                     <Callout tooltip>
//                                         {/* <MapCalloutSubview> */}
//                                         <View>

//                                             <View style={styles.bubble}>

//                                                 {/* <View style={{width: 60, height: 44,}} > */}
//                                                 <Text //style={{height:44, width: 44, borderWidth:1, borderColor:'red'}}
//                                                 >
//                                                     <Image source={{ uri: marker.img }} resizeMode='cover'
//                                                         style={{
//                                                             width: 44, height: 44,borderRadius:22
//                                                         }}
//                                                     />
//                                                 </Text>
//                                                 {/* </View> */}
//                                                 <View style={{
//                                                     flex: 1, height: '100%', width: '80%',
//                                                     flexDirection: 'column', marginLeft: 2,
//                                                     borderWidth: 1, borderColor: 'white', 
//                                                     flexWrap: 'wrap'
//                                                 }}>
//                                                     <View style={{ height: '70%', width: '100%', margin: 3 }}>
//                                                         <Text style={{ fontSize: 15, fontWeight: '600', color:'white' }}>{marker.eventName}</Text>
//                                                         {/* {
//                                                             myDistance.length > 0 ? myDistance.map((userDistance, index) => {
//                                                                 return (
//                                                                     <Text key={index} style={{ marginLeft: 10, color: 'black', fontSize: 16, fontWeight: '500' }}>
//                                                                         Event Distance : {userDistance} km away
//                                                                     </Text>
//                                                                 )
//                                                             }) :
//                                                                 <Text style={{ marginLeft: 10, color: 'black', fontSize: 16, fontWeight: '500' }}>
//                                                                     Event Distance : 0 km away
//                                                                 </Text>
//                                                         } */}
//                                                         {/* <Text>{marker.eventDescription}</Text> */}


//                                                         <View style={{ height: 30, width: 100 }}>

//                                                         </View>
//                                                     </View>

//                                                 </View>
//                                             </View>
//                                         </View>
//                                         {/* </MapCalloutSubview> */}
//                                     </Callout>
//                                 </Marker>
//                             )
//                         })
//                         :
//                         null

//                 }
//             </MapView>
//             <GestureRecognizer
//              style={{ flex: 1 }}
//              onSwipeUp={() => setFullScreen(true)}
//              onSwipeRight={() => setFullScreen(true)}
//             //  onSwipeUp={}

//              onSwipeDown={() =>{setEventInfoModal(false), setFullScreen(false)}}
//             >
             
//               <Modal visible={eventInfoModal}
//                 onRequestClose={() => {setEventInfoModal(false), setFullScreen(false)}}
//                 transparent={true}
//                 style={{ justifyContent: 'flex-end', alignSelf:'flex-end', backgroundColor:'black',
//                 alignItems: 'flex-end', alignContent: 'flex-end', height: fullScreen ? '100%':'30%',width: '100%' }}

//             >
//               {/* <View style={{flex:1}}> */}
//               <ScrollView showsVerticalScrollIndicator={false}>
//                  <View style={{ flex: 1, alignSelf: 'flex-end', 
//                 justifyContent: 'flex-end', alignItems: 'flex-end', height: '30%', width: '100%' }}>
//                     <View style={{ 
//                         backgroundColor: '#1e1e1e', alignSelf: 'flex-end', height: fullScreen ? '100%':'30%',width: '100%', justifyContent: 'center', alignItems: 'center',
//                         borderTopLeftRadius: 30, borderTopRightRadius: 30,// borderWidth: 1, borderColor: 'purple'
//                     }}>
//                        {/* <View style={{ flex: 1 }}> */}
                        
//                           <SelectedEventInModal selectedEvent={selectedEvent} />
                        
//                       {/* </View> */}
//                     </View>
//                 </View>
//                 </ScrollView>
//                 {/* </View> */}
//             </Modal>
           
//             </GestureRecognizer>
//             <Modal
//                 visible={filterModal}
//                 transparent={true}
//                 onRequestClose={()=>setFilterModal(false)}
//                 style={{ flex: 1, width: '100%', height: '100%',
//                  justifyContent: 'flex-end', alignItems: 'flex-end', alignContent: 'flex-end' }}
//             >
//                 <View style={{ flex: 1, alignSelf: 'flex-end', 
//                 justifyContent: 'flex-end', alignItems: 'flex-end', height: '50%', width: '100%' }}>
//                     <View style={{
//                         backgroundColor: 'white', alignSelf: 'flex-end', height: '95%', width: '100%', justifyContent: 'center', alignItems: 'center',
//                         borderTopLeftRadius: 30, borderTopRightRadius: 30, borderWidth: 4, borderColor: 'purple'
//                     }}>
//                         <View style={{ width: '90%', height: '90%', backgroundColor: 'white', marginBottom: 110, marginTop: 40 }}>
//                             {/* <Text style={{ fontSize: 20, fontWeight: '700', color: '#707070', margin: 20 }}>Gender</Text> */}
//                             {/* <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
//                                 <TouchableOpacity
//                                     onPress={() => { setFilterGender('Male'); setFilterGenderAll(''); }}
//                                     style={{
//                                         marginLeft: 10, width: 100, height: 50,
//                                         backgroundColor: filterGender == 'Male' ? 'blue' : '#909090',
//                                         borderRadius: 20, justifyContent: 'center', alignItems: 'center'
//                                     }}>
//                                     <Text style={{ color: 'white', fontSize: 20, fontWeight: '500' }}>Male</Text>
//                                 </TouchableOpacity>
//                                 <TouchableOpacity
//                                     onPress={() => { setFilterGender('Female'); setFilterGenderAll(''); }}
//                                     style={{
//                                         width: 100, height: 50,
//                                         backgroundColor: filterGender == 'Female' ? 'blue' : '#909090',
//                                         borderRadius: 20, justifyContent: 'center', alignItems: 'center'
//                                     }}>
//                                     <Text style={{ color: 'white', fontSize: 20, fontWeight: '500' }}>Female</Text>
//                                 </TouchableOpacity >
//                                 <TouchableOpacity
//                                     onPress={() => { setFilterGenderAll('Both'); setFilterGender('') }}
//                                     style={{
//                                         marginRight: 5, width: 100, height: 50,
//                                         backgroundColor: filterGenderAll == 'Both' ? 'blue' : '#909090',
//                                         borderRadius: 20, justifyContent: 'center', alignItems: 'center'
//                                     }}>
//                                     <Text style={{ color: 'white', fontSize: 20, fontWeight: '500' }}>Both</Text>
//                                 </TouchableOpacity>

//                             </View> */}
//                             <Text style={{ fontSize: 20, color: '#707070', fontWeight: '700', margin: 10 }}>
//                                 Distance Range : {Math.floor(minDistance)} to {Math.floor(maxDistance)}
//                             </Text>
//                             <View style={{ flex: 1 }}>

//                                 <Text style={{ fontSize: 20, color: '#707070', fontWeight: '700', margin: 10 }}>
//                                     Minimum Distance {Math.floor(minDistance)}
//                                 </Text>

//                                 <Slider
//                                     style={{ width: 300, height: 50 }}
//                                     minimumValue={1}
//                                     maximumValue={300}
//                                     minimumTrackTintColor='black' //"#FFFFFF"
//                                     maximumTrackTintColor='blue'//"#000000"
//                                     onValueChange={(value) => setMinDistance(value)}
//                                 />
//                                 <Text style={{ fontSize: 20, color: '#707070', fontWeight: '700', margin: 10 }}>
//                                     Maximum Distance {Math.floor(maxDistance)}
//                                 </Text>

//                                 <Slider
//                                     style={{ width: 300, height: 50 }}
//                                     minimumValue={minDistance}
//                                     maximumValue={300}
//                                     minimumTrackTintColor='black' //"#FFFFFF"
//                                     maximumTrackTintColor='blue' //"#000000"
//                                     // inverted={true}
//                                     onValueChange={(value) => setMaxDistance(value)}
//                                 />
//                                 <Text style={{ fontSize: 20, color: '#707070', fontWeight: '700', margin: 10 }}>
//                                     {/* Maximum Distance {Math.floor(maxDistance)} kM */}
//                                 </Text>
//                                 <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 50 }}>
//                   <TouchableOpacity onPress={() => showInterestModal()}
//                     style={[styles.userButton, { backgroundColor: 'blue', width: 250, justifyContent: 'center', alignItems: 'center' }]}>
//                     <Text style={{ color: 'white', fontSize: 20, fontWeight: '400' }}>Filter Interest</Text>
//                   </TouchableOpacity>
//                 </View>
//                                 {/* <Slider
//                                     style={{ width: 300, height: 50 }}
//                                     minimumValue={1}
//                                     maximumValue={1000}
//                                     minimumTrackTintColor='black' //"#FFFFFF"
//                                     maximumTrackTintColor='blue' //"#000000"
//                                     // inverted={true}
//                                     onValueChange={(value) => setMaxDistance(value)}
//                                 /> */}
//                                 <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 50 }}>
//                                     <TouchableOpacity
//                                         onPress={() => userFilterDataEvents()}
//                                         style={[styles.userButton, { backgroundColor: 'blue', width: 300, justifyContent: 'center', alignItems: 'center' }]}>
//                                         <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>Apply Filters</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             </View>


//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//             <Modal
//         animationType="slide"
//         transparent={true}
//         visible={interestModal}
//         onRequestClose={() => {
//           setInterestModal(false);
//         }}>
//         <View
//           style={{
//             height: '80%',
//             width: '90%',
//             padding: 10,
//             borderRadius: 15,
//             elevation: 100,
//             shadowColor: 'indigo',
//             shadowOffset: {
//               width: 3,
//               height: 3,
//             },
//             shadowRadius: 5,
//             shadowOpacity: 1.0,
//             backgroundColor: 'white',
//             alignSelf: 'center',
//             marginTop: 100,
//             marginBottom: 50,
//             flexWrap: 'wrap',
//           }}>
//           <ScrollView
//             showsHorizontalScrollIndicator={false}
//             showsVerticalScrollIndicator={false}>
//             <View style={{margin: 5}}>
//               {interests.map((item, index) => {
//                 return (
//                   <View
//                     key={index}
//                     style={{
//                       flex: 1,
//                       flexDirection: 'row',
//                       alignItems: 'center',
//                       alignContent: 'center',
//                     }}>
//                     <TouchableOpacity
//                       style={{
//                         borderRadius: 40,
//                         width: 300,
//                         height: 50,
//                         backgroundColor: '#E2DFD2',
//                         marginVertical: 5,
//                         justifyContent: 'flex-start',
//                         marginLeft: 2,
//                         flexDirection: 'row',
//                       }}
//                       onPress={() => selectInterest(item)}>
//                       <View
//                         style={{
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                         }}>
//                         {selectedView === index ? (
//                           <View
//                             style={{
//                               backgroundColor: 'red',
//                               marginTop: 6,
//                               marginLeft: 15,
//                               borderWidth: 1,
//                               height: 25,
//                               width: 25,
//                               borderRadius: 15,
//                               borderColor: 'blue',
//                             }}
//                           />
//                         ) : (
//                           <View
//                             style={{
//                               borderWidth: 1,
//                               height: 25,
//                               width: 25,
//                               marginLeft: 15,
//                               borderRadius: 15,
//                               borderColor: 'blue',
//                               marginTop: 6,
//                             }}
//                           />
//                         )}
//                       </View>
//                       <View
//                         style={{
//                           alignItems: 'center',
//                           justifyContent: 'center',
//                         }}>
//                         <Text
//                           style={{fontSize: 18, color: 'blue', marginLeft: 10}}>
//                           {item.interestName}
//                         </Text>
//                       </View>
//                     </TouchableOpacity>
//                   </View>
//                 );
//               })}
//             </View>
//           </ScrollView>
//         </View>
//       </Modal>
//         </View>
//     )
// }
// const styles = StyleSheet.create({
//     backgroundVideo: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         bottom: 0,
//         right: 0,
//         height: '100%',
//         width: '100%',
//     },
//     bubble: {
//         flex: 1,
//         flexDirection: 'row',
//         alignSelf: 'flex-start',
//         backgroundColor: 'black',
//         borderRadius: 6,
//        // borderColor: 'white',
//         // borderWidth: 0.5,
//         padding: 15,
//         width: 190,
//         height: 80,
//         marginBottom: 10
//     },
//     name: {
//         fontSize: 16,
//         marginBottom: 5,
//     },
//     arrow: {
//         backgroundColor: 'transparent',
//         borderColor: 'transparent',
//         borderTopColor: '#fff',
//         borderWidth: 16,
//         alignSelf: 'center',
//         marginTop: -32,
//     },
//     arrowBorder: {
//         backgroundColor: 'transparent',
//         borderColor: 'transparent',
//         borderTopColor: 'black',
//         borderWidth: 16,
//         alignSelf: 'center',
//         marginTop: -0.5,
//     },
//     image: {
//         width: 50,
//         height: 50,
//     },
//     marker: {
//         paddingVertical: 10,
//         paddingHorizontal: 30,
//         backgroundColor: "#007bff",
//         borderColor: "#eee",
//         borderRadius: 5,
//         elevation: 10,
//     },
//     text: {
//         color: "#fff",
//     },
//     userButton: {
//         backgroundColor: '#4867A9',
//         borderRadius: 10,
//         height: 35,
//         width: 110,
//         marginLeft: 10
//     },
//     mainContainer: {
//       flexDirection: 'row',
//       margin: 10,
//     },
//     userImage: {
//       width: 35,
//       height: 35,
//       margin: 5,
//       borderRadius: 18,
//       borderWidth: 1,
//       borderColor: 'white',
//       // tintColor: 'white'
//     },
//     userName: {
//       fontSize: 18,
//       fontWeight: '600',
//       margin: 3,
//       color: 'white'
  
//     },
//     postImage: {
//       width: '100%',
//       height: '100%',
//       // margin: 5,
//       // alignSelf: 'center',
//       // borderRadius: 30,
//       borderWidth: 1,
//       borderColor: 'black',
//     },
//     detailBox: {
//       flexDirection: 'row',
//       width: '90%',
//       height: 70,
//       // marginBottom: 10,
//       // justifyContent: 'space-evenly',
//       alignItems: "center",
//       backgroundColor: 'white',
//       borderWidth: 2,
//       borderColor: 'black',
//       marginVertical: 10,
//       borderRadius: 10,
//     },
// });

// export default ExploreEvents



