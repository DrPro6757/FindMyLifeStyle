import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert, Modal, TextInput, ScrollView, Platform, Vibration } from 'react-native'
import React, { useEffect, useState, useRef, useSyncExternalStore } from 'react'
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Notifications from './Notifications';
import { useNavigation, StackActions } from '@react-navigation/native'
import notifee, { AndroidColor, AndroidImportance, AndroidStyle } from '@notifee/react-native';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import { confirmButtonStyles } from 'react-native-modal-datetime-picker';
import NotificationList from './NotificationList';
import Loader from './Loader';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import GestureRecognizer from 'react-native-swipe-gestures';
import moment from 'moment';
import Video from 'react-native-video';
import { getDistance, getPreciseDistance } from 'geolib';
import auth from '@react-native-firebase/auth';
import Slider from '@react-native-community/slider';
import { max } from 'date-fns';
import ExploreEvents from './ExploreEvents';
import MyEventList from './MyEventList';
import PropTest from './PropTest';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import SignUpScreen from './SignUpScreen';
import {useDispatch, useSelector} from "react-redux";
import { getAllEventsInitiate } from '../Redux/actionsEvents';
import { getMyUserDataAction } from '../Redux/actionsUser';
import { EventJoinNotificationSend } from '../Redux/actionsNotification';

//later
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
messaging().getInitialNotification();


let isLikedBy = '';
const EventsScreen = (props) => {
  // let childRef = useRef(null)
  const [refVisible, setRefVisible] = useState(false)

  const [selectedEvent, setSelectedEvent] = useState(undefined);

  const [myData, setMyData] = useState('');
  const [isLiked, setisLiked] = useState(false);
  const [postData, setPostData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [postFilteredData, setPostFilteredData] = useState([]);

  const [distanceData, setDistanceData] = useState([]);

  const [onLikeClick, setonLikeClick] = useState(false);
  const [onLikeButton, setOnLikeButton] = useState(false);
  const [likeButton, setLikeButton] = useState(false);
  const [userList, setUserslist] = useState([]);
  const [notificaitonSent, setNotificationSent] = useState(false);
  const [myUserId, setMyUserId] = useState('');
  const [myName, setMyUserName] = useState('');
  const [myProfileImage, setMyProfileImage] = useState('');
  const [myFcmToken, setMyFcmToken] = useState('');
  const [totalEventMembers, setTotalEventMembers] = useState();
  const [totalEventMembersJoined, setTotalEventMembersJoined] = useState(0);
  const [totalEventMembersJoinedList, setTotalEventMembersJoinedList] = useState([]);
  const [totalEventMembersRequestList, setTotalEventMembersRequestList] = useState([]);

  const [eventJoinBtnText, setEventJoinBtnText] = useState('');
  const [EventPostId, setTotalEventPostId] = useState();
  const [eventCaption, setEventCaption] = useState();
  const [eventName, setEventName] = useState();
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventStatus, setEventStatus] = useState('');
  const [eventImage, setEventImage] = useState();
  const [eventFcmToken, setEventFcmToken] = useState('');
  const [eventPosterUserId, setEventPosterUserId] = useState('');
  const [eventModal, setEventModal] = useState(false);
  const [eventNotificationSentContent, setEventNotificationSentContent] = useState('');
  const [eventNotificationCount, setEventNotificationCount] = useState(0);
  const [eventPostDateTime, seteventPostDateTime] = useState('');
  const [eventOwnerUserName, setEventOwnerUserName] = useState('');
  const [eventOwnerProfileImage, seteventOwnerProfileImage] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const [Loading, setLoading] = useState(false);

  const [eventMembersListData, setEventMembersListData] = useState([]);

  const [myDistance, setMyDistance] = useState();
  const [minDistance, setMinDistance] = useState(1);
  const [maxDistance, setMaxDistance] = useState(1000);
  const [filterGender, setFilterGender] = useState('')
  const [filterGenderAll, setFilterGenderAll] = useState('Both')
  const [filterModal, setFilterModal] = useState(false);
  const [flatListIndex, setFlatListIndex] = useState(0);
  const flatListRef = useRef();

  const netInfo = useNetInfo();
  const navigation = useNavigation();
  let myLikes;
  let myLikes1;
  let myMembers;
  let myEventLikes;
  let myWishListHere;
  const [selectedInterest, setSelectedInterest] = useState('Hobbies and Activities');
  const [selectedView, setSelectedView] = useState();
  const [interestModal, setInterestModal] = useState(false);

  const [searchResult, setSearchResult] = useState('');

  const [selected, setSelected] = useState([])
  const [eventInterests, setEventInterests] = useState([]);
  const[myTotalFollowers, setMyTotalEventReq] = useState([]);
  const[myTotalEventMembers, setMyTotalEventMem] = useState([]);
  const[myEventStatus, setMyEventStatus] = useState('Join');
  const [totalEventLikes, setTotalEventLikes] = useState([]);
  // let userIDsPosts='';
  // let userIDsUsers='';
  // let notificationCount = 0;
  let UserId = '';
  let myUserName = '';
  let ProfileImage = '';
  let FcmToken = '';
  let myLat = '';
  let myLong = '';
  let TimePosted = '';
  let pdis = 1;
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
  const [selectedId, setSelectedId] = useState('');
    const [checkJoinStatus, setJoinStatus] = useState(0);
    const [houseFull, setHouseFull] = useState(false);
    const [joinedConfirm, setJoniedConfirm] = useState(false);
    const [updateState, setUpdateState] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    getUserId();
    // getMyToken();
    dispatch(getMyUserDataAction());
    dispatch(getAllEventsInitiate());
    // getEventData();
    getNotificationData();
    // Notifications();
  }, [likeButton, notificaitonSent, refVisible])
  useEffect(() => {
    getJoinStatus();
  }, [likeButton])
  
  //later
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived! in foreground mode', JSON.stringify(remoteMessage.notification?.body));
      // if (remoteMessage) {
      //   // notificationCount = notificationCount + 1;
      //   // console.log('total notificationssssssssssss ' + notificationCount)
      //   setNotificationSent(!notificaitonSent);
      // }
      displayNotification(remoteMessage);
    });

    return unsubscribe;
  }, []);
  const {mydata} = useSelector(state => state.myUserData);
  const {users} = useSelector(state => state.myUserData);

    let myID = "";
    let myNameHere = "";
  let myProfileImageHere = "";
  let tempMyLikeEventList= []
  let tempMyWishListOverall = []
    mydata && 
    mydata.map(item=>{
     myID = item.id;
     myNameHere = item.name;
     myProfileImageHere = item.profileImage;
     tempMyLikeEventList = item.myLikedEvents;
     tempMyWishListOverall = item.EventWishList;
    })
  const {allevents} = useSelector(state => state.eventData);
  const {myRequests} = useSelector(state => state.eventData);
  // allevents && allevents.map((item)=>{
  // setPostData(allevents)
  //     })
  const [likeStatusCheck, setlikeStatusCheck] = useState(false);
  const [myLikedEventsList, setMyLikedEventsList] = useState([]);
  useEffect(() => {
    let tempData = [];
    // console.log('all req Id&&&&&&&&&&&&& ',myRequests)
    allevents && allevents.map((item)=>{
      if(item.postId === selectedId){
        item.eventMembersList.map(itemMem=>{
            // if(itemMem.length > item.members){
          item.eventJoinRequests.map(itemReq=>{
        
        //  item.eventJoinRequests && 
        if(itemMem === myID && itemReq !== myID){
          setJoinStatus(2);
          // console.log('join status mem Id***********&&&&&&&&&&&&&', item.eventName)
          // console.log('joined mem Id***********&&&&&&&&&&&&& Status == ',checkJoinStatus)
          // console.log('all mem Id***********&&&&&&&&&&&&& ',itemMem)
          
        }else if(itemReq === myID && itemMem !== myID){
          setJoinStatus(1)
          // console.log('all req Id***********&&&&&&&&&&&&& ',itemReq)
          // console.log('all req Id***********&&&&&&&&&&&&& Status == ',checkJoinStatus)
          //  console.log('join status req Id***********&&&&&&&&&&&&&', item.eventName)
          //  console.log('join status req Id***********&&&&&&&&&&&&&', item.eventJoinRequests)
        }
        else if(itemReq !== myID && itemMem !== myID){
          setJoinStatus(0)
          // console.log('join status req Id not found ***********&&&&&&&&&&&&&', item.eventName)
          // console.log('join status req Id not found ***********&&&&&&&&&&&&& status == ',checkJoinStatus )
          // console.log('join status req Id not found ***********&&&&&&&&&&&&&', item.eventJoinRequests)
          
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
     let tempUsers = []
      users && users.map((item)=>{
        tempUsers.push(item)
      })
      setUserslist(tempUsers)
      // console.log('All User Data == ',tempData)
  }, [allevents, myRequests, selectedId, updateState])
  // useEffect(() => {
  //   allevents && allevents.map((item)=>{

  //     tempMyLikeEventList.map(item2=>{
  //       // console.log('my liked events in list /////////\\\\\\\\\\\ ',item2)
  //       if(item.postId === item2){
  //         // console.log('my liked events /////////\\\\\\\\\\\ ',item.likes)
  //         // console.log('my liked events /////////\\\\\\\\\\\ ',item.eventName)
  //         setMyLikedEventsList(item.postId);
  //         setlikeStatusCheck(true)
  //       }else{
  //         setlikeStatusCheck(false)
  //       }

  //     })
 
      
  //    })
  // }, [likeButton, allevents , myRequests, selectedId, updateState])

  
  // console.log("Fcm Token from Sign Up Sscreen sdfsdfdfdf"+props.getToken)
  const getUserId = async () => {
    UserId = await AsyncStorage.getItem("USERID");
    myUserName = await AsyncStorage.getItem("NAME");
    ProfileImage = await AsyncStorage.getItem('profileImage');
    myLat = await AsyncStorage.getItem('MyLat');
    myLong = await AsyncStorage.getItem('MyLong');
    FcmToken = await AsyncStorage.getItem('MYFCMTOKEN');
    setMyUserId(UserId);
    setMyUserName(myUserName);
    setMyFcmToken(FcmToken);
    setMyProfileImage(ProfileImage);
    // UserId = UserId.toString();
    // return UserId
    // console.log("my user id stored in event screen:: " + UserId, myFcmToken);
    // console.log("my user fcm stored in event screen:: " + senderFcmToken);
    const data = await firestore().collection('users')
      .doc(auth().currentUser?.uid).get();
    setMyData(data._data);
    // console.log('my interest '+data._data.interest)
    // console.log('my location latitude : ');
    // console.log('my location latitude : '+myData.location.latitude);
  }
  //   const getMyToken=async()=>{
  //      senderFcmToken = await AsyncStorage.getItem("MYFCMTOKEN");
  // return senderFcmToken
  //   }
  //later
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
  
  // const token = 'd2Q68V_zQNSbdWDljT8r9e:APA91bEKN6Ro7LRCHiSdZOgfYFXHwo-EqA1ykcJocTqU-nEXQrBrwk0fzLZfirLw_YhVwHPY6A0U4ewPmDfrBO3-CfiC5JWDyvM79UpP3Dhz0gn6TMJR8ZP_N8mg5GGuwvrLNqf3b6-4';
  const sendNotificationEventJoined = async (eventFcmToken, props) => {
    
    // var axios = require('axios');

    const notificationData = myName + " Just Requested to Join " + props.eventName;
    setEventNotificationSentContent(myName + " Just Requested to Join " + props.eventName + " at " + new Date());
    var data = JSON.stringify({
      data: {},
      notification: {
        body: myName + ' Just Requested to Join ' + props.eventName,
        title: 'Someone Requested To join Your Event',
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
      .doc(props.userId)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);

        if (documentSnapshot.exists) {
          console.log('User data for events: ', documentSnapshot.data());
          console.log('User data for event notification counter :: ', documentSnapshot.data().notificationCounter);
          tempNotificationCount = documentSnapshot.data().notificationCounter;
          setEventNotificationCount(tempNotificationCount + 1)
          // setMyPhotos(documentSnapshot.data().photos)

        }

      });



    await firestore()
      .collection('notifications')
      .doc(props.userId)
      .update({
        notificationCounter: eventNotificationCount,
        messageContent: firestore.FieldValue.arrayUnion(eventNotificationSentContent.toString()),
        messageBody: '123',
        messageTitle: firestore.FieldValue.arrayUnion(eventNotificationSentContent.toString()),
        messageType: '123',
        receiverId: eventPosterUserId,
        receiverToken: eventFcmToken,
        senderId: myUserId,
        senderToken: myFcmToken,
        senderProfileImage: myProfileImage,
        senderUserName: myUserName,
        timeStamp: new Date(),
      }).then(res => {
        console.log("Event Joiner Data Has been Added :: " + myUserId);
      }

      ).catch(error => {
        console.log(error);
      })

  };
  const showNotificaiton = async () => {
    // NotificationList();

    await firestore()
      .collection('notifications')
      .doc(myUserId)
      .update({
        notificationCounter: 0,
      }).then(res => {
        setEventNotificationCount(0);
      }

      ).catch(error => {
        console.log(error);
      })
      //later
    navigation.navigate('NotificationList');
  }


  let getEventData = () => {
    // setLoading(true);
    // let tempData = [];

    // firestore()
    //   .collection('events')
    //   .get()
    //   .then(querySnapshot => {
    //     // console.log('Total posts: ', querySnapshot.size);

    //     querySnapshot.forEach(documentSnapshot => {
    //       tempData.push(documentSnapshot.data());

    //       // tempData.map((item1)=>{
    //       //    pdis = getPreciseDistance(
    //       //     { latitude: item1.eventLocation.latitude, longitude: item1.eventLocation.longitude},
    //       //     { latitude:  myData.myLocation.latitude, longitude: myData.myLocation.longitude }
    //       //   );
    //       //   console.log('Distance = '+pdis/1000+' Kms')
    //       //   // tempData.push(pdis)
    //       // })

    //       console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
    //       console.log('all user id ' + documentSnapshot.data().userId);
    //       <MyEventList myprop={testSendData} />
    //       // userIDsPosts = documentSnapshot.data().userId;
    //       TimePosted = moment(documentSnapshot.data().postTimeDate || moment.now()).fromNow();
    //       setLoading(false);
    //     });

        // let allData = concat(tempData, pdis)
        // setPostData(tempData);
        console.log('Post Data for Event in Event Screen ======= '+ props.allpostData);
        setPostData(props.allpostData);
        // setEventData(tempData);
        setEventData(props.allpostData);
        <ExploreEvents Filter='this is filter data' />

        // setDistanceData(pdis);
        // console.log("total posts imag : "+postData.img);
      // });

    setFilterModal(false);
  }
  const userFilterData = () => {
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
        // setUpdateState(!updateState);
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

  // props.childRef = {
  //   userFilterData: userFilterData,
  //   getEventData: getEventData,
  // }

  const calculatePreciseDistance = async (item) => {
    const data = await firestore().collection('users')
      .doc(auth().currentUser?.uid).get();
    setMyData(data._data);
    // 33.55465562429129, 73.09811239200536   foundation
    // 33.57648806993554, 73.0724787079291 golf club
    // 33.60131911238899, 73.03083389464575 qasim market
    var pdis = getPreciseDistance(
      { latitude: item.eventLocation.latitude, longitude: item.eventLocation.longitude },
      { latitude: myData.myLocation.latitude, longitude: myData.myLocation.longitude }
    );
    console.log('Distance = ' + pdis / 1000 + ' Km')
    console.log('all event lat ' + item.eventLocation.longitude)
    // Alert.alert(`Precise Distance\n\n${pdis} Meter\nOR\n${pdis / 1000} KM`);
  };
  const getNotificationData = async () => {
    await firestore()
      .collection('notifications')
      .doc(myUserId)
      .get().then(res => {
        console.log("Event Joiner Data Has been Added :: " + myUserId);
      }

      ).catch(error => {
        console.log(error);
      })
  }

  // const updateLikes=()=>{
  //   firestore()
  // .collection('posts')
  // .doc("e0cd79c7-20c3-4022-bfb8-02d9cb054c26")
  // .update({
  //   likes: [UserId],
  // })
  // .then(() => {
  //   console.log('User updated!');
  // });
  // setisLiked(!isLiked);
  // console.log("like status : "+ isLiked);
  // }
const getFcmTokenFunction=async(props)=>{
  console.log('user list data for notification == '+userList)
  let fcmToken;
  userList.map(item=>{
    if (item.id === props.userId){
      fcmToken = item.fcmToken
      console.log('id of poster == ',item.id)
    }
    if (item.id === myID){
      // fcmToken = item.fcmToken
      console.log('My Id Here On Join Pressed == ',item.id)
    }
  })
  // setEventFcmToken(fcmToken);
  console.log('My FcmToken Here On Join Pressed == ',fcmToken)
 
    dispatch(EventJoinNotificationSend(props,fcmToken, myNameHere));
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

        console.log("My Event Memebrs list :: " + tempMembers);

      })
      .catch(error => {
        console.log(error)
      });
    if (tempMembers.length < membersNumbers) {


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

        setTotalEventMembers(tempMembers.length);
        console.log("My total Event Memebrs :: " + tempMembers.length);
        // getJoinStatus();
      })
      .catch(error => {
        console.log(error)
      });


    console.log("Event owner Fcm Token ************************** " + eventFcmToken);
    sendNotificationEventJoined(eventFcmToken,props);


    setEventModal(false);
    setLikeButton(!likeButton);
    
  }

  const GetEventTotalMembers = async (item) => {
    setLoading(true);
    let tempData = [];
    let tempMembers = []
    // myMembers = await firestore().collection('events').doc(item.postId)
    //   .get()
    //   .then(snapshot => {
    //     tempMembers = snapshot._data.members;
    //     console.log("My Event Memebers list :: " + tempMembers);

    //     setTotalEventMembers(tempMembers);
    //     // console.log("My total Event Memebrs :: " + item.tempMembers);
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   });

    ///  query snaphot not only read collection, all the document in collection but also the data with the documents
    ///
    await firestore()
      .collection('events')
      .doc(item.postId)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);

        if (documentSnapshot.exists) {
          console.log('User data for events: ', documentSnapshot.data());
          console.log('User data for event name:: ', documentSnapshot.data().eventName);
          console.log('User data for members:: ', documentSnapshot.data().members);
          // setMyPhotos(documentSnapshot.data().photos)

          setTotalEventMembers(documentSnapshot.data().members);
          setTotalEventMembersJoinedList(documentSnapshot.data().eventMembersList);
          setTotalEventMembersJoined(documentSnapshot.data().eventjoinRequests);

          setTotalEventMembersJoined(documentSnapshot.data().eventMembersList.length);
          setEventName(documentSnapshot.data().eventName)
          setTotalEventPostId(documentSnapshot.data().postId);
          setEventCaption(documentSnapshot.data().caption);
          setEventDescription(documentSnapshot.data().eventDescription);
          setEventImage(documentSnapshot.data().img);
          // setEventFcmToken(documentSnapshot.data().fcmTokens);
          setEventPosterUserId(documentSnapshot.data().userId);




          // seteventPostDateTime(documentSnapshot.data().postTimeDate);

          setEventOwnerUserName(documentSnapshot.data().name);
          console.log('User Id Of Person Who posted event:: ', eventPosterUserId);
          console.log('User Name Of Person Who posted event:: ', eventOwnerUserName);

          setEventDate(documentSnapshot.data().eventDate);
          setEventTime(documentSnapshot.data().eventTime);
          seteventOwnerProfileImage(documentSnapshot.data().profileImage);
          setLoading(false);

          const dateEventPosted = new Date((documentSnapshot.data().postTimeDate.seconds + documentSnapshot.data().postTimeDate.nanoseconds / 1000000000) * 1000);
          console.log("event post Dateee ::: " + dt);

          // // // let dateEevenPosted
          const dt = new Date(dateEventPosted);
          const x = dt.toISOString().split("T");
          console.log('splitted time ' + x[0]);
          console.log('splitted time 2' + eventDate);

          const x1 = x[0].split('-');
          const x2 = eventDate.split('/')
          console.log(x1[2] + "/" + x1[1] + "/" + x1[0]);
          console.log(x2[2] + "/" + x2[1] + "/" + x2[0]);
          seteventPostDateTime(x1[0] + "/" + x1[1] + "/" + x1[2]);


          // // const x = eventDate;
          // const x1 = eventDate.split('/');
          // console.log('splitted time '+eventDate);
          // console.log(x1[2] + "/" + x1[1] + "/" + x1[0]);
          // seteventPostDateTime(x1[0] + "/" + x1[1] + "/" + x1[2]);



          console.log('User data for members id:: ', totalEventMembersJoinedList);
          tempMembers = documentSnapshot.data().eventMembersList;

          var today = new Date();
          var dd = String(today.getDate()).padStart(2, '0');
          var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = today.getFullYear();

          const currentDate = yyyy + '/' + mm + '/' + dd;
          console.log("both dates === " + currentDate, eventDate)
          // if(x1[2] >= yyyy.toString() ){
          if (x2[1] > mm) {
            console.log('date gone')
            setEventStatus('Active')
          }
          if (x2[1] == mm) {
            if (x2[0] > dd) {
              console.log('date gone')
              setEventStatus('Active')
              console.log('Active')

            } else {
              setEventStatus('Expired')
              console.log('Expired' + x2[0] + ' < ' + dd)
            }
            console.log('Active' + x2[1] + ' > ' + mm)

          } else if (x2[1] < mm) {
            setEventStatus('Expired')
            console.log('Expired' + x2[1] + ' < ' + mm)
          }
          // }
          // var myDistanceFromEvent = getDistance(
          //   { latitude: item.eventLocation.latitude, longitude: item.eventLocation.longitude },
          //   { latitude: myData.myLocation.latitude, longitude: myData.myLocation.longitude }
          // );

          // myDistanceFromEvent = myDistanceFromEvent / 1000;

          // setMyDistance(myDistanceFromEvent);
          // const bothDates = [{ currentDate }, { eventData }]


          //           if (currentDate > eventData){
          // console.log
          //           }

          // if (documentSnapshot.data().eventMembersList == myUserId) {
          //   console.log(" I have joined the Evetn yaay!!!!!!!!!!!!!!");
          //   setEventJoinBtnText("Joined");

          // } else {
          //   setEventJoinBtnText("Join Event");
          //   console.log(" I am not part of event oh NOOOOOOOOOOOOOOo");

          // }
        }


        const temJoiner = ['CoBwiP96W3PBNgWK2w3hblx1quJ2', 'I5uOiHwQOOSSswLFEXl8iDbpPbG3']
        ///
        ///  Get Event Members
        //
        // firestore().collection("users").where('eventsJoined', 'array-contains', eventName).get()
        //   .then(querySnapshot => {
        //     querySnapshot.forEach(documentSnapshot => {
        //       // if (documentSnapshot.data().userID == totalEventMembersJoinedList){
        //       // console.log("Names of people who joined event :::" + eventName + ' ' + documentSnapshot.data().name);
        //       setEventMembersListData(documentSnapshot.data().name);
        //       console.log("Names of people who joined event ::" + ' ' + eventMembersListData);


        //       // }else{
        //       //   console.log("Names of people who joined event ::: No member found"+totalEventMembersJoinedList);

        //       // }
        //       // this.setState({
        //       //     dataPost: this.state.dataPost.concat({
        //       //         ...documentSnapshot.data(),
        //       //         key: documentSnapshot.id,
        //       //         name: this.getUserbyUid(documentSnapshot.data().uid) <- get Name user as soon as I get the uid from the Post collection
        //       //     }),
        //     })
        //   });
      });



    setLikeButton(!likeButton);
  }
  const onPostDislike = async (item) => {
    let tempLikes = [];

    // if (tempFollowing.length >= 1) {
    myLikes1 = await firestore().collection('events').doc(item.postId)
      .get()
      .then(snapshot => {
        tempLikes = snapshot._data.likes;
        console.log("My post id " + item.postId);

      })
      .catch(error => {
        console.log(error)
      });
    tempLikes.map(item4 => {
      if (item4 == UserId) {
        firestore()
          .collection('events')
          .doc(item.postId)
          .update({
            likes: firestore.FieldValue.arrayRemove(UserId.toString()),
          }).then(res => {

          }

          ).catch(error => {
            console.log(error);
          })
        console.log("DDDDDDDDDDDDDDDDDDDDDDDelete::" + UserId)
        Alert.alert("this user had unliked " + UserId);
      }
    })
    const likePostStatus = (item) => {
      setOnLikeButton(true)
      return onLikeButton;
    }
    getEventData();
    setLikeButton(!likeButton);
  }
  /////
  //// On Post Like
  ////
  const onPostLiked = async (item) => {
    let tempLikes = []

    myLikes = await firestore().collection('events').doc(item.postId)
      .get()
      .then(snapshot => {
        tempLikes = snapshot._data.likes;
        console.log("My post total like :: " + tempLikes);
      })
      .catch(error => {
        console.log(error)
      });
    console.log("bring me my likes list :: " + tempLikes)

    if (tempLikes.length > 0) {
      tempLikes.map(item2 => {

        if (item2 !== UserId) {
          firestore()
            .collection('events')
            .doc(item.postId)
            .update({
              likes: firestore.FieldValue.arrayUnion(UserId.toString()),
            }).then(res => {

            }

            ).catch(error => {
              console.log(error);
            })
          console.log('UUUUUUUUUUUUUUion 2nd array for likes::' + UserId.toString());
          Alert.alert("You are now like by :: " + UserId);
        }
        else if (item2 === UserId) {
          Alert.alert("You have already liked by " + UserId);
        }

      });

    }
    else {
      firestore()
        .collection('events')
        .doc(item.postId)
        .update({
          likes: firestore.FieldValue.arrayUnion(UserId.toString()),
        }).then(res => {

        }

        ).catch(error => {
          console.log(error);
        })
      console.log('UUUUUUUUUUUUUUion 2nd array for likes::' + UserId.toString());
      Alert.alert("You are now like by :: " + UserId);
      // sendNotification(eventFcmToken);
      firestore()
        .collection('notifications')
        .doc(item.userId)
        .update({
          sendFrom: token,
        }).then(res => {
          console.log("Notifications db has beeen updateeeeeeeeeeeeeedddddddddd");
        }

        ).catch(error => {
          console.log(error);
        })
    }
    const likePostStatus = (item) => {
      setOnLikeButton(true)
      return onLikeButton;
    }
    getEventData();
    console.log("My post total likesssssssssssssssssssss ARErrrre :: " + item.likes);

    setLikeButton(!likeButton);
  }


  const onLike = (item) => {
    let tempLikes = item.likes;
    if (tempLikes.length > 0) {
      tempLikes.map(item1 => {

        if (item1 == UserId) {
          const index = tempLikes.indexOf(item1);
          if (index > -1) {
            tempLikes.splice(index, 1);

          }
        }
        else {
          tempLikes.push(UserId);
        }
        // setonLikeClick(!onLikeClick);
      });
    }
    else {
      // isLikedBy = tempLikes.push(UserId);
      tempLikes.push(UserId);
      console.log('Liked by ::' + AsyncStorage.getItem("USERID"));
      // if(tempLikes !== UserId){
      // }
      // setonLikeClick(!onLikeClick);


    }

    firestore().collection('events').doc(item.postId).update({

      likes: tempLikes,

    })
      .then(() => {

        console.log('Likes updtaed + ' + item.likes.length);
        // setonLikeClick(onLikeClick);
      })
      .catch((error) => {
        console.log(error);
      });

    setonLikeClick(!onLikeClick);

  }

  const getJoinStatusConfirm = () => {
    let status = false;
    if(myTotalEventMembers.length > 0){
   myTotalEventMembers.map(itemMem=>{
          if (itemMem == myUserId) {
            status = true;
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
  let getJoinStatus = () => {
    let status = false;
    let tempMembers = []
    let tempMyEventMembers = []
  //  await  firestore().collection('events').doc(props.postId)
  //     .get()
  //     .then(snapshot => {
  //       tempMembers = snapshot._data.eventJoinRequests;
  //       tempMyEventMembers = snapshot._data.eventMembersList;
  //       console.log("My Event Memebrs list :: " + tempMembers);
        // snapshot._data.
      //  props.map(item => {
       
        myTotalFollowers.map(item2=>{
          if(item2 == myUserId){
            status  = true;
          }else{
            status = false;
          }
        })
      //     if (item == myUserId) {
      //       status = true;
      //       setMyEventStatus('Request Sent');
      //       // setOnFollowClick(true);
      //       // console.log('followed by user id ' + userId);
      //     } else {
      //       status = false;
      //       setMyEventStatus('Join');
      //       // setOnFollowClick(false);
    
    
      //     }
      //   });
      // //   setMyTotalEventReq(tempMembers);
      //   setMyTotalEventMem(tempMyEventMembers);

      //   // setTotalEventMembers(item.tempMembers.length);
      //   // console.log("My total Event Memebrs :: " + item.tempMembers.length);
      // })
      // .catch(error => {
      //   console.log(error)
      // });
    // if (followers.length > 0) {
    //props.eventJoinRequests
    // myTotalEventMembers.map(itemMem=>{
    //   if(itemMem!= myUserId){
        
      // }else{
      //   setMyEventStatus('Joined');
      // }
    
    // })
  
    // }
    console.log('current status value '+status)
    return status;
  };

  const showEventModal = async (item) => {
    GetEventTotalMembers(item);
    setLoading(true);
    setEventModal(true);
  }
  const selectedEventModal = (item) => {
    setEventModal(true)
    setSelectedEvent(item);
    getSelectEventMembers(item);
  }
  const getSelectEventMembers =async (item)=>{
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

      setTotalEventMembers(tempMembers.length);
      console.log("My total Event Memebrs Req :: " + tempMembers.length);
    })
    .catch(error => {
      console.log(error)
    });


  }

  const testSendData = () => {
    console.log('function clicked from other component')
    Alert.alert('Function from other')

  }
  const EventLikeFtn=async(props)=>{
    let tempLikes = [];
    // let likesNumbers;
    let tempMyEventLikes = [];

    // if (tempFollowing.length >= 1) {
      myEventLikes = await firestore().collection('events').doc(props.postId)//EventPostId
      .get()
      .then(snapshot => {
        tempLikes = snapshot._data.likes;
        // likesNumbers = snapshot._data.members;

        console.log("My Event Memebrs list :: " + tempLikes);

      })
      .catch(error => {
        console.log(error)
      });
    // if (tempLikes.length < tempLikes) {


      if (tempLikes.length > 0) {
        tempLikes.map(item3 => {

          if (item3 !== myUserId) {
            firestore()
              .collection('events')
              .doc(props.postId)
              .update({
                // eventMembersList: firestore.FieldValue.arrayUnion(myUserId),
                likes: firestore.FieldValue.arrayUnion(myUserId),
              }).then(res => {
                console.log("Another member requested to Join event :: " + UserId);
              }

              ).catch(error => {
                console.log(error);
              })

              firestore()
              .collection('users')
              .doc(myUserId)
              .update({
                // eventMembersList: firestore.FieldValue.arrayUnion(myUserId),
                myLikedEvents: firestore.FieldValue.arrayUnion(props.postId),
              }).then(res => {
                console.log("Another member requested to Join event :: " + UserId);
                Alert.alert('Added To Like List')
              }
          
              ).catch(error => {
                console.log(error);
              })
            console.log('UUUUUUUUUUUUUUion 2nd array for likes::' + UserId.toString());
            Alert.alert("You Liked This Event");
          }
          else if (item3 === myUserId) {
            firestore()
            .collection('events')
            .doc(props.postId)
            .update({
              // eventMembersList: firestore.FieldValue.arrayUnion(myUserId),
              likes: firestore.FieldValue.arrayRemove(myUserId),
            }).then(res => {
              console.log("Your Like Has been removed from events :: " + UserId);
            }

            ).catch(error => {
              console.log(error);
            })

            firestore()
            .collection('users')
            .doc(myUserId)
            .update({
              // eventMembersList: firestore.FieldValue.arrayUnion(myUserId),
              myLikedEvents: firestore.FieldValue.arrayRemove(props.postId),
            }).then(res => {
              console.log("Another member requested to Join event :: " + UserId);
              Alert.alert('Removed To Like List')
            }
        
            ).catch(error => {
              console.log(error);
            })
          }

        });

      } else {

        firestore()
          .collection('events')
          .doc(props.postId)
          .update({
            // eventMembersList: firestore.FieldValue.arrayUnion(myUserId),
            likes: firestore.FieldValue.arrayUnion(myUserId),
          }).then(res => {
            console.log("Another member Joined your event :: " + myUserId);
            Alert.alert("You Liked Added In Event List");
          }

          ).catch(error => {
            console.log(error);
          })

        firestore()
        .collection('users')
        .doc(myUserId)
        .update({
          // eventMembersList: firestore.FieldValue.arrayUnion(myUserId),
          myLikedEvents: firestore.FieldValue.arrayUnion(props.postId),
        }).then(res => {
          console.log("Another member requested to Join event :: " + UserId);
          Alert.alert('Added To Like List')
        }
    
        ).catch(error => {
          console.log(error);
        })
      }
    // } 
    // else {
    //   Alert.alert("Memeber List Is Full Please Contact Admin");
    // }
    myEventLikes = await firestore().collection('events').doc(props.postId)
      .get()
      .then(snapshot => {
        tempLikes = snapshot._data.likes;
        tempMyEventLikes = snapshot._data.eventMembersList;
        console.log("My Event Likes list :: " + tempLikes);
        // setMyTotalEventReq(tempLikes);
        setTotalEventLikes(tempMyEventLikes);

        // setTotalEventMembers(tempLikes.length);
        console.log("My total Event Likes :: " + tempLikes.length);
        console.log("My total Event Likes in state :: " + totalEventLikes);
        // getJoinStatus();
      })
      .catch(error => {
        console.log(error)
      });


    // console.log("Event owner Fcm Token ************************** " + eventFcmToken);
    // sendNotificationEventJoined(eventFcmToken,props);


    // setEventModal(false);
    setLikeButton(!likeButton);
    
  }
  const getLikeStatus = (item) => {
    let status = false;
    
     
        // allevents && allevents.map((item)=>{
          if(tempMyLikeEventList !== undefined){
            tempMyLikeEventList.map(item2=>{
        
              if(item2 === item.postId){
                console.log('my liked events in list  === ',item2)
                status = true
              }
      
            })
          }else{
            status = false
          }
         
    //  })
    // console.log("like status : "+status);
    // setLikeButton(!likeButton);
    return status;

  }
  const AddToWishListFtn = async(props) =>{
    let tempWishList = [];
    // let likesNumbers;
    let tempMyEventLikes = [];
    

    // if (tempFollowing.length >= 1) {
      myWishListHere = await firestore().collection('users').doc(myID)//EventPostId
      .get()
      .then(snapshot => {
        tempWishList = snapshot._data.EventWishList;
        // likesNumbers = snapshot._data.members;

        // console.log("My Event Memebrs list :: " + tempWishList);

      })
      .catch(error => {
        console.log(error)
      });

      if (tempWishList.length > 0) {
        tempWishList.map(item3 => {

          if (item3 !== props.postId) {
            firestore()
            .collection('users')
            .doc(myID)
            .update({
              // eventMembersList: firestore.FieldValue.arrayUnion(myID),
              EventWishList: firestore.FieldValue.arrayUnion(props.postId),
            }).then(res => {
              // console.log("Another member requested to Join event :: " + myID);
              Alert.alert('Added To Wish List')
            }
        
            ).catch(error => {
              console.log(error);
            })
          }
          else if (item3 === props.postId) {
            firestore()
            .collection('users')
            .doc(myID)
            .update({
              // eventMembersList: firestore.FieldValue.arrayUnion(myID),
              EventWishList: firestore.FieldValue.arrayRemove(props.postId),
            }).then(res => {
              Alert.alert('Removed From Wish List')
            }
        
            ).catch(error => {
              console.log(error);
            })

            
          }

        });

      } else {
        firestore()
        .collection('users')
        .doc(myID)
        .update({
          // eventMembersList: firestore.FieldValue.arrayUnion(myID),
          EventWishList: firestore.FieldValue.arrayUnion(props.postId),
        }).then(res => {
          console.log("Another member requested to Join event :: " + myID);
          Alert.alert('Added To Wish List')
        }
    
        ).catch(error => {
          console.log(error);
        })
      }

      // myEventLikes = await firestore().collection('events').doc(props.postId)
      // .get()
      // .then(snapshot => {
      //   tempLikes = snapshot._data.likes;
      //   tempMyEventLikes = snapshot._data.eventMembersList;
      //   console.log("My Event Likes list :: " + tempLikes);
      //   // setMyTotalEventReq(tempLikes);
      //   setTotalEventLikes(tempMyEventLikes);

      //   // setTotalEventMembers(tempLikes.length);
      //   console.log("My total Event Likes :: " + tempLikes.length);
      //   console.log("My total Event Likes in state :: " + totalEventLikes);
      //   // getJoinStatus();
      // })
      // .catch(error => {
      //   console.log(error)
      // });
      
    setLikeButton(!likeButton);
  }
  const getWishListStatus = (item) => {
    let status = false;
        // allevents && allevents.map((item)=>{
          if(tempMyWishListOverall !== undefined){
            tempMyWishListOverall.map(item2=>{
        
              if(item2 === item.postId){
                console.log('my wish List Ids  === ',item2)
                status = true
              }
      
            })
          }else{
            status=false
          }
          
    //  })
    // console.log("like status : "+status);
    // setLikeButton(!likeButton);
    return status;

  }

  const SelectedEventInModal = (props) => {
    setLoading(true);
      
    // console.log('My Location Distance from Event ==== '+myDistanceFromEvent);
    const dateEventPosted = new Date((props.selectedEvent.postTimeDate.seconds + props.selectedEvent.postTimeDate.nanoseconds / 1000000000) * 1000);

    // // // let dateEevenPosted
    const dt = new Date(dateEventPosted);
    const x = dt.toISOString().split("T");
    // console.log('splitted time ' + x[0]);
    // console.log('splitted time 2' + );

    const x1 = x[0].split('-');
    // console.log('event date'+eventDate);
    const x2 = props.selectedEvent.eventDate.split('/')
    // console.log(x1[2] + "/" + x1[1] + "/" + x1[0]);
    // console.log(x2[2] + "/" + x2[1] + "/" + x2[0]);
    console.log('Event Date Time ===='+x1[0] + "/" + x1[1] + "/" + x1[2]);
    seteventPostDateTime(x1[0] + "/" + x1[1] + "/" + x1[2]);

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    const currentDate = yyyy + '/' + mm + '/' + dd;
    console.log("both dates === Current Date: " + currentDate, "Event Date: "+x2[2] + "/" + x2[1] + "/" + x2[0])
    if(x2[0] >= yyyy.toString() && x2[1] >= mm){
    if (x2[1] > mm) {
      // console.log('date gone')
      setEventStatus('Active')
    }
    if (x2[1] == mm) {
      if (x2[0] > dd) {
        // console.log('date gone')
        setEventStatus('Active')
        // console.log('Active')

      } else {
        setEventStatus('Expired')
        // console.log('Expired' + x2[0] + ' < ' + dd)
      }
      console.log('Active' + x2[1] + ' > ' + mm)

    } else if (x2[1] < mm) {
      setEventStatus('Expired')
      // console.log('Expired' + x2[1] + ' < ' + mm)
    }
  }else{
    setEventStatus('Expired')
  }
    var myDistanceFromEvent = getDistance(
      { latitude: props.selectedEvent.eventLocation.latitude, longitude: props.selectedEvent.eventLocation.longitude },
      { latitude: myLat, longitude: myLong }
      // { latitude: myData.myLocation.latitude, longitude: myData.myLocation.longitude }
    );
    myDistanceFromEvent = myDistanceFromEvent / 10000;

  setMyDistance(myDistanceFromEvent);
  
  

  
  console.log("Event Status : "+eventStatus)
  setLoading(false);
    return (
      <View style={{
        justifyContent: 'center', alignItems: 'center', height: '95%', marginVertical: 20
      }}>
        {/* <ScrollView> */}
        <View style={{
          height: '97%', width: '97%', backgroundColor: '#1e1e1e', borderRadius: 20,
          borderWidth: 1, borderColor: 'orange'
        }}>
         
          <View style={styles.mainContainer}>


            {
              // this.state.ImageURI !== '' ? <Image source={this.state.ImageURI} /> :null
              props.selectedEvent.profileImage === '' ?
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
           <TouchableOpacity style={{marginLeft:160, marginTop:10}} onPress={()=>setEventModal(false)}>
           <Image source={require('../Images/close.png')}
                        style={{ width: 30, height: 30, alignSelf:'flex-end',tintColor: 'red', marginRight:20 }}
                      />
           </TouchableOpacity>
            
          </View>
          <View>
            <Text numberOfLines={2} ellipsizeMode='tail' style={{ color: '#fff', marginLeft: 25, marginVertical: 10 }}>
              {props.selectedEvent.eventDescription}</Text>
          </View>
          <View>
            <Text style={{ color: '#fff', marginLeft: 25, marginVertical: 10 }}>
              {props.selectedEvent.caption}</Text>
          </View>

          <View>
            {
              props.selectedEvent.img !=="" ?
                          <Image
                          // source={require('../Images/back.png')}
                           source={{ uri: props.selectedEvent.img }}
                            style={[styles.postImage, { width: '100%', height: 240, borderRadius:1}]}
                            />
                          :
                          <View style={[styles.postImage, { width: '100%', height: 240, borderRadius:1, marginRight:5}]}>
                            <Video source={{ uri: props.selectedEvent.video }}
                            style={[styles.postImage, { width: '100%', height: 240, borderRadius:1, marginRight:5 }]}
                            paused={false}
        // style={styles.backgroundVideo}
                            autoplay={true}
                            repeat={true}
                            muted={false}
                            volume={1.0}
                          />
                          </View>
            }


          </View>
          
          <View style={[styles.detailBox, {
            marginLeft: 20, borderWidth: 0,
            marginVertical: 5, justifyContent: 'space-evenly', backgroundColor: 'black'
          }]}>
            <TouchableOpacity onPress={() => { setEventModal(false) }}>
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
            props.selectedEvent.userId !== myUserId
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
                onPress={() => getJoinStatus() ? Alert.alert('Request Has Already Been Sent'): [JoinEventFtn(selectedEvent),getFcmTokenFunction(selectedEvent)]}
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
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 140 }}>
            <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
              {
                myDistance !== null ? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
                  Event Distance : {myDistance} miles away
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
                    Maximum Participants : {props.selectedEvent.members}
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
                eventName !== null ? <Text
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
  // console.warn(searchResult)
  const filterEvents = () => {
    let tempList = postData.sort((a, b) => a.eventName > b.eventName ? 1 : -1);
    // let tempList = postData.sort((a,b)=> a.age - b.age);
    flatListRef.current.scrollToIndex({ animated: true, index: 0 })
    setPostData(tempList)
  }
  const searchEvents = async (text) => {
    if (text === '' || searchResult==='') {
      setPostData(postData);
    } else {
      let tempList = allevents.filter(item => {
        return item.eventName.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
      setPostData(tempList);
    }
    
// setUpdateState(!updateState)
  }
  const searchEventClose=()=>{
    setUpdateState(!updateState)
  }
  return (
    <View style={{ height: '100%', width: '100%', backgroundColor:'black'
     }}>
      {/*  */}
      {/* <Video source={require('../Images/video.mp4')}
        paused={false}
        style={styles.backgroundVideo}
        autoplay={true}
        repeat={true}
        muted={false}
        volume={1.0}

        resizeMode={'cover'}
      /> */}
      <Loader visible={Loading} />
      <View style={styles.container}>

        
        <View style={styles.heading}>
          <View style={{
            justifyContent: 'space-between',
            borderRadius: 25, flexDirection: 'row'
          }}>
            <TouchableOpacity
              onPress={() => setFilterModal(true)}
              style={{ flexDirection: 'row' }}
            >
              <View style={{
                height: 50, width: 90, backgroundColor: '#202A44',
                flexDirection: 'row', borderRadius: 10, justifyContent: 'center',
                alignItems: 'center', borderWidth: 1, borderColor: 'orange'
              }}>


                <Image source={require('../Images/filter.png')}
                  style={{ height: 30, width: 30, tintColor: 'white' }}
                />
                <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>
                  Filter
                </Text>
              </View>

            </TouchableOpacity>
            <View style={{
              flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: 200, height: 40,
              borderColor: 'white', borderWidth: 2,
              margin: 10, borderRadius: 15, marginLeft:60
            }}>
              <Image style={{ width: 20, height: 20, margin: 10, marginLeft: 15, tintColor: 'white' }} source={require('../Images/explore.png')} />
              <TextInput
                placeholder='Search'
                placeholderTextColor={'white'}
                style={{ fontSize: 20, padding: 8, width: 150, color: 'white' }}
                value={searchResult}
                onChangeText={(text) => { setSearchResult(text), searchEvents(text) }}
              />
              <TouchableOpacity style={{ padding: 8, marginRight: 10 }} onPress={() => { searchEvents(''), setSearchResult(''), searchEventClose() }}>
                <Image style={{ width: 20, height: 20, tintColor: 'white' }} source={require('../Images/close.png')} />
              </TouchableOpacity>
            </View>
            



          </View>


          {
            /*
            
            */
          }

        </View>


        {

          // netInfo.isConnected ?
          // postData.length > 0 ?
                    // allevents && allevents
              postData.length > 0 ?
            <FlatList
              data={postData}
              ref={flatListRef}
              initialScrollIndex={flatListIndex}
              showsVerticalScrollIndicator={false}
              // numColumns={2}
              // keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={{// flex: 1, marginRight:50,
                      //flexDirection: 'column', 
                    //  margin: 5,
                       marginVertical: 30, height: 480, width:'100%' }}
                  //  style={{flex:1, flexDirection:'row', justifyContent:'center',
                  // alignItems:'center', alignContent:'space-between'
                  // }}
                  >

                  
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '100%',
                          width: '100%',
                          borderWidth: 1,
                          // borderRadius:30,
                          borderColor: 'transparent'
                        }}
                      //   // marginBottom: postData.length - 1 == index ? 40 : 20,

                      >
                        
                        <View style={{
                          //flex: 1,
                          
                          width: '100%', height: '90%',
                      //    borderWidth: 2, borderColor: 'transparent', //borderRadius: 20
                        }}>
                        {
                          item.img !=="" ?
                          <Image source={{ uri: item.img }}
                            style={styles.postImage}
                            />
                          :
                          <View style={{flex:1, height:'100%', width:'100%', backgroundColor:'black'}}>
                            <Video source={{ uri: item.video }}
                            style={{flex:1, width: '100%',
                            height: '100%',// borderRadius: 30,
                            borderWidth: 1,
                            borderColor: 'black',}}
                            paused={false}
        // style={styles.backgroundVideo}
                            autoplay={true}
                            repeat={true}
                            muted={false}
                            volume={1.0}
                          />
                          </View>
                          
                        }

                          
                          {/* <View style={{
                            position: 'absolute',
                            justifyContent: 'center', alignItems: 'center', width: '90%', height: 50, borderWidth: 1, opacity: 0.5,
                            borderColor: 'black', borderRadius: 20, marginLeft: 8, marginTop: 10,
                            backgroundColor: '#1e1e1e'
                          }}>

                          </View> */}
                          <View style={{
                            position: 'absolute',
                            justifyContent: 'center', alignItems: 'center', width: '90%', height: 50, borderWidth: 1, opacity: 1,
                            borderColor: 'black', borderRadius: 20, marginLeft: 20, marginTop: 10, backgroundColor: '#1e1e1e'
                          }}>

                            <View style={{
                              flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '100%',
                              marginRight: 50
                            }}>
                              <View style={{ flexDirection: 'row' }}>
                                <Image
                                  source={
                                    item.profileImage !== '' ?
                                      { uri: item.profileImage }
                                      :
                                      (require('../Images/user.png'))
                                  }
                                  style={[styles.userImage, { margin: 5, marginLeft: 40 }]}
                                />

                                <Text numberOfLines={1} style={[styles.userName, { marginRight: 10, fontSize: 20, marginTop: 5 }]}>
                                  {item.name}
                                  {/* {distanceData[0]} */}
                                </Text>
                              </View>


                              <Text numberOfLines={1} style={[styles.userName, { fontSize: 10 }]}>
                                {moment(item.postTimeDate.toDate()).fromNow()}
                              </Text>


                            </View>


                          </View>
                          <View style={{
                            position: 'absolute', marginTop: 130,
                            justifyContent: 'center', alignItems: 'center', width: '90%', height: 150, marginLeft: 15,
                            borderWidth: 1, borderColor: 'red', borderRadius: 20, backgroundColor: 'black'
                            , opacity: 0.5
                          }}></View>
                           <TouchableOpacity
                      // onPress={()=>calculatePreciseDistance(item)}
                      onPress={() => selectedEventModal(item)}
                      style={{
                        position: 'absolute', marginTop: 130,
                        justifyContent: 'center', alignItems: 'center', width: '90%', height: 150, marginLeft: 15,
                        borderWidth: 1, borderColor: 'black', borderRadius: 20,
                      }}
                    >
                          <View 
                          // style={{
                          //   position: 'absolute', marginTop: 130,
                          //   justifyContent: 'center', alignItems: 'center', width: '90%', height: 100, marginLeft: 15,
                          //   borderWidth: 1, borderColor: 'black', borderRadius: 20,
                          // }}
                          >
                            <Text style={{ fontSize: 30, color: 'white', opacity: 1, fontWeight: '600' }}>{item.eventName}</Text>
                            <Text style={{ fontSize: 20, color: 'white', opacity: 1, fontWeight: '600', alignSelf:'center', marginVertical:10 }}>More Info</Text>
                          </View>
                          </TouchableOpacity>
                        </View>

                        <View style={{height:100, width:'100%', backgroundColor:'black', 
                        justifyContent:'space-between',flexDirection:'row'}}>
                          <View style={{flexDirection:'row'}}>
                            <View>
                            <TouchableOpacity onPress={()=>EventLikeFtn(item)}>
                          
                          {
                            getLikeStatus(item)
                            ?
                            <Image source={(require('../Images/heartOn.png'))}
                          style={{height:35, width:35, tintColor:'red',margin:10}}
                          />
                          :
                          <Image source={(require('../Images/heart.png'))}
                          style={{height:35, width:35, tintColor:'white',margin:10}}
                          />
                          }
                        </TouchableOpacity>
                        {
                          item.likes.length > 0
                          ?
                          <Text style={{color:'white', fontSize:14, margin:10}}>{item.likes.length} likes</Text>
                          :
                          // <Text style={{color:'white', fontSize:14, margin:10}}>0 likes</Text>
                          null

                        }
                        
                            </View>
                          
                        <TouchableOpacity>
                          
                          <Image source={(require('../Images/comment.png'))}
                          style={{height:35, width:35, tintColor:'white',margin:10}}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity>
                          
                          <Image source={(require('../Images/send.png'))}
                          style={{height:35, width:35, tintColor:'white',margin:10}}
                          />
                        </TouchableOpacity>
                          </View>
                          <View>
                          <TouchableOpacity onPress={()=>AddToWishListFtn(item)}>
                          {
                            getWishListStatus(item)?
                            <Image source={(require('../Images/wishlistAdded.png'))}
                          style={{height:35, width:35,margin:10}}
                          />
                            :
                            <Image source={(require('../Images/wishList.png'))}
                            style={{height:35, width:35, tintColor:'white',margin:10}}
                            />
                          }
                          
                         
                        </TouchableOpacity>
                        <Text style={{color:'white'}}>Wishlist</Text>
                          </View>
                          
                       </View>

                      </View>
                    

                    <GestureRecognizer
                      style={{ flex: 1 }}
                      // onSwipeUp={() => setEventModal(true)}
                      onSwipeDown={() => setEventModal(false)}
                     // onSwipeRight={() => setEventModal(false)}
                    >
                    <Modal visible={eventModal} onRequestClose={() => { setEventModal(false); }}>
                      <View style={{ backgroundColor:'black' }}>
                        <ScrollView>
                          <SelectedEventInModal selectedEvent={selectedEvent} />
                        </ScrollView>
                      </View>
                    </Modal>
                    </GestureRecognizer>
                 
                  </View >

                )
              }}

            />


            :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: 'white' }}>Please Expand Your Search</Text>
            </View>
          // :

          // <View>
          //   <Text style={{ fontSize: 25, color: 'white' }}>Please Connect to Internet</Text>
          // </View>
        }




      </View >
      <Modal
        visible={filterModal}
        transparent={true}
        onRequestClose={() => setFilterModal(false)}
        style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'flex-end', alignItems: 'flex-end', alignContent: 'flex-end' }}
      >
        <View style={{ flex: 1, alignSelf: 'flex-end', justifyContent: 'flex-end', alignItems: 'flex-end', height: '50%', width: '100%' }}>
          <View style={{
            backgroundColor: 'white', alignSelf: 'flex-end', height: '95%', width: '100%', justifyContent: 'center', alignItems: 'center',
            borderTopLeftRadius: 30, borderTopRightRadius: 30, borderWidth: 4, borderColor: 'purple'
          }}>
            <View style={{ width: '90%', height: '90%', backgroundColor: 'white', marginBottom: 110, marginTop: 40 }}>
              {/* <Text style={{ fontSize: 20, fontWeight: '700', color: '#707070', margin: 20 }}>Gender</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => { setFilterGender('Male'); setFilterGenderAll(''); }}
                  style={{
                    marginLeft: 10, width: 100, height: 50,
                    backgroundColor: filterGender == 'Male' ? 'blue' : '#909090',
                    borderRadius: 20, justifyContent: 'center', alignItems: 'center'
                  }}>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: '500' }}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { setFilterGender('Female'); setFilterGenderAll(''); }}
                  style={{
                    width: 100, height: 50,
                    backgroundColor: filterGender == 'Female' ? 'blue' : '#909090',
                    borderRadius: 20, justifyContent: 'center', alignItems: 'center'
                  }}>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: '500' }}>Female</Text>
                </TouchableOpacity >
                <TouchableOpacity
                  onPress={() => { setFilterGenderAll('Both'); setFilterGender('') }}
                  style={{
                    marginRight: 5, width: 100, height: 50,
                    backgroundColor: filterGenderAll == 'Both' ? 'blue' : '#909090',
                    borderRadius: 20, justifyContent: 'center', alignItems: 'center'
                  }}>
                  <Text style={{ color: 'white', fontSize: 20, fontWeight: '500' }}>Both</Text>
                </TouchableOpacity>

              </View> */}
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
                    onPress={() => [userFilterData()]}
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
    </View >
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 70,
    width: '100%',
    alignSelf: 'center',
    margin: 10, 
    paddingBottom: 10,
    // backgroundColor: 'white',
    borderRadius: 20,
    // marginBottom: postData.length - 1 == index ? 40 : 20,
    height: '100%',
    // borderWidth:2,
    // borderColor:'orange',
  },
  heading: {
    borderBottomWidth: 1,
    borderColor: 'black',
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
    // backgroundColor: 'white'
  },
  mainContainer: {
    width:'100%',
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
    // borderRadius: 25,
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
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: '100%',
    width: '100%',
  },
  userButton: {
    backgroundColor: '#4867A9',
    borderRadius: 10,
    height: 35,
    width: 110,
    marginLeft: 10
  }
});

export default EventsScreen



// const userFilterData = () => {
//   let tempData = [];
//   let distanceValuesToPush
//   let distanceArray = []

//   firestore().
//     collection("events")
//     // .where('id', '!=', 'userId')
//     .get()

//     .then(
//       querySnapshot => {
//         querySnapshot._docs.map(results => {

//           //  console.log('all event data if available  '+results._data.eventLocation.latitude, results._data.eventName)
//           let distanceValue = getDistance(
//             { latitude: results._data.eventLocation.latitude, longitude: results._data.eventLocation.longitude },
//             { latitude: myData.myLocation.latitude, longitude: myData.myLocation.longitude }
//           );
//           distanceValuesToPush = distanceValue / 1000;

//           // distanceArray.push(distanceValuesToPush)
//           // console.log('Distance = '+distanceValue/1000+' Kms')
//           // if (item._data.id !== userId) {

//           // distanceArray.map((finalData, index)=>{
//           console.log('all distance values ' + distanceValuesToPush);

//           if (distanceValuesToPush >= minDistance && distanceValuesToPush <= maxDistance) {

//             if (filterGenderAll == '') {
//               if (
//                 // item._data.age >= minAge && item._data.age <= maxAge &&
//                 results._data.gender == filterGender && results._data.interest == selectedInterest) {
//                 tempData.push(results._data);
//                 console.log("temp users event iMage for both:" + results._data.eventName, distanceValuesToPush);
//                 distanceArray.push(results._data.eventName)
//                 setPostData(tempData);
//                 <ExploreEvents Filter='this is filter data' />

//                 // console.log('Final data after filter '+postData);
//               }
//             }
//             else if (
//               // item._data.age >= minAge && item._data.age <= maxAge &&
//               results._data.gender == results._data.gender && results._data.interest == selectedInterest) {

//               tempData.push(results._data);
//               console.log("temp users profile iMage for one:" + results._data.eventName, distanceValuesToPush);
//               setPostData(tempData);
//               <ExploreEvents Filter='this is filter data' />
//               // console.log('Final data after filter '+postData);
//               distanceArray.push(results._data.eventName)
//             }

//           }
//           else {
//             setPostData(eventData);
//             <ExploreEvents Filter='this is filter data' />

//             // setPostData(0);
//           }



//         }

//         );


//         console.log('i am done with data ' + tempData.length)
//       }
//     );

//   console.log('i dont know why my posted data ' + postData)
//   setFilterModal(false);
//   setRefVisible(true);
//   console.log(props.childRef);
// }