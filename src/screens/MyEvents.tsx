import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert, Modal, TextInput, ScrollView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Notifications from './Notifications';
import notifee, { AndroidColor, AndroidImportance, AndroidStyle } from '@notifee/react-native';
import axios from 'axios';
// import messaging from '@react-native-firebase/messaging';
import Loader from './Loader';
import { useRoute, useNavigation, StackActions } from '@react-navigation/native';
import GestureRecognizer from 'react-native-swipe-gestures';
import DateTimePickerModal from "react-native-modal-datetime-picker";
// import HTMLView from 'react-native-htmlview';
import Video from 'react-native-video';
import PostEvent from './PostEvent';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from "react-redux";
import { getMyUserDataAction, getUsersInitiate } from '../Redux/actionsUser';
import { getAllEventsInitiate } from '../Redux/actionsEvents';
import { EventJoinRequestApproveNotificationSend } from '../Redux/actionsNotification';
import { current } from '@reduxjs/toolkit';

//later
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// });
// messaging().getInitialNotification();

const arabic = "&#129392"

let isLikedBy = '';
const MyEvents = (props) => {
  const navigation = useNavigation();
  const [postData, setPostData] = useState([]);
  const [likeButton, setLikeButton] = useState(false);
  const [myUserId, setMyUserId] = useState('');
  const [totalEventMembers, setTotalEventMembers] = useState();
  const [eventModal, setEventModal] = useState(false);
  const [Loading, setLoading] = useState(false);

  const [updateState, setUpdateState] = useState(false);

  const [myEventMembersList, setMyEventMembersList] = useState(null);
  const [eventMembersModal, setEventMembersModal] = useState(false);

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
  const [eventNotificationSentContent, setEventNotificationSentContent] = useState('');
  const [eventNotificationCount, setEventNotificationCount] = useState(0);
  const [eventPostDateTime, seteventPostDateTime] = useState('');
  const [eventOwnerUserName, setEventOwnerUserName] = useState('');
  const [eventOwnerProfileImage, seteventOwnerProfileImage] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventMembersDatalist, setEventMembersDataList] = useState([]);
  const [eventMembersRequestlist, setEventMembersRequestList] = useState([]);
  const [eventMembersRequestlistIDS, setEventMembersRequestListIDS] = useState([]);
  const [eventRequestModal, setEventRequestModal] = useState(false);
  const [eventMembersListModal, setEventMembersListModal] = useState(false);

  /// For Update Section
  const [nameUpdateText, setNameUpdateText] = useState('');
  const [showNameSection, setShowNameSection] = useState(false);
  const [descriptionUpdateText, setDescriptionUpdateText] = useState('');
  const [showDescriptionSection, setShowDescriptionSection] = useState(false);
  const [memberNumberUpdate, setMemberNumberUpdate] = useState('0');
  const [showMemberUpdateSection, setShowMemberUpdateSection] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateModal, setDateModal] = useState(false);

  const [timeModal, setTimeModal] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  // const [eventDate, setEventDate] = useState('');
  // const [eventTime, setEventTime] = useState();
  ///
  const [deleteEventModal, setDeleteEventModal] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(undefined);

  const [getEventId, SetGetEventId] = useState('');

  const [getAllEventData, SetGetAllEventData]=useState([]);

  const [requestTempId, setRequestTempId]=useState([]);

  const [memberTempId, setMemberTempId]=useState([]);

  // const [eventFcmToken, setEventFcmToken] = useState('');
  const [userList, setUserslist] = useState([]);

  let UserId = '';
  let myProfileImage = '';

  let tempData = [];
  let myPostId = '';
  let myUserName = '';

  const [selectedId, setSelectedId] = useState('');
  const [usersDataForRequests, setUsersDataForRequests] = useState([]);
  const [usersDataForMembers, setUsersDataForMembers] = useState([]);

  const dispatch = useDispatch();
  //later
//   useEffect(() => {
//     const unsubscribe = messaging().onMessage(async remoteMessage => {
//       // Alert.alert('A new FCM message arrived! in foreground mode', JSON.stringify(remoteMessage.notification?.body));
    
//       displayNotification(remoteMessage);
//     });
// messaging().onNotificationOpenedApp(async remotemMessage =>{
//   if(!!remotemMessage?.data && remotemMessage?.data?.redirect_to == "EventJoin")
//   console.log('navigate to == ',props.selectedTab)
//   setTimeout(()=>{
// console.log('we are redirectting to screen Admin Dashboard for notification management %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
// //navigateTo event Join Screen
// },1200)
// })
//     return unsubscribe;
//   }, []);

  useEffect(() => {
    getUserId();
    dispatch(getMyUserDataAction());
    dispatch(getUsersInitiate());
    dispatch(getAllEventsInitiate());
    // SetGetAllEventData(props.allpostData);
    // getEventData();
    // GetMyEventData();
  }, [updateState, likeButton])
  const getUserId = async () => {
    UserId = await AsyncStorage.getItem("USERID");
    myProfileImage = await AsyncStorage.getItem('profileImage');
    myUserName = await AsyncStorage.getItem("NAME");
    setMyUserId(UserId);
    console.log("my user id stored in my event screen dashboard :: " + UserId, myProfileImage, myUserName);
  }
  const {mydata} = useSelector(state => state.myUserData);
  
  let myID = "";
  let myName = "";
  let myImage = "";

  mydata && 
  mydata.map(item=>{
   myID = item.id;
   myName = item.name;
   myImage = item.profileImage;
  })
  //later
  // const displayNotification = async (data) => {
  //   // Request permissions (required for iOS)
  //   if(Platform.OS == 'ios'){
  //     await notifee.requestPermission()
  //   }
    

  //   // Create a channel (required for Android)
  //   const channelId = await notifee.createChannel({
  //     id: 'default10',
  //     name: 'Default Channel10',
  //     sound:'whistle',
  //     importance:AndroidImportance.HIGH,
  //     vibration:true,
  //     vibrationPattern: [300, 500],
  //     lights: true,
  //     lightColor: AndroidColor.RED,
  //   });

  //   // Display a notification
  //   await notifee.displayNotification({
  //     title: data.notification.title,
  //     body: data.notification.body,
  //     android: {
  //       channelId,
  //       smallIcon: 'ic_small_icon', // optional, defaults to 'ic_launcher'.
  //       // pressAction is needed if you want the notification to open the app when pressed
  //       pressAction: {
  //         id: 'default',
  //       },
  //       style: 
  //       { type: 
  //           AndroidStyle.BIGPICTURE, picture: myImage,
  //       },
  //     },
  //   });
  // }




  const {allevents} = useSelector(state => state.eventData);
  const {users} = useSelector(state => state.myUserData);
  const {myRequests} = useSelector(state => state.eventData);
  useEffect(() => {
    let tempData = [];
    console.log('all req Id&&&&&&&&&&&&& ',myRequests)
    allevents && allevents.map((item)=>{
      console.log('all req Id&&&&&&&&&&&&& ',item.userId)
    //   if(item.postId === selectedId){
    //     item.eventMembersList.map(itemMem=>{
    //         // if(itemMem.length > item.members){
    //       item.eventJoinRequests.map(itemReq=>{
        
    //     //  item.eventJoinRequests && 
    //     if(itemMem === myID && itemReq !== myID){
    //       setJoinStatus(2);
    //       console.log('join status mem Id***********&&&&&&&&&&&&&', item.eventName)
    //       console.log('joined mem Id***********&&&&&&&&&&&&& Status == ',checkJoinStatus)
    //       console.log('all mem Id***********&&&&&&&&&&&&& ',itemMem)
          
    //     }else if(itemReq === myID && itemMem !== myID){
    //       setJoinStatus(1)
    //       console.log('all req Id***********&&&&&&&&&&&&& ',itemReq)
    //       console.log('all req Id***********&&&&&&&&&&&&& Status == ',checkJoinStatus)
    //        console.log('join status req Id***********&&&&&&&&&&&&&', item.eventName)
    //        console.log('join status req Id***********&&&&&&&&&&&&&', item.eventJoinRequests)
    //     }
    //     else if(itemReq !== myID && itemMem !== myID){
    //       setJoinStatus(0)
    //       console.log('join status req Id not found ***********&&&&&&&&&&&&&', item.eventName)
    //       console.log('join status req Id not found ***********&&&&&&&&&&&&& status == ',checkJoinStatus )
    //       console.log('join status req Id not found ***********&&&&&&&&&&&&&', item.eventJoinRequests)
          
    //     }else{
    //       setJoinStatus(11);
    //     }
    //   })
    // // }else{
    // //   setJoinStatus(3)
    // // }
    //     }) 
    //   }
    //   
      if(item.userId === myID){
        tempData.push(item)
        console.log('My Event Data = ', item)
      }
     })
     setPostData(tempData);
     let tempUsers = []
      users && users.map((item)=>{
        // console.log('All User Data Direct == ',userList)
        // if(item.id!==myID){
          tempUsers.push(item)
        // }
      })
      setUserslist(tempUsers)
     
  }, [allevents, updateState, myRequests, selectedId])
  const GetMyEventData=()=>{
    let myEventsData = []
    // console.log('my events data in my state '+getAllEventData)
    getAllEventData.map(data=>{
    // console.log('all events data in my events screen '+data.userId)
      if(data.userId == auth().currentUser?.uid)
      {
        // console.log('my events screen user id '+data.userId)

        myEventsData.push(data)
        // console.log('all my data in my events '+myEventsData)    
      }
    })    
    setPostData(myEventsData)
    // console.log('my events data in my events screen '+myEventsData)
    
    setUpdateState(true);
  }
  const [tempDataReq, setTempDataReq] = useState([]);
  const GetRequestForMyEvents=()=>{
    let tempRequests = []
    let tempUsers = []
    allevents.map((item)=>{
      if(item.postId === selectedId ){
        // console.log('user data for rquest == ', item.eventJoinRequests)
        // tempRequests.push(item.eventJoinRequests)
            // console.log('user data for rquest == ', tempRequests)
    
    // setTempDataReq(tempRequests)
    users && users.map((item2)=>{
      console.log('all user data from User == ', item2.id)
      item.eventJoinRequests.map(item4=>{
      console.log('all user data for rquest == ', item4)
      // tempRequests.push(item.eventJoinRequests)
    if(item2.id === item4){
      tempUsers.push(item2)
      console.log('my user data for rquest == ', item2.id)
    }
      })
  })
      }
  
})
  console.log('myfor rquest == ', tempUsers)

    setUsersDataForRequests(tempUsers);
    setEventRequestModal(true);
    setUpdateState(!updateState);
  }
  const [currentEventName, setCurrentEventName] = useState();
  const ApproveRequestForEvent=(requestId)=>{
    let tempCheck = [];
    let tempMembers = [];
    let eventNameHere = ''
    let memberID;
            firestore()
              .collection('events')
              .doc(selectedId)
              .update({
                eventMembersList: firestore.FieldValue.arrayUnion(requestId),
                eventJoinRequests: firestore.FieldValue.arrayRemove(requestId),

              }).then(res => {
                console.log("Event member request approved :: " + requestId);
               firestore()
      .collection('events')
      .doc(selectedId)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);
        tempMembers.push(documentSnapshot.data().eventjoinRequests);
        
        
        // if (documentSnapshot.exists) {
        //   console.log('User data for events: ', documentSnapshot.data());
        //   console.log('User data for event name:: ', documentSnapshot.data().eventName);
         
        //   console.log('all joined memebers ' + documentSnapshot.data().eventJoinRequests.length)
        // }
     
      
              })
              // setUsersDataForRequests(tempMembers);
              }

              ).catch(error => {
                console.log(error);
              })
              console.log('THis Event Name +++++++++++ ',currentEventName)
              Alert.alert('Member Request Accepted');
              setEventRequestModal(false);
              setUpdateState(!updateState);
            //later
              // getFcmTokenForNotification(requestId, currentEventName);
  }
  const getFcmTokenForNotification=(requestId, currentEventName)=>{
    console.log('user list data for notification == '+userList)
    let fcmToken;
    userList.map(item=>{
      if (item.id === requestId){
        fcmToken = item.fcmToken
        console.log('id of poster == ',item.id)
      }
      // if (item.id === myID){
      //   fcmToken = item.fcmToken
      //   console.log('My Id Here On Join Pressed == ',item.id)
      // }
    })
    setEventFcmToken(fcmToken);
    console.log('My FcmToken Here On Join Pressed == ',eventFcmToken)
    dispatch(EventJoinRequestApproveNotificationSend(currentEventName,fcmToken,myName));
  }
  const DeleteRequestForEvent = async(memberID) => {

    let tempCheck = [];
            firestore()
              .collection('events')
              .doc(selectedId)
              .update({
                eventJoinRequests: firestore.FieldValue.arrayRemove(memberID),

              }).then(res => {
                console.log("Event member request Deleted :: " + memberID);
              }

              ).catch(error => {
                console.log(error);
              })
         
              setEventRequestModal(false);
              Alert.alert('Event Member Request Deleted Successfully')
        
             setUpdateState(!updateState);

  }
  const GetMembersListForEvent=()=>{
    let tempMembers = []
    let tempUsers = []
    allevents.map((item)=>{
      if(item.postId === selectedId ){
        // console.log('user data for rquest == ', item.eventMembersList)
        // tempMembers.push(item.eventMembersList)
            // console.log('user data for rquest == ', tempMembers)
    
    // setTempDataReq(tempMembers)
    users && users.map((item2)=>{
      console.log('all user data from User == ', item2.id)
      item.eventMembersList.map(item4=>{
      console.log('all user data for rquest == ', item4)
      // tempMembers.push(item.eventMembersList)
    if(item2.id === item4){
      tempUsers.push(item2)
      console.log('my user data for rquest == ', item2.id)
    }
      })
  })
      }
  
})
  console.log('myfor rquest == ', tempUsers)

    setUsersDataForMembers(tempUsers);
    setEventMembersListModal(true);
    setUpdateState(!updateState);
  }
  const DeleteMemberForEvent = async (memberID) => {
    let tempCheck = [];
            firestore()
              .collection('events')
              .doc(getEventId)
              .update({
                eventMembersList: firestore.FieldValue.arrayRemove(memberID),
              }).then(res => {
                console.log("Event member deleted :: " + memberID);
              }
              ).catch(error => {
                console.log(error);
              })
         setEventMembersListModal(false);
         setEventMembersModal(false);
          Alert.alert('Event Member Deleted Successfully')
          setUpdateState(!updateState);
  }
  const getEventData = async () => {

    // UserId = await AsyncStorage.getItem("USERID");

    setLoading(true)
    await firestore()
      .collection('events')
      .get()
      .then(querySnapshot => {
        // console.log('Total posts: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.data().userId == myUserId) {
            tempData.push(documentSnapshot.data());
            console.log('All Events Posted: ', documentSnapshot.id, documentSnapshot.data());
            console.log('all user id ' + documentSnapshot.data().userId);
          }
          setPostData(tempData);
          setLoading(false)
          setUpdateState(true)
          // postData.map(item4=>{
          //   myPostId = item4.postId;
          //   console.log('My post id here '+myPostId)
          // })
          if (tempData.userId == myUserId) {
            console.log("My Events :: " + tempData.length)
          }
        });

      });
    // setUpdateState(!updateState)
  }


  const updateEventName = async (selectedId) => {
    if (nameUpdateText !== '') {
      await firestore().collection('events').doc(selectedId).update({
        eventName: nameUpdateText,
      })
        .then(() => {
          console.log('Post added');
          setShowNameSection(false);
          setEventName(nameUpdateText);
        })
    } else {
      Alert.alert('Name Field Can Not Be Empty');
    }
    setUpdateState(!updateState);
  }
  const updateEventDescription = async (selectedId) => {
    if (descriptionUpdateText !== '') {
      await firestore().collection('events').doc(selectedId).update({
        eventDescription: descriptionUpdateText,
      })
        .then(() => {
          console.log('Post added');
          setShowDescriptionSection(false);
          setEventDescription(descriptionUpdateText);
        })
    } else {
      Alert.alert('Description Field Can Not Be Empty');
    }
    setUpdateState(!updateState);
  }
  const updateEventTotalMembers = async () => {
    if (memberNumberUpdate !== 0) {
      await firestore().collection('events').doc(selectedId).update({
        members: memberNumberUpdate,
      })
        .then(() => {
          console.log('Post added');
          setShowMemberUpdateSection(false);
          setMemberNumberUpdate(memberNumberUpdate);
        })
    } else {
      Alert.alert('Name Field Can Not Be Empty');
    }
    setUpdateState(!updateState);
  }
 
  

  
  
  
  const getFcmTokenFunction=async(props)=>{
    let eventOwnerToken;
    let eventTokenData = [];
    eventTokenData = await firestore().collection('users').doc(props.userId)
        .get()
        .then(snapshot => {
          eventOwnerToken = snapshot._data.fcmToken;
          console.log("Event owner Fcm Token **************************:: " + eventOwnerToken);
  
          setEventFcmToken(eventOwnerToken);
          console.log("Event TOken From USer DBBB ****))()(*)(*) " + eventFcmToken);
        })
        .catch(error => {
          console.log(error)
        });
  
  
      console.log("User ID OF Event Poster ************************** " + props.userId);
      console.log("event name ********************** = "+props.eventName)
      
   //   sendNotificationEventJoined(eventFcmToken, props);
  }
  const viewLaterFunction = () => {
    setEventModal(false);
    // setEventMembersDataList([]);
  }
  //   const navigateMessageScreen = async (modalData) => {
  //     setLoading(false);

  //     setShowOtherUserInfoModal(false);
  //     navigation.navigate('Messages', { data: modalData, id: userId, profileImage: profileImage })
  //     console.log('Item data ::' + modalData)
  //     // navigation.navigate('Messages',{data:item, id:userId, myProfileImage:myProfileImage});
  // }
  const handleDatePicker = (date) => {
    console.warn('Date Picked ' + date);
    const dt = new Date(date);
    const x = dt.toISOString().split("T");
    const x1 = x[0].split('-');
    console.log(x1[2] + "/" + x1[1] + "/" + x1[0]);
    setEventDate(x1[0] + "/" + x1[1] + "/" + x1[2]);

    setDatePickerVisibility(false);
    // const daysBetween = new Date().getDate() - new Date('2020-07-15T13:29:15.524486Z').getDate()
    // const birthDate = new Date(dob); 
    const DateToday = new Date();
    const today = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const currentDate = year + '/' + month + '/' + today
    console.log("two dates ::" + DateToday, "+date selected = " + date);
    // const ageYears = differenceInYears(DateToday, date);
    // setMyAge(ageYears);
    // console.log("Youe age in years::" + ageYears)
    firestore()
      .collection('events')
      .doc(selectedId)
      .update({
        // eventMembersList: firestore.FieldValue.arrayUnion(myUserId),
        eventDate: eventDate,

      }).then(res => {
        console.log("Event member request approved :: " + eventDate);
        // return
      }

      ).catch(error => {
        console.log(error);
      })
  }
  const updateDateForEvent = () => {
    firestore()
      .collection('events')
      .doc(selectedId)
      .update({
        // eventMembersList: firestore.FieldValue.arrayUnion(myUserId),
        eventDate: eventDate,

      }).then(() => {
        console.log("Event member request approved :: " + eventDate);
        // return
      }

      ).catch(error => {
        console.log(error);
      })
    setDateModal(false);
  }
  const showDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
    firestore()
      .collection('events')
      .doc(selectedId)
      .update({
        // eventMembersList: firestore.FieldValue.arrayUnion(myUserId),
        eventDate: eventDate,

      }).then(res => {
        console.log("Event member request approved :: " + eventDate);
        // return
      }

      ).catch(error => {
        console.log(error);
      })
    updateDateForEvent();
  };
  const updateTimeForEvent = () => {
    firestore()
      .collection('events')
      .doc(EventPostId)
      .update({
        // eventMembersList: firestore.FieldValue.arrayUnion(myUserId),
        eventTime: eventTime,

      }).then(res => {
        console.log("Event member request approved :: " + eventTime);
        // return
      }

      ).catch(error => {
        console.log(error);
      })
    setTimeModal(false);
  }
  const handleTimePicker = (date) => {
    console.warn('Time Picked ' + date);
    const dt = new Date(date);
    const x = dt.toLocaleTimeString();

    setEventTime(x);

    setTimePickerVisibility(false);
    // const daysBetween = new Date().getDate() - new Date('2020-07-15T13:29:15.524486Z').getDate()
    // const birthDate = new Date(dob); 
    // const DateToday = new Date();
    // const today = new Date().getDate();
    // const month = new Date().getMonth();
    // const year = new Date().getFullYear();
    // const currentDate = year + '/' + month + '/' + today
    console.log("two dates ::" + eventTime, "+date selected = " + eventTime);
    // const ageYears = differenceInYears(DateToday, date);
    // setMyAge(ageYears);
    // console.log("Youe age in years::" + ageYears)
  }
  const showTimePicker = () => {
    setTimePickerVisibility(!isTimePickerVisible);
  };
  const DeleteEventFtn = () => {
    firestore()
      .collection('events')
      .doc(getEventId)
      .delete()
      .then(() => {
        console.log('User deleted!');
        setDeleteEventModal(false);
        setEventModal(false);
        Alert.alert('Event Deleted Successfully');
      });
    getEventData();
  }
  const ShowMyEventDetails = (item) => {
    setSelectedEvent(item);
    SetGetEventId(item.postId);
    setSelectedId(item.postId);
    setCurrentEventName(item.eventName);
    // setEventMembersRequestList(item.eventJoinRequests)
    setEventModal(true);
    // console.log('all request for this event  = '+eventMembersRequestlist);
  }
  const getMemberStatus = ()=>{
    let status = false;
    eventMembersRequestlist.map(itemReq=>{
      eventMembersDatalist.map(itemMem=>{
        if(itemReq === itemMem){
          status = true;
        }else{
          status = false;
          
        }
      })
    })
    return status
  }
  const [messageUserState, setMessageUserState] = useState([])
  const NavigationMessageScreen=(item9)=>{
    let tempUser = [];
    users.map(item=>{
      if(item.id === item9.id){
        tempUser.push(item)
        setMessageUserState(item)
       
      }
    })
    console.log('user Data == ', tempUser)
    console.log('Message User data = ', item9.name, item9.age, item9.id)

    console.log('Message my data = ', myID, myName, myImage)
    navigation.navigate('Messages', {
      data: item9,
      id: mydata.id,
      name: mydata.name,
      myProfileImage: mydata.profileImage,
    })
      setEventMembersListModal(false);
      setEventModal(false)
  }
  const ShowMyEventModal = (props) => {
    return (
      <View style={{
        flex: 1, justifyContent: 'center', alignItems: 'center', height: '95%', marginVertical: 20
      }}>
        <ScrollView>
          <View style={{ height: '100%', width: '100%', backgroundColor: 'white', borderRadius: 20 }}>

            <View style={styles.mainContainer}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <Text numberOfLines={1} style={[styles.userName, { color: 'white', fontSize: 20 }]}>{props.selectedEvent.eventName}</Text>

                <TouchableOpacity style={[styles.userButton, { margin: 5, width: 110, backgroundColor: 'red', flexDirection: 'row' }]}
                  onPress={() => setDeleteEventModal(true)}
                >

                  <Text
                    style={{ color: '#fff', fontSize: 12, margin: 10, fontWeight: '700' }}>
                    Delete Event
                  </Text>
                  <Image source={require('../Images/delete.png')}
                    style={{
                      height: 15, width: 15, alignSelf: 'center',
                      marginTop: 2, tintColor: 'white'
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text style={{ color: 'black', marginLeft: 25, marginTop: 10 }}>
                {props.selectedEvent.eventCaption}</Text>
            </View>
            <View style={{ marginVertical: 10 }}>
              <Text numberOfLines={2} ellipsizeMode='tail' style={{ color: 'black', marginLeft: 25, marginTop: 10 }}>
                {props.selectedEvent.eventDescription}</Text>
            </View>
            <View >
              {/* <Image source={{ uri: props.selectedEvent.img }}
                style={[styles.postImage, { width: 300, height: 200, marginLeft: 10 }]}
              /> */}
              {
               props.selectedEvent.img !== '' ?
                                <Image source={{ uri: props.selectedEvent.img }}
                              style={[styles.postImage, { width: '100%', height: 200}]}
                              // style={{height:200, width:350}}
                              />:
                              <Video source={{ uri: props.selectedEvent.video }}
                              style={[styles.postImage, { width: '100%', height: 200, borderRadius:1 }]}
                              // style={{height:200, width:350}}
                              paused={false}
        // style={styles.backgroundVideo}
                            autoplay={true}
                            repeat={true}
                            muted={false}
                            volume={1.0}
                              />
                              }
            </View>
            <View style={[styles.detailBox, {
              marginLeft: 20, borderWidth: 0,
              marginVertical: 5, justifyContent: 'space-evenly', backgroundColor: 'white'
            }]}>
              <TouchableOpacity onPress={() => { viewLaterFunction() }}>
                <View
                  style={{
                    height: 30, borderRadius: 12, width: 100, borderWidth: 1,
                    borderColor: 'black', backgroundColor: 'blue'
                  }}
                >
                  <Text style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>View Later</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 140 }}>
              <View style={{ marginVertical: 10 }}>
                <TouchableOpacity onPress={() => GetRequestForMyEvents()//{ eventJoinedRequests(props.selectedEvent.eventJoinRequests) }
              }>
                  <View
                    style={{
                      height: 40, borderRadius: 12, width: 200, borderWidth: 1,
                      borderColor: 'black', backgroundColor: 'blue', justifyContent:'center', alignItems:'center'
                    }}
                  >
                    <Text style={{ marginTop: 3, alignSelf: 'center', color: 'white', fontSize:18  }}>View Join Requests</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View >
                <TouchableOpacity onPress={() => GetMembersListForEvent()//{ eventJoinedMembers(props.selectedEvent.eventMembersList) }
              }>
                  <View
                    style={{
                      height: 40, borderRadius: 12, width: 200, borderWidth: 1,
                      borderColor: 'black', backgroundColor: 'blue', justifyContent:'center', alignItems:'center'
                    }}
                  >
                    <Text style={{ marginTop: 3, alignSelf: 'center', color: 'white', fontSize:18 }}>View Join Members</Text>
                  </View>
                </TouchableOpacity>
              </View>


              <View style={[styles.detailBox]}>
                {
                  props.selectedEvent.eventName !== null ? <Text style={{ marginLeft: 10, color: 'black', fontSize: 18, fontWeight: '500' }}>
                    Event Name : {props.selectedEvent.eventName}
                  </Text> :
                    <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: 'black' }}>
                      Memebers Joined : Not Mentioned
                    </Text>
                }
                <TouchableOpacity onPress={() => setShowNameSection(true)}
                >
                  <Image source={require('../Images/edit.png')}
                    style={{ height: 20, width: 20, marginLeft: 5, tintColor: 'black' }}
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.detailBox]}>
                {
                   props.selectedEvent.eventDescription !== null ? <Text style={{ marginLeft: 10, color: 'black', fontSize: 16, fontWeight: '500' }}>
                      Event Description : {props.selectedEvent.eventDescription}
                    </Text> :
                      <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: 'black' }}>
                        Event Description : Not Mentioned
                      </Text>
                }
                <TouchableOpacity onPress={() => setShowDescriptionSection(true)}
                >
                  <Image source={require('../Images/edit.png')}
                    style={{ height: 20, width: 20, marginLeft: 5, tintColor: 'black' }}
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.detailBox]}>
                {
                  props.selectedEvent.eventMembersList.length !== null ? <Text style={{ marginLeft: 10, color: 'black', fontSize: 16, fontWeight: '500' }}>
                    Memebers Joined : {props.selectedEvent.eventMembersList.length}
                  </Text> :
                    <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: 'black' }}>
                      Memebers Joined : 0
                    </Text>
                }
              </View>

              <View style={[styles.detailBox]}>

                <TouchableOpacity style={{ flexDirection: 'row' }}
                // onPress={() => item.likes == UserId ? onPostDislike(item) : onPostLiked(item)}
                >
                  {
                    props.selectedEvent.members !== null ? <Text style={{ marginLeft: 10, color: 'black', fontSize: 16, fontWeight: '500' }}>
                      Total Memebers : {props.selectedEvent.members}
                    </Text> :
                      <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: 'black' }}>
                        Total Memebers : Not Mentioned
                      </Text>
                  }

                  <TouchableOpacity onPress={() => setShowMemberUpdateSection(true)}
                  >
                    <Image source={require('../Images/edit.png')}
                      style={{ height: 20, width: 20, marginLeft: 5, tintColor: 'black' }}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>

              </View>

              <View style={[styles.detailBox]}>
                {
                  props.selectedEvent.eventDate !== null ? <Text style={{ marginLeft: 10, color: 'black', fontSize: 16, fontWeight: '500' }}>
                    Event Date : {props.selectedEvent.eventDate}
                  </Text> :
                    <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: 'black' }}>
                      Event Date : Not Mentioned
                    </Text>
                }
                <TouchableOpacity onPress={() => [showDatePicker(), setDateModal(true)]}
                >
                  <Image source={require('../Images/edit.png')}
                    style={{ height: 20, width: 20, marginLeft: 5, tintColor: 'black' }}
                  />
                </TouchableOpacity>
              </View>

              <View style={[styles.detailBox]}>
                {
                  props.selectedEvent.eventTime !== null ? <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: 'black' }}>
                    Event Time : {props.selectedEvent.eventTime}
                  </Text> :
                    <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: 'black' }}>
                      Event Time : Not Mentioned
                    </Text>
                }
                <TouchableOpacity onPress={() => [showTimePicker(), setTimeModal(true)]}
                >
                  <Image source={require('../Images/edit.png')}
                    style={{ height: 20, width: 20, marginLeft: 5, tintColor: 'black' }}
                  />
                </TouchableOpacity>
              </View>
              <View 
              // style={[styles.detailBox]}
              >
                {
                  // props.selectedEvent.postTimeDate !== null ? <Text style={{ marginLeft: 10, fontSize: 16, color: 'black', fontWeight: '500' }}>
                  //   Event Posted Date : {props.selectedEvent.eventPostTimeDate}
                  // </Text> :
                  //   <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: 'black' }}>
                  //     Memebers Posted : Not Mentioned
                  //   </Text>
                }
              </View>
              <TouchableOpacity // onPress={() => eventJoinedMembers()}
              >
                <View 
                // style={[styles.detailBox]}
                >
                  {
                    eventName !== null ? <Text
                      style={{
                        marginLeft: 10, fontSize: 20, color: 'black', fontWeight: '500', padding: 10,
                        borderWidth: 2, borderColor: 'black', backgroundColor: eventStatus == 'Active' ? 'green' : 'red'
                      }}
                      >
                      Event Status : {eventStatus == 'Active' ? 'Active' : 'Expired'}
                    </Text> :
                      <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: 'black' }}>
                        Event Status : Not Mentioned
                      </Text>
                  }
                </View>
              </TouchableOpacity>

            </View>

          </View>
        </ScrollView>
      </View>
    )
  }
  return (
    <View style={{ height: '100%', width: '100%' }}>


      <View style={[styles.container,{backgroundColor:'black'}]}>
        <Loader visible={Loading} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10}}>
          <TouchableOpacity>
            <Text style={styles.headingStyle}>
              My Event      |
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('PostEvent')}
          >
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.headingStyle}>
                Create Events
              </Text>
              <Image source={require('../Images/plus.png')}
                style={{ height: 25, width: 25, margin: 5, tintColor: 'white' }}
              />
            </View>
          </TouchableOpacity>
        </View>
       
        <View style={styles.heading}>
          
        </View>
        <View style={{width:'100%',borderWidth:0.3, borderColor:'white'}}>

                    </View>
        <View style={{backgroundColor:'white', marginBottom:120 }}>
        {/* <Video source={require('../Images/video.mp4')}
        paused={false}
        style={styles.backgroundVideo}
        autoplay={true}
        repeat={true}
        muted={false}
        volume={1.0}

        resizeMode={'cover'}
      /> */}

      <View style={{height:'100%', backgroundColor:'black'}}>
      {
          postData.length > 0 || postData !== undefined?
            <FlatList
              data={postData}
              renderItem={({ item, index }) => {
                return (
                  <View key={index} style={{ flex: 1, marginBottom: 10, marginTop:10 }}>
                    <View style={{ height: 400, width: '100%', //backgroundColor: '#1e1e1e'
                    backgroundColor:'black'
                  }}>
                      <View style={[styles.mainContainer,{backgroundColor:'black', borderColor:'black'}]}>
                        {
                          <Image
                            source={
                              item.profileImage == '' || item.profileImage == null ?  (require('../Images/user.png'))
                                :
                                { uri: item.profileImage }
                            }
                            style={styles.userImage}
                          />
                        }

                        <Text style={styles.userName}>{item.name}</Text>

                      </View>
                      <View style={{ height: 70,// borderWidth: 1, borderColor: '#1e1e1e' 
                    }}>
                        <Text style={{ color: 'white', marginLeft: 20, fontSize:18, alignSelf:'center'}}>
                          {item.eventDescription}</Text>

                      </View>

                      <View style={{ height: 280, width: '100%' }}>
                        <TouchableOpacity
                          onPress={() => { ShowMyEventDetails(item); }}
                        >

                          <View
                            style={{ height: 280, width: '100%' }}
                          >

                            <View style={{ flex: 1, width:'100%' }}>
                            {
                                item.img !== '' ?
                                <Image source={{ uri: item.img }}
                                style={[styles.postImage, { width: '90%' }]}
                              // style={{height:200, width:350}}
                              />
                              :
                              <Video source={{ uri: item.video }}
                                style={[styles.postImage, { width: '100%', height:280 }]}
                              // style={{height:200, width:350}}
                              paused={false}
        // style={styles.backgroundVideo}
                            autoplay={true}
                            repeat={true}
                            muted={false}
                            volume={1.0}
                              />
                              }
                              
                            </View>

                            <View
                              style={{
                                flex: 1, width: '80%', height: '30%', backgroundColor: '#1e1e1e', alignSelf: 'center', marginTop: 10, marginRight: 10,
                                borderRadius: 20, borderWidth: 1, borderColor: '#1e1e1e', justifyContent: 'center', alignItems: 'center',
                                marginBottom: 40
                              }}
                            >
                              <Text style={{ color: 'white', fontSize: 20, fontWeight: '500' }}>{item.eventName}</Text>

                              <Text style={{ color: 'white', fontSize: 20, fontWeight: '500' }}>Memebers Joined : {item.eventMembersList.length}</Text>
                              <TouchableOpacity onPress={() => { ShowMyEventDetails(item); }}>
                                <View
                                  style={{ 
                                    height: 35, borderRadius: 12, width: 200, borderWidth: 1,
                                    borderColor: 'black', backgroundColor: 'blue'
                                  }}
                                >
                                  <Text style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>View Details</Text>
                                {
                                item.eventJoinRequests.length > 0 ?
                                 <View style={{height:20,width:20, borderRadius:10, backgroundColor:'red', alignSelf:'flex-end'}}>

                                  </View>
                                  :
                                  null
                                  }
                                </View>
                              </TouchableOpacity>
                            </View>

                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{width:'100%',borderWidth:0.3, borderColor:'white', marginTop:10}}>

                    </View>
                  </View>
                )
              }
              }
              extraData={updateState}
            />

            :

            <View style={{justifyContent: 'center', alignItems: 'center' }}>
             
              <View style={{flexDirection:'row'}}>
              <Text style={{ fontSize: 30, fontWeight: '600', color: 'white' }}>No Events , 
              </Text>
              
              </View>
              <Text style={{ fontSize: 30, fontWeight: '600', color: 'white' }}>Why not create your own? 
              </Text>
              <HTMLView style={styles.emoji}
                
                value={"<div>" + arabic + "</div>"}
                
            />
              
            </View>
        }
      </View>
        
     </View>

        {/* <Modal
          visible={eventMembersModal}
          transparent
          onRequestClose={() => { setEventMembersModal(false); }}
        >
          <View style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
            <View style={{ height: '80%', width: '100%', backgroundColor: 'blue' }}>
              {
                eventMembersDatalist !== null ?
                  eventMembersDatalist.map(item9 => {
                    return (
                      <View style={{ flex: 1, marginBottom: 20, flexDirection: 'row' }}>
                        <Text style={[styles.userText, { color: 'red' }]}>
                          {item9._data.name},{item9._data.age}</Text>
                      </View>
                    )
                  }) :
                  <Text style={{ fontSize: 30, color: 'black' }}>No Members To Show</Text>
              }
            </View>
          </View>
        </Modal> */}
        <GestureRecognizer
          style={{ flex: 1 }}
          // onSwipeUp={() => setEventModal(true)}
          onSwipeDown={() => setEventModal(false)}
        >
          <Modal
            transparent={true}
            visible={eventModal}
            onRequestClose={() => { setEventModal(false); }}
          >
            <View style={{ flex: 1 }}>
              <ScrollView>
                <ShowMyEventModal selectedEvent={selectedEvent} />
              </ScrollView>
            </View>
          </Modal>
        </GestureRecognizer>
      
        <Modal visible={showNameSection} transparent
          onRequestClose={() => { setShowNameSection(false); }}

        >
          <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{
              height: '50%', width: '90%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',
              borderRadius: 20, shadowColor: "#000FFF",
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.58,
              shadowRadius: 10.00,

              elevation: 12,
            }}>
              <TextInput placeholder='Please Write Your Name'
                editable
                placeholderTextColor='black'
                style={{ color: 'black' }}
                numberOfLines={1}
                maxLength={30}
                defaultValue={eventName}
                value={nameUpdateText}
                onChangeText={(text) => setNameUpdateText(text)}
              />
              <TouchableOpacity onPress={() => updateEventName(selectedId)} style={{ alignSelf: 'center', marginTop: 20 }}>
                <View style={{
                  height: 40, width: 90, backgroundColor: '#FAF9F6', justifyContent: 'center', alignItems: 'center',
                  borderRadius: 10, shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  shadowOpacity: 0.58,
                  shadowRadius: 10.00,

                  elevation: 12,
                }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', color: 'black' }}>Save</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal visible={showDescriptionSection} transparent
          onRequestClose={() => { setShowDescriptionSection(false); }}

        >
          <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{
              height: '50%', width: '90%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',
              borderRadius: 20, shadowColor: "#000FFF",
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.58,
              shadowRadius: 10.00,

              elevation: 12,
            }}>
              <TextInput placeholder='Please Write Your Name'
                editable
                placeholderTextColor='black'
                style={{ color: 'black' }}
                numberOfLines={1}
                maxLength={30}
                defaultValue={eventDescription}
                value={descriptionUpdateText}
                onChangeText={(text) => setDescriptionUpdateText(text)}
              />
              <TouchableOpacity onPress={() => updateEventDescription(selectedId)} style={{ alignSelf: 'center', marginTop: 20 }}>
                <View style={{
                  height: 40, width: 90, backgroundColor: '#FAF9F6', justifyContent: 'center', alignItems: 'center',
                  borderRadius: 10, shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  shadowOpacity: 0.58,
                  shadowRadius: 10.00,

                  elevation: 12,
                }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', color: 'black' }}>Save</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal visible={showMemberUpdateSection} transparent
          onRequestClose={() => { setShowMemberUpdateSection(false); }}

        >
          <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{
              height: '50%', width: '90%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',
              borderRadius: 20, shadowColor: "#000FFF",
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.58,
              shadowRadius: 10.00,

              elevation: 12,
            }}>
              <TextInput placeholder='Please Write Your Name'
                editable
                placeholderTextColor='black'
                style={{ color: 'black' }}
                numberOfLines={1}
                maxLength={5}
                defaultValue={totalEventMembers}
                value={memberNumberUpdate}
                keyboardType={'numeric'}
                onChangeText={(text) => setMemberNumberUpdate(text)}
              />
              <TouchableOpacity onPress={() => updateEventTotalMembers()} style={{ alignSelf: 'center', marginTop: 20 }}>
                <View style={{
                  height: 40, width: 90, backgroundColor: '#FAF9F6', justifyContent: 'center', alignItems: 'center',
                  borderRadius: 10, shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  shadowOpacity: 0.58,
                  shadowRadius: 10.00,

                  elevation: 12,
                }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', color: 'black' }}>Save</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal visible={dateModal}
        onRequestClose={()=>setDateModal(false)}
          style={{ height: '100%', width: '100%', backgroundColor: 'blue' }}
        >

          <View style={{ height: '100%', width: '100%', backgroundColor: 'lightblue' }}

          //  style={{width:300, height:400, backgroundColor:"black", alignSelf:'center',marginBottom:200}}
          >
            <View>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode='date'
                display='spinner'
                onConfirm={handleDatePicker}
                onCancel={showDatePicker}
                minimumDate={new Date()}
                // maximumDate={new Date('2010-06-15')}
                style={{ height: 400, width: 300 }}

              />
            </View>

            <TouchableOpacity onPress={() => updateDateForEvent()} style={{ alignSelf: 'center', marginTop: 20 }}>
              <View style={{
                height: 40, width: 90, backgroundColor: '#FAF9F6', justifyContent: 'center', alignItems: 'center',
                borderRadius: 10, shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: 0.58,
                shadowRadius: 10.00,

                elevation: 12,
              }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: 'black' }}>Save</Text>
              </View>
              <View style={[styles.detailBox]}>
                {
                  eventName !== null ? <Text style={{ marginLeft: 10, color: 'black', fontSize: 16, fontWeight: '500' }}>
                    Event Date : {eventDate}
                  </Text> :
                    <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: 'black' }}>
                      Event Date : Not Mentioned
                    </Text>
                }
              </View>

            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={{ alignSelf: 'center', marginTop: 20 }}>
              <View style={{
                height: 40, width: 200, backgroundColor: '#FAF9F6', justifyContent: 'center', alignItems: 'center',
                borderRadius: 10, shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: 0.58,
                shadowRadius: 10.00,

                elevation: 12,
              }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: 'black' }}>Show Date Picker</Text>
              </View>

            </TouchableOpacity>
          </View>

        </Modal>
        <Modal visible={timeModal}
        onRequestClose={()=>setTimeModal(false)}
          style={{ height: '100%', width: '100%', backgroundColor: 'blue' }}
        >

          <View style={{ height: '100%', width: '100%', backgroundColor: 'lightblue' }}

          //  style={{width:300, height:400, backgroundColor:"black", alignSelf:'center',marginBottom:200}}
          >
            <View
            //  style={{width:300, height:400, backgroundColor:"black", alignSelf:'center',marginBottom:200}}
            >
              <DateTimePickerModal
                isVisible={isTimePickerVisible}
                mode='time'
                display='spinner'
                onConfirm={handleTimePicker}
                onCancel={showTimePicker}
                // minimumDate={new Date()}
                // maximumDate={new Date('2010-06-15')}
                style={{ height: 400, width: 300 }}

              />
            </View>

            <TouchableOpacity onPress={() => updateTimeForEvent()} style={{ alignSelf: 'center', marginTop: 20 }}>
              <View style={{
                height: 40, width: 90, backgroundColor: '#FAF9F6', justifyContent: 'center', alignItems: 'center',
                borderRadius: 10, shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: 0.58,
                shadowRadius: 10.00,

                elevation: 12,
              }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: 'black' }}>Save</Text>
              </View>
              <View style={[styles.detailBox]}>
                {
                  eventTime !== null ? <Text style={{ marginLeft: 10, color: 'black', fontSize: 16, fontWeight: '500' }}>
                    Event Date : {eventTime}
                  </Text> :
                    <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: 'black' }}>
                      Event Date : Not Mentioned
                    </Text>
                }
              </View>

            </TouchableOpacity>
            <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={{ alignSelf: 'center', marginTop: 20 }}>
              <View style={{
                height: 40, width: 200, backgroundColor: '#FAF9F6', justifyContent: 'center', alignItems: 'center',
                borderRadius: 10, shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: 0.58,
                shadowRadius: 10.00,

                elevation: 12,
              }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: 'black' }}>Show Time Picker</Text>
              </View>

            </TouchableOpacity>
          </View>

        </Modal>


        <Modal visible={eventRequestModal}//eventRequestModal
          onRequestClose={() => { setEventRequestModal(false); }}
        >
          <View style={{flex:1, height:'90%', backgroundColor:'black' }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop:20}}>
            <Text style={{fontSize: 22, fontWeight: '600' }}>Join Requests</Text>
            <TouchableOpacity onPress={() => setEventRequestModal(false)}>
              <Text style={{ fontSize: 22, fontWeight: '600' }}>Close</Text>
            </TouchableOpacity>
          </View>
             <View style={{flex:1, marginVertical:20, margin:5}}>
          {
            // eventMembersRequestlist.length > 0 && eventMembersRequestlist !== undefined 
            usersDataForRequests.length > 0
            ?
              // eventMembersRequestlist
              usersDataForRequests.map((request, index) => {
                const requestIndex = index;
                return (
                  <View style={[styles.userContainer]}>
                    <View style={{ flex: 1, marginBottom: 20, flexDirection: 'row' }}>
                      <TouchableOpacity //onPress={() => onUserProfileClick(item)}
                      >
                        <Image
                          source={request.profileImage == "" || request.profileImage == undefined? (require('../Images/user.png')) : { uri: request.profileImage }}
                          style={styles.user_Image}
                        />
                      </TouchableOpacity>
                      <Text style={[styles.userText, { color: 'white' }]}>
                        {request.name},{request.age}</Text>
                    </View>
                    <View>
                      <View style={styles.userButtonView}>
                        <TouchableOpacity style={[styles.userButton, { backgroundColor: 'green', flexDirection: 'row' }]}
                          // onPress={() => getFollowStatus(item._data.followers) ? unfollowUser(item) : followFunction(item)}
                          onPress={() => ApproveRequestForEvent(request.id)}
                        >

                         
                            
                                                            
                                                            {/* getFollowStatus(item._data.followers)
                                                                ? 'Unfollow'
                                                                : 'Follow' */}
                                                          
                                                         
                               
                            {/* <Text
                       style={{ color: '#fff', fontSize: 14, margin: 10, fontWeight: '700' }}
                  >
                  {  
                  getMemberStatus()? 
                             'Accepted'
                             :
                             'Accept'
                             }
                         </Text> */}
                        
                        <Text
                   style={{ color: '#fff', fontSize: 14, margin: 10, fontWeight: '700' }}
              >
                Accept

                 </Text>   
                          <Image source={require('../Images/accept.png')}
                            style={{
                              height: 15, width: 15, alignSelf: 'center', marginLeft: 10,
                              marginTop: 2, // tintColor: 'white'
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.userButton, { backgroundColor: 'red', flexDirection: 'row' }]}
                        onPress={()=>DeleteRequestForEvent(request.id)}

                        // onPress={() => sendNotification(token)}
                        // onPress={() => unfollowUser(item)}
                        // onPress=
                        // {() => navigation.navigate('Messages', { data: item, id: userId, profileImage: profileImage })
                        // }
                        >

                          <Text
                            style={{ color: '#fff', fontSize: 12, margin: 10, fontWeight: '700' }}>
                            Delete
                          </Text>
                          <Image source={require('../Images/delete.png')}
                            style={{
                              height: 15, width: 15, alignSelf: 'center', marginLeft: 10,
                              marginTop: 2, tintColor: 'white'
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )
              }) :
              <View>
                <Text style={{ fontSize: 23, fontWeight: '500', color: 'white' }}>No Join Request To Show</Text>
              </View>

          }
          </View>
          </View>

        </Modal>

        <Modal
         visible={eventMembersListModal}
        onRequestClose={() => { setEventMembersListModal(false); }}
>
  <View style={{flex:1, backgroundColor:'black'}}>
<View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
  <Text style={{ fontSize: 22, fontWeight: '600' }}>Members Joined</Text>
  <TouchableOpacity onPress={() => setEventMembersListModal(false)}>
    <Text style={{ fontSize: 22, fontWeight: '600' }}>Close</Text>
  </TouchableOpacity>
</View>

{
  // eventMembersDatalist.length > 0 && eventMembersDatalist !== undefined
  usersDataForMembers.length > 0
  ?
    // eventMembersDatalist
    usersDataForMembers.map((item9, index) => {
      const itemIndex = index;
      return (
        <View style={styles.userContainer}>
          <View style={{ flex: 1, marginBottom: 20, flexDirection: 'row' }}>
            <TouchableOpacity //onPress={() => onUserProfileClick(item)}
            >
              <Image
                source={item9.profileImage == "" ? (require('../Images/user.png')) : { uri: item9.profileImage }}
                style={styles.user_Image}
              />
            </TouchableOpacity>
            <Text style={[styles.userText, { color: 'white' }]}>
              {item9.name},{item9.age}</Text>
          </View>
          <View>
            <View style={styles.userButtonView}>
              <TouchableOpacity style={[styles.userButton, { backgroundColor: 'red', flexDirection: 'row' }]}
                onPress={() => DeleteMemberForEvent(item9.id)}
              // onPress={() => getFollowStatus(item._data.followers) ? unfollowUser(item) : followFunction(item)}
              >

                <Text
                  style={{ color: '#fff', fontSize: 14, margin: 10, fontWeight: '700' }}
                >
                  {/* {
                                                  
                                                  getFollowStatus(item._data.followers)
                                                      ? 'Unfollow'
                                                      : 'Follow'
                                              } */}

                  Delete

                </Text>
                <Image source={require('../Images/delete.png')}
                  style={{
                    height: 15, width: 15, alignSelf: 'center', marginLeft: 10,
                    marginTop: 2, tintColor: 'white'
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.userButton, { flexDirection: 'row' }]}
                 onPress={() => [console.log(item9.name, item9.id, myUserName),
                  // console.log('My USER NAME HERE '+ myUserName+' other user info '+ item9.name, item9.id),
                  // setEventMembersListModal(false),
                  // setEventModal(false),
                  NavigationMessageScreen(item9),
                  // navigation.navigate('Messages', {
                  //   data: item9,
                  //   id: UserId,
                  //   name: myUserName,
                  //   myProfileImage: myProfileImage,
                  // })
                     ]}
              >
                <Image source={require('../Images/user-info.png')}
                  style={{
                    height: 15, width: 15, alignSelf: 'center', marginLeft: 10,
                    marginTop: 2, tintColor: 'white'
                  }}
                />
                <Text
                  style={{ color: '#fff', fontSize: 12, margin: 10, fontWeight: '700' }}>
                  Message
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }) :
    <Text style={{ fontSize: 30, color: 'white' }}>No Members To Show</Text>
}
</View>
</Modal> 
        <Modal
          animationType='slide'
          transparent={true}
          visible={deleteEventModal}
        >
          <View style={styles.modal}>


            <View style={[styles.modalView, { borderWidth: 2, borderColor: 'black' }]}>
              <View style={{ marginVertical: 30 }}>
                <Text style={{ fontSize: 24, fontWeight: '700' }}>
                  Are You Sure, You Want To Delete This Event?
                </Text>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 50 }}>
                  <TouchableOpacity style={[styles.userButton, { margin: 5, width: 80, backgroundColor: 'red', flexDirection: 'row' }]}

                    onPress={() => DeleteEventFtn()}

                  >

                    <Text
                      style={{ color: '#fff', fontSize: 12, margin: 10, fontWeight: '700' }}>
                      Delete
                    </Text>
                    <Image source={require('../Images/delete.png')}
                      style={{
                        height: 15, width: 15, alignSelf: 'center', marginLeft: 10,
                        marginTop: 2, tintColor: 'white'
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.userButton, { margin: 5, width: 100, backgroundColor: 'green', flexDirection: 'row' }]}
                    onPress={() => setDeleteEventModal(false)}
                  >

                    <Text
                      style={{ color: '#fff', fontSize: 12, margin: 10, fontWeight: '700' }}>
                      Not Now
                    </Text>
                    <Image source={require('../Images/accept.png')}
                      style={{
                        height: 15, width: 15, alignSelf: 'center', marginLeft: 10,
                        marginTop: 2, tintColor: 'white'
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  )
}
// https://www.youtube.com/watch?v=gqt_KYxDZfw
const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    width: 300,
    height: 400,
    marginBottom: 180,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.58,
    shadowRadius: 10.00,

    elevation: 12,
  },
  container: {
    flex: 1,
    marginBottom: 70,
    width: '100%',
    height:'100%'
  },
  headingStyle: {
    marginLeft: 20,
    fontSize: 23,
    color: 'white',
    fontWeight: '700',
  },
  heading: {
    borderBottomWidth: 1,
    borderColor: 'black',
    width: '100%',
    height: 10,
    flexDirection: 'row',
  },
  mainContainer: {
    width:'100%',
    flexDirection: 'row',
    margin: 5,
    // borderWidth: 1,
    // borderColor: 'orange',
    backgroundColor: '#1e1e1e',
    borderRadius: 5
  },
  userImage: {
    width: 25,
    height: 25,
    margin: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'white',
  },
  userName: {
    fontSize: 14,
    fontWeight: '400',
    margin: 3,
    color: 'white'

  },
  postImage: {
    width: '90%',
    height: 240,
    marginBottom: 10,
    // marginLeft:20,

    alignSelf: 'center',
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: '#1e1e1e',
  },
  detailBox: {
    flexDirection: 'row',
    width: '90%',
    height: 50,
    // marginBottom: 10,
    // justifyContent: 'space-evenly',
    alignItems: "center",
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    marginVertical: 10,
    borderRadius: 10,
  }, userContainer: {
    justifyContent: 'center',
    backgroundColor: '#202A44',
    // backgroundColor:'#202A44',#30313A
    width: '100%',
    height: 120,
    borderWidth: .5,
    borderColor: '#ff8501',
    borderRadius: 25,
    marginVertical: 5,
  },
  userText: {
    fontSize: 25,
    fontWeight: '500',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: -5,
    color: 'white'
  },
  userButtonView: {
    flexDirection: 'row',
    marginLeft: 100,
    marginBottom: 20,
    marginRight: 10,
  },
  userButton: {
    backgroundColor: '#4867A9',
    borderRadius: 10,
    height: 35,
    width: 110,
    marginLeft: 10
  },
  user_Image: {
    width: 82,
    height: 82,
    borderRadius: 41,
    margin: 8,
    borderWidth: .2,
    borderColor: '#ff8501',
    justifyContent: 'center'
  },
  emoji:{
    flex:1,
    height:100,
    width:100
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: '100%',
    width: '100%',
  }
});

export default MyEvents

{/* <GestureRecognizer
style={{ flex: 1 }}
// onSwipeUp={() => setEventModal(true)}
onSwipeDown={() => setEventModal(false)}
>
<Modal
  transparent={true}
  visible={false}
  onRequestClose={() => { setEventModal(false); }}

>

  <View style={{
    flex: 1, justifyContent: 'center', alignItems: 'center', height: '95%', marginVertical: 20
  }}>
    <ScrollView>
      <View style={{ height: '100%', width: '100%', backgroundColor: 'white', borderRadius: 20 }}>

        <View style={styles.mainContainer}>

          {
            // // this.state.ImageURI !== '' ? <Image source={this.state.ImageURI} /> :null
            // item.profileImage === '' ?
            //   <Image
            //     source={(require('../Images/user.png'))}
            //     style={[styles.userImage, { width: 50, height: 50, borderRadius: 25 }]}
            //   />
            //   :
            //   <Image
            //     source={{ uri: eventOwnerProfileImage }}
            //     style={[styles.userImage, { width: 50, height: 50, borderRadius: 25 }]}
            //   />

          }
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Text numberOfLines={1} style={[styles.userName, { color: 'white', fontSize: 30 }]}>{eventOwnerUserName}</Text>

            <TouchableOpacity style={[styles.userButton, { margin: 5, width: 130, backgroundColor: 'red', flexDirection: 'row' }]}
              onPress={() => setDeleteEventModal(true)}

            >

              <Text
                style={{ color: '#fff', fontSize: 12, margin: 10, fontWeight: '700' }}>
                Delete Event
              </Text>
              <Image source={require('../Images/delete.png')}
                style={{
                  height: 15, width: 15, alignSelf: 'center', marginLeft: 10,
                  marginTop: 2, tintColor: 'white'
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text style={{ color: 'black', marginLeft: 25, marginTop: 10 }}>
            {eventCaption}</Text>
        </View>
        <View style={{ marginVertical: 10 }}>
          <Text numberOfLines={2} ellipsizeMode='tail' style={{ color: 'black', marginLeft: 25, marginTop: 10 }}>
            {eventDescription}</Text>
        </View>
        <View >
          <Image source={{ uri: eventImage }}
            style={[styles.postImage, { width: 300, height: 200, marginLeft: 10 }]}
          />
        </View>
        <View style={[styles.detailBox, {
          marginLeft: 20, borderWidth: 0,
          marginVertical: 5, justifyContent: 'space-evenly', backgroundColor: 'white'
        }]}>
          <TouchableOpacity onPress={() => { viewLaterFunction() }}>
            <View
              style={{
                height: 30, borderRadius: 12, width: 100, borderWidth: 1,
                borderColor: 'black', backgroundColor: 'blue'
              }}
            >
              <Text style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>View Later</Text>
            </View>
          </TouchableOpacity>

          {eventPosterUserId !== myUserId ?
            <TouchableOpacity style={{ flexDirection: 'row' }}
            // onPress={() => JoinEventFtn()}
            >
              {/* <Text style={{ marginRight: 20 }}>0</Text> 
              <View
                style={{
                  height: 30, borderRadius: 12, width: 100, borderWidth: 1,
                  borderColor: 'black', backgroundColor: 'blue'
                }}
              >
     
              </View>
            </TouchableOpacity>
            :
            <Text
              style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>
              My Event
            </Text>
          }

        </View>


        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 140 }}>
          <View style={{ marginVertical: 10 }}>
            <TouchableOpacity onPress={() => { eventJoinedRequests() }}>
              <View
                style={{
                  height: 30, borderRadius: 12, width: 200, borderWidth: 1,
                  borderColor: 'black', backgroundColor: 'blue'
                }}
              >
                <Text style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>View Join Requests</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View >
            <TouchableOpacity onPress={() => { eventJoinedMembers() }}>
              <View
                style={{
                  height: 30, borderRadius: 12, width: 200, borderWidth: 1,
                  borderColor: 'black', backgroundColor: 'blue'
                }}
              >
                <Text style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>View Join Members</Text>
              </View>
            </TouchableOpacity>
          </View>


          <View style={[styles.detailBox]}>
            {
              eventName !== null ? <Text style={{ marginLeft: 10, color: 'black', fontSize: 16, fontWeight: '500' }}>
                Event Name : {eventName}
              </Text> :
                <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: 'black' }}>
                  Memebers Joined : Not Mentioned
                </Text>
            }
            <TouchableOpacity onPress={() => setShowNameSection(true)}
            >
              <Image source={require('../Images/edit.png')}
                style={{ height: 20, width: 20, marginLeft: 5, tintColor: 'black' }}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.detailBox]}>
            {
              eventDescription !== null ? <Text style={{ marginLeft: 10, color: 'black', fontSize: 16, fontWeight: '500' }}>
                Event Description : {eventDescription}
              </Text> :
                <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: 'black' }}>
                  Event Description : Not Mentioned
                </Text>
            }
            <TouchableOpacity onPress={() => setShowDescriptionSection(true)}
            >
              <Image source={require('../Images/edit.png')}
                style={{ height: 20, width: 20, marginLeft: 5, tintColor: 'black' }}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.detailBox]}>
            {
              totalEventMembersJoined !== null ? <Text style={{ marginLeft: 10, color: 'black', fontSize: 16, fontWeight: '500' }}>
                Memebers Joined : {totalEventMembersJoined}
              </Text> :
                <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: 'black' }}>
                  Memebers Joined : 0
                </Text>
            }
          </View>

          <View style={[styles.detailBox]}>

            <TouchableOpacity style={{ flexDirection: 'row' }}
            // onPress={() => item.likes == UserId ? onPostDislike(item) : onPostLiked(item)}
            >
              {
                totalEventMembers !== null ? <Text style={{ marginLeft: 10, color: 'black', fontSize: 16, fontWeight: '500' }}>
                  Total Memebers : {totalEventMembers}
                </Text> :
                  <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: 'black' }}>
                    Total Memebers : Not Mentioned
                  </Text>
              }

              <TouchableOpacity onPress={() => setShowMemberUpdateSection(true)}
              >
                <Image source={require('../Images/edit.png')}
                  style={{ height: 20, width: 20, marginLeft: 5, tintColor: 'black' }}
                />
              </TouchableOpacity>
            </TouchableOpacity>

          </View>

          <View style={[styles.detailBox]}>
            {
              eventName !== null ? <Text style={{ marginLeft: 10, color: 'black', fontSize: 16, fontWeight: '500' }}>
                Event Date : {eventDate}
              </Text> :
                <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: 'black' }}>
                  Event Date : Not Mentioned
                </Text>
            }
            <TouchableOpacity onPress={() => [showDatePicker(), setDateModal(true)]}
            >
              <Image source={require('../Images/edit.png')}
                style={{ height: 20, width: 20, marginLeft: 5, tintColor: 'black' }}
              />
            </TouchableOpacity>
          </View>




          <View style={[styles.detailBox]}>
            {
              eventName !== null ? <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: 'black' }}>
                Event Time : {eventTime}
              </Text> :
                <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: 'black' }}>
                  Event Time : Not Mentioned
                </Text>
            }
            <TouchableOpacity onPress={() => [showTimePicker(), setTimeModal(true)]}
            >
              <Image source={require('../Images/edit.png')}
                style={{ height: 20, width: 20, marginLeft: 5, tintColor: 'black' }}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.detailBox]}>
            {
              eventName !== null ? <Text style={{ marginLeft: 10, fontSize: 16, color: 'black', fontWeight: '500' }}>
                Event Posted Date : {eventPostDateTime}
              </Text> :
                <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: 'black' }}>
                  Memebers Posted : Not Mentioned
                </Text>
            }
          </View>
          <TouchableOpacity // onPress={() => eventJoinedMembers()}
          >
            <View style={[styles.detailBox]}>
              {
                eventName !== null ? <Text
                  style={{
                    marginLeft: 10, fontSize: 20, color: 'black', fontWeight: '500', padding: 10,
                    borderWidth: 2, borderColor: 'black', backgroundColor: eventStatus == 'Active' ? 'green' : 'red'
                  }}>
                  Event Status : {eventStatus == 'Active' ? 'Active' : 'Expired'}
                </Text> :
                  <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: 'black' }}>
                    Event Status : Not Mentioned
                  </Text>
              }
            </View>
          </TouchableOpacity>

        </View>

      </View>
    </ScrollView>
  </View>

</Modal>
</GestureRecognizer> */}
{/* */}