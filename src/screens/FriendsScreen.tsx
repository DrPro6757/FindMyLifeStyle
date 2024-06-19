import {
  View,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import GestureRecognizer from 'react-native-swipe-gestures';

import {useRoute, useNavigation, StackActions} from '@react-navigation/native';
import Auth from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

import {firebase} from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventsScreen from './EventsScreen';
// import Notifications from './Notifications';
import notifee, {AndroidColor, AndroidImportance, AndroidStyle} from '@notifee/react-native';
import axios from 'axios';
import Loader from './Loader';
import ProfileScreen from '../screens/ProfileScreen';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
// import HTMLView from 'react-native-htmlview';
import MyFollower from './MyFollower';
// import {RollInLeft} from 'react-native-reanimated';
import TabNavigationCustom from '../navigations/TabNavigationCustom';
import {useDispatch, useSelector} from "react-redux";
import { getMyFollowingAction, getMyUserDataAction, getUsersInitiate } from '../Redux/actionsUser';
import { UserFollowingNotification } from '../Redux/actionsNotification';

const arabic =
  '&#1587;&#1615;&#1576;&#1618;&#1581;&#1614;&#1575;&#1606;&#1614; &#1575;&#1604;&#1604;&#1607;&#1616; &#1608;&#1614;&#1576;&#1616;&#1581;&#1614;&#1605;&#1618;&#1583;&#1616;&#1607;&#1616;';

  //later
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
messaging().getInitialNotification();

let userId = '';
let userName = '';
let friendId = '';
let friendName = '';
let myFollowings = [];
let myFollowings1;
let myFollowers;
let myFollowers1;
let itemValue = '';
let isUserFollowed = false;
const FriendsScreen = (props) => {
  const navigation = useNavigation();

  const [Loading, setLoading] = useState(false);
  const [userList, setUserslist] = useState([]);
  const [userProfileImage, setuserProfileImage] = useState('');

  const [imageData, setImageData] = useState('');
  const [onfollow, setOnFollow] = useState(false);
  const [onFollowClick, setOnFollowClick] = useState(false);

  const [statusUpdate, setStatusUpdate] = useState('');

  const [otherUserProfileImage, setOtherUserProfileImage] = useState('');
  const [otherUserName, setOtherUserName] = useState('');
  const [otherUserAge, setOtherUserAge] = useState('');
  const [otherUserPhotos, setOtherUserPhotos] = useState('');
  const [otherUserAbout, setOtherUserAbout] = useState('');

  const [otherUserInterests, setOtherUserInterests] = useState('');

  const [otherUserWork, setOtherUserWork] = useState('');
  const [otherUserEducation, setOtherUserEducation] = useState('');

  const [otherUserRelationshipStatus, setOtherUserRelationshipStatus] =
    useState('');
  const [otherUserFollowers, setOtherUserFollowers] = useState(0);
  const [otherUserFollowersList, setOtherUserFollowersList] = useState([]);
  const [otherUserFollowing, setOtherUserFollowing] = useState(0);
  const [otherUserEventsPosted, setOtherUserEventsPosted] = useState(0);
  const [otherUserUserId, setOtherUserUserId] = useState('');

  const [modalData, setModalData] = useState('');
  const [otherUserInfoModal, setShowOtherUserInfoModal] = useState(false);
  const [imageFullModal, setImageFullModal] = useState(false);
  const [fullImage, setFullImage] = useState(false);
  const [myfcmToken, setFcmToken] = useState();
  const [myFollowerName, setMyFollowerName] = useState('');

  const [filterModal, setFilterModal] = useState(false);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(100);
  const [maxDistance, setMaxDistance] = useState(10);
  const [filterGender, setFilterGender] = useState('');
  const [filterGenderAll, setFilterGenderAll] = useState('Both');
  const [selectedUser, setSelectedUser] = useState(undefined);

  const [expandSearch, setExpandSearch] = useState('Expand Your Search');

  const [updateUserDataState, setUpdateUserDataState] = useState(false); 

  const [myUserName, setMyUserName] = useState('');
  const [myProfileImage, setMyProfileImage] = useState('');
  const[myTotalFollowers, setMyTotalFollowers] = useState([]);

  let profileImage = '';
  let tempUserData = [];
  let myIndex;
  let indexOpen;

  const [selectedInterest, setSelectedInterest] = useState(null);
  const [selectedView, setSelectedView] = useState();
  const [interestModal, setInterestModal] = useState(false);

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
  // useEffect(() => {
  //     const unsubscribe = messaging().onMessage(async remoteMessage => {
  //       Alert.alert('A new FCM message arrived! in foreground mode', JSON.stringify(remoteMessage.notification?.body));
  //       if (remoteMessage) {
  //         // notificationCount = notificationCount + 1;
  //         // console.log('total notificationssssssssssss ' + notificationCount)
  //    //     setNotificationSent(!notificaitonSent);
  //       }
  //       displayNotification(remoteMessage);
  //     });

  //     return unsubscribe;
  //   }, []);
  
  const [followingState, setFollowingState] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  let myID = "";
  let myName = "";
  let myImage = "";

  const dispatch = useDispatch();
  useEffect(() => {
    getDatabase();
    getFcmToken();
    getUserId();
    dispatch(getMyUserDataAction());
    dispatch(getUsersInitiate());
    dispatch(getMyFollowingAction());
    // getUserData();
    // Notifications();
  }, [onfollow, onFollowClick, updateUserDataState]);

  //later
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      //   Alert.alert('A new FCM message arrived! in foreground mode', JSON.stringify(remoteMessage));
      displayNotification(remoteMessage);
    });

    return unsubscribe;
  }, []);
  const {mydata} = useSelector(state => state.myUserData)
  const {users} = useSelector(state => state.myUserData)
  const {following} = useSelector(state => state.myUserData)
  
  mydata && 
  mydata.map(item=>{
   myID = item.id;
   myName = item.name;
   myImage = item.profileImage;
  })


  useEffect(() => {
    if(following.indexOf(selectedId)>-1){
      console.log('following status %%%%%%%%%%%%%%%%%%', followingState)
      setFollowingState(true);
    }else{
      console.log('not following status %%%%%%%%%%%%%%%%%%', followingState)
      setFollowingState(false);
    }
    // following.map(item=>{
    //   // console.log('following status %%%%%%%%%%%%%%%%%%', item)
    //   if(item.following ===selectedId){
    //     console.log('following status %%%%%%%%%%%%%%%%%%', selectedId)
    //     setFollowingState(true);
    //   }else{
    //     console.log('not following status %%%%%%%%%%%%%%%%%%', selectedId)
    //     setFollowingState(false);
    //   }
    // })
    let tempUsers = []
    users && users.map((item)=>{
      // console.log('All User Data Direct == ',userList)
      // if(item.id!==myID){
        tempUsers.push(item)
      // }
    })
    setUserslist(tempUsers)
  }, [following, mydata, onfollow, onFollowClick, updateUserDataState, selectedId])
  const CallMyFunction=()=>{
    // props.getAllUserData;
  }
  const createUser = async () => {
    try {
      if (
        email.length > 0 &&
        password.length > 0 &&
        name.length > 0 &&
        dob !== null &&
        gender !== null &&
        locationAccessStatus !== '' &&
        selectedInterest !== null
      ) {
        const response = await auth().createUserWithEmailAndPassword(
          email,
          password,
        );
        console.log(response);

        const userData = {
          id: response.user.uid,
          name: name,
          email: email,
          dob: dob,
          gender: gender,
          location: location,
          followers: [],
          profilelikes: [],
          profileImage: '',
          photos: [],
          following: [],
          fcmToken: deviceFcmToken,
          relationshipStatus: relationShip,
          signUpTime: new Date(),
          interest: selectedInterest,
          age: myAge,
          eventsPosted: 0,
          work: '',
          education: '',
        };

        await firestore()
          .collection('users')
          .doc(response.user.uid)
          .set(userData);
        // await firestore().collection("users").doc(response.user.uid).get();

        await auth().currentUser?.sendEmailVerification();
        await auth().signOut();
        await firestore()
          .collection('fcmToken')
          .doc(response.user.uid)
          .set({deviceFcmToken});
        goToNext(userData.name, userData.email, userData.id, deviceFcmToken);
        const userNotificationsData = {
          messageBody: [],
          messageTitle: '',
          messageType: '',
          receiverId: '',
          receiverToken: '',
          senderId: '',
          senderToken: '',
          senderProfileImage: '',
          senderUserName: '',
          timeStamp: '',
        };
        await firestore()
          .collection('notifications')
          .doc(response.user.uid)
          .set(userNotificationsData);
        // await firestore().collection('users').doc(auth().currentUser?.uid).set('')

        Alert.alert('Please verify your email check out Link in your inbox');
        //later
        navigation.dispatch(StackActions.replace('LoginScreen'));
      } else {
        Alert.alert('Please Fill All Details');
      }
    } catch (error) {
      console.log(error);
      setMessage(error.message);
    }
  };
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
        setFcmToken(newfcmToken);
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
      setFcmToken(oldfcmToken);
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
  const getUserId = async () => {
    userId = await AsyncStorage.getItem('USERID');
    // userName = await AsyncStorage.getItem('NAME');
    setMyFollowerName(userName);
    console.log('My Name ' + myFollowerName);
    // console.log("my user id stored in event screen:: " + userId);
  };
  //later
  const displayNotification = async data => {
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
              AndroidStyle.BIGPICTURE, picture: myImage,
          },
        },
      });
  };
  const getDatabase = async () => {
    try {
      const data = await firestore()
        .collection('users')
        .doc(auth().currentUser?.uid)
        .get();
      // setMyData(data._data);
      const name = data._data.name;
      const email = data._data.email;
      const id = data._data.id;
      const profileImage = data._data.profileImage;
      // setImageData(profileImage);
      setuserProfileImage(data._data.profileImage);
      goToNext(name, email, id, profileImage);
      // console.warn("My User ID Stored And Set Asynchronysly:" + id);
      // console.warn("My Name Stored And Set Asynchronysly:" + name);
      // console.warn("My Email Stored And Set Asynchronysly:" + email);
    } catch (error) {
      console.log(error);
    }
  };
  const goToNext = async (name, email, id, profileImage) => {
    name = await AsyncStorage.setItem('NAME', name);
    email = await AsyncStorage.setItem('EMAIL', email);
    id = await AsyncStorage.setItem('USERID', id);
    profileImage = await AsyncStorage.setItem('profileImage', profileImage);
    let checkUserName = await AsyncStorage.getItem('NAME');
    setMyUserName(checkUserName);
    let checkProfileImage = await AsyncStorage.getItem('profileImage');
    setMyProfileImage(checkProfileImage);
    console.warn("My Profile Image Link Stored And Set Asynchronysly:" + myProfileImage);
    console.warn("My Name Link Stored And Set Asynchronysly:" + myUserName);

  };
  const getUserData = async () => {

    setLoading(true);
//     let tempUsers = [];
// if(props.allUserData.length < 1){
//   firestore()
//   .collection('users')
//   .where('id', '!=', 'userId')
//   .get()
//   .then(querySnapshot => {
//     querySnapshot._docs.map(item => {
//       if (item._data.id !== userId) {
//         tempUsers.push(item);
//         console.log('temp users profile iMage :' + item._data.name);
//         //  console.log('other people fcm token == '+item._data.fcmToken);
//         if (item._data.followers === userId) {
//           setStatusUpdate('xxx');
//         } else {
//           setStatusUpdate('vvv');
//         }
//       }
//     });
//     setLoading(false);
//     setUserslist(tempUsers);
//     console.log('all user Data From Friedsns sldj sCreen;;;; '+userList)
//   });
// }
// else{
  setLoading(false);
  setUserslist(props.allUserData)
    console.log('all user Data From other sCreen in Friends Screen ;=;=; '+props.allUserData)
// }
   
      setUpdateUserDataState(true);

  };
  const userFilterData = () => {
    let tempUsers = [];

    // firestore()
    //   .collection('users')
    //   .where('id', '!=', 'userId')
    //   .get()
    //   .then(querySnapshot => {
        // querySnapshot._docs
        props.allUserData.map(item => {
          if (item._data.id !== userId) {
            if (filterGenderAll == '') {
              // item._data.interest

              if (
                item._data.age >= minAge &&
                item._data.age <= maxAge &&
                item._data.gender == filterGender
                 && item._data.interest == selectedInterest
              ) {
                tempUsers.push(item);
                console.log('temp users profile iMage :' + item._data.name);
              }
            } else if (
              item._data.age >= minAge &&
              item._data.age <= maxAge &&
              item._data.gender == item._data.gender 
              && item._data.interest == selectedInterest
            ) {
              tempUsers.push(item);
              console.log('temp users profile iMage :' + item._data.name);
            }

            //  console.log('other people fcm token == '+item._data.fcmToken);
            // if (item._data.followers === userId) {
            //     setStatusUpdate('xxx')
            // } else {
            //     setStatusUpdate('vvv')
            // }
          }
        });
        if (tempUsers.length == 0) {
          setUserslist(null);
        } else {
          setUserslist(tempUsers);
        }
      // });
    setFilterModal(false);
  };
  const selectInterest = item => {
    setSelectedInterest(item.interestName);
    console.log('Selected Interest = ' + selectedInterest);
    setSelectedView(item.index);
    console.log('Selected View = ' + selectedView);
    setInterestModal(false);
  };
  const showInterestModal = () => {
    setInterestModal(true);
  };

  // follow or friend add in db
  const unfollowUser = async item => {
    let tempFollowing = [];

    // if (tempFollowing.length >= 1) {
    myFollowings1 = await firestore()
      .collection('users')
      .doc(userId)
      .get()
      .then(snapshot => {
        tempFollowing = snapshot._data.following;
      })
      .catch(error => {
        console.log(error);
      });
    tempFollowing.map(item3 => {
      if (item3 == item.id) {
        firestore()
          .collection('users')
          .doc(auth().currentUser?.uid)
          .update({
            following: firestore.FieldValue.arrayRemove(
              item.id.toString(),
            ),
          })
          .then(res => {})
          .catch(error => {
            console.log(error);
          });
        console.log('DDDDDDDDDDDDDDDDDDDDDDDelete::' + item.id);
        Alert.alert('You have unfollowed ' + item.name);
      }
      isUserFollowed = false;
    });
    ///
    ///   for adding unfollow in other user list
    ///

    /// for unfollow or friend to add in other person profile

    let tempFollowers = [];

    // if (tempFollowing.length >= 1) {
    myFollowings1 = await firestore()
      .collection('users')
      .doc(item.id)
      .get()
      .then(snapshot => {
        tempFollowers = snapshot._data.followers;
      })
      .catch(error => {
        console.log(error);
      });
    tempFollowers.map(item4 => {
      if (item4 == userId) {
        firestore()
          .collection('users')
          .doc(item.id)
          .update({
            followers: firestore.FieldValue.arrayRemove(userId.toString()),
          })
          .then(res => {})
          .catch(error => {
            console.log(error);
          });
        console.log(
          'DDDDDDDDDDDDDDDDDDDDDDDelete folloooooooooower::' + userId,
        );
        //    Alert.alert("You have unfollowed " + userId);
      }
    });

    getUserData();
    setOnFollow(!onfollow);

    setOnFollowClick(!onFollowClick);
    console.log(
      'uuuuuuuuuuunnnnnfollowwwwwwwwwwwwwwww ssssssssstattttttttttttus ' +
        onFollowClick,
    );
    // closeUserProfileModal();
    //
  };
  const followFunction = async item => {
    let tempFollowing = [];
    let sendNotificationTo;

    // if (tempFollowing.length >= 1) {
    myFollowings = await firestore()
      .collection('users')
      .doc(userId)
      .get()
      .then(snapshot => {
        tempFollowing = snapshot._data.following;
      })
      .catch(error => {
        console.log(error);
      });
    // itemValue = item._data.id;
    console.log('bring me following list :: ' + tempFollowing);

    if (tempFollowing.length > 0) {
      tempFollowing.map(item2 => {
        if (item2 !== item.id) {
          firestore()
            .collection('users')
            .doc(auth().currentUser?.uid)
            .update({
              following: firestore.FieldValue.arrayUnion(
                item.id.toString(),
              ),
            })
            .then(res => {})
            .catch(error => {
              console.log(error);
            });
          console.log(
            'UUUUUUUUUUUUUUion 2nd array::' + item.id.toString(),
          );
          // Alert.alert("You are now following " + item._data.name);
          let followerFcmToken =
            'f5VcFwQgT0SV41BFd2vloW:APA91bHRerOP3U0mZVEt_umd8qazsfnI0OGPblqNp8MoK5AOWjOlH5b-psmt7QKSlbJ-JncLTFLo2akXLanJ3rrzhpt7mYml5bjec0RZo2LhTKFgZZ14BRuYPdy6QD1gm1IttpG4lp3u';
          // setMyFollowerName(item._data.name);
          //later
          getFcmTokenForNotification(item.id, item.name)
          // sendNotification(item._data.fcmToken.toString());
          console.log(
            'send notification to fcm token == ' +
              item.fcmToken.toString(),
          );
        } else if (item2 === item.id) {
          //     Alert.alert("You are already following " + item._data.name);
        }
      });
      isUserFollowed = true;
    } else {
      firestore()
        .collection('users')
        .doc(auth().currentUser?.uid)
        .update({
          following: firestore.FieldValue.arrayUnion(item.id.toString()),
        })
        .then(res => {
          // let followerFcmToken = 'f5VcFwQgT0SV41BFd2vloW:APA91bHRerOP3U0mZVEt_umd8qazsfnI0OGPblqNp8MoK5AOWjOlH5b-psmt7QKSlbJ-JncLTFLo2akXLanJ3rrzhpt7mYml5bjec0RZo2LhTKFgZZ14BRuYPdy6QD1gm1IttpG4lp3u'
          // setMyFollowerName(item._data.name);
          //later
          getFcmTokenForNotification(item.id, item.name)
          // sendNotification(item._data.fcmToken.toString());
          console.log(
            'send notification to fcm token == ' +
              item.fcmToken.toString(),
          );
        })
        .catch(error => {
          console.log(error);
        });
      console.log('UUUUUUUUUUUUUUion 2nd array::' + item.id.toString());
      // Alert.alert("You are now following " + item._data.name);
    }
    Alert.alert('You are now following ' + item.name);

    ////
    ////  Adding followers to other users profile
    ////

    // let tempFollowers = item._data.followers;
    let tempFollowers = [];

    myFollowers = await firestore()
      .collection('users')
      .doc(item.id)
      .get()
      .then(snapshot => {
        tempFollowers = snapshot._data.followers;

        setMyFollowerName(userName);
      })
      .catch(error => {
        console.log(error);
      });
    // itemValue = item._data.id;
    console.log('bring me followers list :: ' + tempFollowers);

    if (tempFollowers.length > 0) {
      tempFollowers.map(item3 => {
        if (item3 !== userId) {
          firestore()
            .collection('users')
            .doc(item.id)
            .update({
              followers: firestore.FieldValue.arrayUnion(userId.toString()),
            })
            .then(res => {
              setMyFollowerName(userName);
            })
            .catch(error => {
              console.log(error);
            });
          console.log(
            'UUUUUUUUUUUUUUion 2nd array followwwwwwwwwers::' +
              userId.toString(),
          );
          //        Alert.alert("You are now folllllllllllowed by   " + userId);
        } else if (item3 === userId) {
          //         Alert.alert("You Have Already Followeeeeeeeeeeeeed " + userId);
        }
      });
    } else {
      firestore()
        .collection('users')
        .doc(item.id)
        .update({
          followers: firestore.FieldValue.arrayUnion(userId.toString()),
        })
        .then(res => {
          console.log(
            'UUUUUUUUUUUUUUion 2nd array followwwwwwwwwers::' +
              userId.toString(),
          );
          //       Alert.alert("You are now folllllllllllowed by   " + userId);

          setMyFollowerName(userName);
        })
        .catch(error => {
          console.log(error);
        });
    }

    console.log(
      'followwwwwwwwwwwwwwww ssssssssstattttttttttttus ' + onFollowClick,
    );
    let tempMyFollowing = '';
    tempMyFollowing = await firestore()
      .collection('users')
      .doc(item.id)
      .get()
      .then(snapshot => {
        tempMyFollowing = snapshot._data.followers;
        sendNotificationTo = snapshot._data.fcmToken;
        if (tempMyFollowing === userId) {
          setStatusUpdate('unFollow');
        } else {
          setStatusUpdate('Follow');
        }
      })
      .catch(error => {
        console.log(error);
      });
    getUserData();
    setOnFollow(!onfollow);

    setOnFollowClick(!onFollowClick);
    // closeUserProfileModal();
    // sendNotification(sendNotificationTo.toString(), item);
  };
  // getFcmTokenForNotification(item.id, item.name)
  const getFcmTokenForNotification=(followerId, followerName)=>{
    console.log('user list data for notification == '+userList)
    let fcmToken;
    userList.map(item=>{
      if (item.id === followerId){
        fcmToken = item.fcmToken;
        console.log('id of poster == ',item.id)
      }
      // if (item.id === myID){
      //   fcmToken = item.fcmToken
      //   console.log('My Id Here On Join Pressed == ',item.id)
      // }
    })
    console.log('My FcmToken Here On Join Pressed == ',fcmToken)
    dispatch(UserFollowingNotification(followerName,myName,fcmToken));
  }
  const token = '';
  //= 'f5VcFwQgT0SV41BFd2vloW:APA91bHRerOP3U0mZVEt_umd8qazsfnI0OGPblqNp8MoK5AOWjOlH5b-psmt7QKSlbJ-JncLTFLo2akXLanJ3rrzhpt7mYml5bjec0RZo2LhTKFgZZ14BRuYPdy6QD1gm1IttpG4lp3u'
  // 'e1_GAivZQsOjGfn7UykJuy:APA91bGyc96LVn3_LQM4P3zumCS4vQoKO0WLlgMlCtL_ND-DYvxzLNm3V8bhlDkRoF-f7ytiRue3rs2Aeztzdsa7hTFCiYlr7Cd_-klKzipgADEHI3LGytCpgCu6RNCPs3C0PNJ1iUfA'
  const sendNotification = async (token, item) => {
    // var axios = require('axios');
    var data = JSON.stringify({
      data: {},
      notification: {
        body: myFollowerName + ' is now following you',
        title: 'Check what he is upto?' + ' ',
      },
      to: token,
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
      })
      .catch(function (error) {
        console.log(error);
      });

      firestore()
      .collection('notifications')
      .doc(item._data.id)
      .update({
        messageTitle: firestore.FieldValue.arrayUnion(myFollowerName + ' is now following you'),
      })
      .then(res => {
        setMyFollowerName(userName);
      })
      .catch(error => {
        console.log(error);
      });


  };
  const getFollowStatus = followers => {
    let status = false;
    // if (followers.length > 0) {
    // myTotalFollowers
    following.map(item => {
      // if (item == userId) {
        if (item == followers.id) {
        status = true;
        // setOnFollowClick(true);
        // console.log('followed by user id ' + userId);
      } else {
        status = false;
        // setOnFollowClick(false);
      }
    });
    // }
    return status;
  };
  const navigateMessageScreen = async item => {
    setLoading(false);

    setShowOtherUserInfoModal(false);
    console.log('Item data ::' + item);
    console.log('My User Name ::' + myUserName);
    console.log('My Profile IMage ::' + myProfileImage);
    //later
    navigation.navigate('Messages', {
      data: item,
      id: userId,
      name:myUserName,
      myProfileImage: myProfileImage,
    });
    
    // navigation.navigate('Messages',{data:item, id:userId, myProfileImage:myProfileImage});
  };
  const openProfileScreen = () => {
    //later
    navigation.navigate('ProfileScreen');
  };
  const getSelectUserFollowers =async (item)=>{
    let tempMembers =[]
    let tempMyEventMembers = []
    await firestore().collection('users').doc(item.id)
    .get()
    .then(snapshot => {
      tempMembers = snapshot._data.followers;
      // tempMyEventMembers = snapshot._data.eventMembersList;
      console.log("My Event Memebrs Req list :: " + tempMembers);
      setMyTotalFollowers(tempMembers);

      console.log("My total Event Memebrs Req :: " + tempMembers.length);
    })
    .catch(error => {
      console.log(error)
    });


  }
  const selectedUserModal = item => {
    setSelectedUser(item);
    setSelectedId(item.id)
    setShowOtherUserInfoModal(true);
    getSelectUserFollowers(item);
  };

  const FinalModal = props => {
    return (
      <View
        style={{
          flex: 1,
          height: '95%',
          width: '90%',
          alignSelf: 'center',
          borderBottomRightRadius: 30,
          borderBottomLeftRadius: 30,
          marginTop: 15,
          borderRadius: 30,
          shadowColor: '#0000FF',
          backgroundColor: 'black',
          borderWidth: 0.3,
          borderColor: 'black',
          shadowOffset: {
            width: 12,
            height: 12,
          },
          shadowOpacity: 1,
          shadowRadius: 20.0,

          elevation: 24,
          // shadowOffset:20,shadowColor:'black', shadowOpacity:1, shadowRadius:100, elevation:5
        }}>
        {/* <ScrollView
                showsVerticalScrollIndicator={false}
                > */}
        <View
          style={{
            height: '57%',
            backgroundColor: 'black',
            width: '100%',
            alignSelf: 'center',
            borderBottomRightRadius: 30,
            borderBottomLeftRadius: 30,
            borderRadius: 30,
            // borderTopWidth: 30, borderColor: 'orange'
          }}>
          <View
            style={[
              styles.userProfileContainer,
              {
                height: 400,
                width: '100%',
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                borderBottomRightRadius: 30,
                borderBottomLeftRadius: 30,
              },
            ]}>
              <View style={{flexDirection:'row', justifyContent:'space-evenly', padding:10}}>
              <TouchableOpacity onPress={()=>setShowOtherUserInfoModal(false)}
              style={[
                { marginRight:120},
              ]}
              >
              <Image
              source={require('../Images/back.png')}
              style={[
                { height: 30, width: 35, borderRadius: 20, tintColor:'white'},
              ]}
            />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>setShowOtherUserInfoModal(false)}
              style={[
                {marginLeft:120},
              ]}
              >
              <Image
              source={require('../Images/close.png')}
              style={[
                { height: 40, width: 40, borderRadius: 20, tintColor:'white'},
              ]}
            />
              </TouchableOpacity>
              </View>
            
              
              <Image
              source={{uri: props.selectedUser.profileImage}}
              style={[
                styles.user_Image,
                {height: 100, width: 100, borderRadius: 50},
              ]}
            />
            
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 20, color: 'white', fontWeight: '600'}}>
                {props.selectedUser.name},{' '}
              </Text>
              <Text style={{fontSize: 20, color: 'white', fontWeight: '600'}}>
                {props.selectedUser.age}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
                marginTop: 40,
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 40,
                }}>
                <Text style={styles.EventPhotosNo}>
                  {props.selectedUser.eventsPosted <= 9
                    ? '0' + props.selectedUser.eventsPosted
                    : props.selectedUser.eventsPosted}
                </Text>
                <Text
                  style={[
                    styles.EventPhotosNo,
                    {color: '#999999', fontWeight: '500'},
                  ]}>
                  Events{' '}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 40,
                }}>
                <Text style={styles.EventPhotosNo}>
                  {props.selectedUser.followers.length <= 9
                    ? '0' + props.selectedUser.followers.length
                    : props.selectedUser.followers.length}
                </Text>
                <Text
                  style={[
                    styles.EventPhotosNo,
                    {color: '#999999', fontWeight: '500'},
                  ]}>
                  Followers
                </Text>
              </View>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.EventPhotosNo}>
                  {props.selectedUser.following.length <= 9
                    ? '0' + props.selectedUser.following.length
                    : props.selectedUser.following.length}
                </Text>
                <Text
                  style={[
                    styles.EventPhotosNo,
                    {color: '#999999', fontWeight: '500'},
                  ]}>
                  Following
                </Text>
              </View>
            </View>
            {/* message and follow button view */}
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <TouchableOpacity
                style={[styles.userButton, {marginTop: 30}]}
                onPress={() =>
                  followingState
                  // getFollowStatus(props.selectedUser.followers)
                    ? unfollowUser(selectedUser)
                    : followFunction(selectedUser)
                }>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={require('../Images/add-friend.png')}
                    style={{
                      height: 15,
                      width: 15,
                      alignSelf: 'center',
                      marginLeft: 10,
                      marginTop: 2,
                      tintColor: 'white',
                    }}
                  />
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 14,
                      margin: 10,
                      fontWeight: '700',
                    }}>
                    {
                      followingState
                    // getFollowStatus(props.selectedUser.followers)
                      ? 'Unfollow'
                      : 'Follow'
                      }
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.userButton, {flexDirection: 'row'}]}
                // onPress={() => sendNotification(token)}
                // onPress={() => navigateMessageScreen(item)}
                onPress={() => {
                  console.log('My USER NAME HERE '+ myUserName+' Profile Image '+ myProfileImage),
                 //later
                  navigation.navigate('Messages', {
                    data: props.selectedUser,
                    id: userId,
                    name: myUserName,
                    myProfileImage: myProfileImage,
                  }),
                    setShowOtherUserInfoModal(false);
                }}
                // onPress=
                // {() =>
                //      navigation.navigate('Messages', { data: modalData, id: userId, myProfileImage: myProfileImage })
                // }
              >
                {}
                <Image
                  source={require('../Images/user-info.png')}
                  style={{
                    height: 15,
                    width: 15,
                    alignSelf: 'center',
                    marginLeft: 10,
                    marginTop: 2,
                    tintColor: 'white',
                  }}
                />
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 12,
                    margin: 10,
                    fontWeight: '700',
                  }}>
                  Messages
                </Text>
              </TouchableOpacity>
            </View>
            {/* message button view */}
          </View>
          <View style={{backgroundColor: 'black', borderRadius: 30}}>
            <Text
              style={{
                fontSize: 23,
                color: 'white',
                margin: 15,
                fontWeight: '700',
              }}>
              Photos
            </Text>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: '100%',
              }}>
              {props.selectedUser.photos.length ? (
                props.selectedUser.photos
                  .map((photos, myIndex) => {
                    return (
                      <View
                        key={myIndex}
                        style={{height: 100, width: '30%', margin: 5}}
                        //  style={{flexDirection:'row', height:150, width:'45%'}}
                      >
                        {/* <Text style={styles.item}>{person.name}</Text> */}
                        {/* <View style={{ height: 150, width: '45%' }}> */}
                        <TouchableOpacity
                        // onPress={() => {setImageFullModal(!imageFullModal), setFullImage(true)}}
                        >
                          {imageFullModal == false ? (
                            <Image
                              source={{uri: photos}}
                              style={{
                                height: 100,
                                width: '100%',
                                borderWidth: 1,
                                borderColor: 'black',
                                borderRadius: 10,
                              }}
                            />
                          ) : (
                            <ScrollView
                              horizontal={true}
                              pagingEnabled
                              decelerationRate={0.5}>
                              <Modal
                                visible={imageFullModal}
                                onRequestClose={() => {
                                  setImageFullModal(false);
                                }}>
                                {/* <TouchableOpacity onPress={() => setImageFullModal(false)}> */}

                                <View
                                  style={{
                                    height: Dimensions.get('window').height,
                                    width: Dimensions.get('window').width,
                                  }}>
                                  <Image
                                    source={{uri: photos}}
                                    style={{
                                      // height: Dimensions.get('window').height,
                                      // width: Dimensions.get('window').width,
                                      resizeMode: 'contain',
                                      borderWidth: 1,
                                      borderColor: 'black',
                                      borderRadius: 10,
                                    }}
                                  />
                                </View>

                                {/* </TouchableOpacity> */}
                              </Modal>
                            </ScrollView>
                          )}
                          {/* Dimensions.get('window').height
Dimensions.get('window').width */}
                        </TouchableOpacity>
                        {/* </View> */}
                      </View>
                    );
                  })
                  .reverse()
              ) : (
                <Text
                  style={{
                    fontSize: 20,
                    alignSelf: 'center',
                    fontWeight: '500',
                    color: 'black',
                    marginBottom: 30,
                  }}>
                  No Photos to show{' '}
                </Text>
              )}
            </View>
            {/* <Image source={require('../Images/plus.png')}
                                style={{ height: 100, width: 100, margin: 5, tintColor: 'black' }}
                            />
                            <Image source={require('../Images/plus.png')}
                                style={{ height: 100, width: 100, margin: 5, tintColor: 'black' }}
                            />
                            <Image source={require('../Images/plus.png')}
                                style={{ height: 100, width: 100, margin: 5, tintColor: 'black' }}
                            />
                            <Image source={require('../Images/plus.png')}
                                style={{ height: 100, width: 100, margin: 5, tintColor: 'black' }}
                            /> */}
          </View>
          <View style={{width: '100%', marginLeft: 10}}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#808080',
                marginTop: 20,
              }}>
              About Me
            </Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '600',
                color: 'white',
                width: '90%',
                alignSelf: 'center',
              }}>
              {props.selectedUser.about
                ? props.selectedUser.about
                : 'Not Available'}
            </Text>
          </View>
          <View style={{width: '100%', marginLeft: 10}}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#808080',
                marginTop: 20,
              }}>
              Interests
            </Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '600',
                color: 'white',
                marginBottom: 20,
                width: '90%',
                alignSelf: 'center',
              }}>
              {props.selectedUser.interest
                ? props.selectedUser.interest
                : 'Not Available'}
            </Text>
          </View>
          <View style={{width: '100%', marginLeft: 10}}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#808080',
                marginTop: 20,
              }}>
              Work
            </Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '600',
                color: 'white',
                marginBottom: 20,
                width: '90%',
                alignSelf: 'center',
              }}>
              {props.selectedUser.work
                ? props.selectedUser.work
                : 'Not Available'}
            </Text>
          </View>
          <View style={{width: '100%', marginLeft: 10}}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#808080',
                marginTop: 20,
              }}>
              Education
            </Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '600',
                color: 'white',
                marginBottom: 20,
                width: '90%',
                alignSelf: 'center',
              }}>
              {props.selectedUser.education
                ? props.selectedUser.education
                : 'Not Available'}
            </Text>
          </View>
          {/* <View style={{width: '100%', marginLeft: 10}}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: '#808080',
                marginTop: 20,
              }}>
              Location
            </Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '600',
                color: 'white',
                marginBottom: 20,
                width: '90%',
                alignSelf: 'center',
              }}>
              {
              props.selectedUser._data.location !==''
                ? props.selectedUser._data.location
                : 'Not Available'}
            </Text>
          </View> */}
        </View>
        {/* </ScrollView> */}
        {/* <TouchableOpacity onPress={() => closeUserProfileModal()}>
                <View style={{ height: 70, width: 150, borderRadius: 20, backgroundColor: 'black', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: '500', color: 'red' }}>close</Text>

                </View>
            </TouchableOpacity> */}
      </View>
    );
  };
  return (
    <View style={{height: '100%', width: '100%', backgroundColor:'black'}}>
      {/* <Video
        source={require('../Images/video.mp4')}
        paused={false}
        style={styles.backgroundVideo}
        autoplay={true}
        repeat={true}
        muted={false}
        volume={1.0}
        resizeMode={'cover'}
      /> */}
      <Loader visible={Loading} />

      <View style={styles.topBar}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            padding: 10,
          }}>
          <View
            style={{
              // justifyContent: 'center', alignItems: 'center',
              borderRadius: 25,
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
              //  marginTop: 100, marginRight: 10,
            }}>
            <TouchableOpacity
              onPress={() => setFilterModal(true)}
              style={{flexDirection: 'row'}}>
              <View
                style={{
                  height: 50,
                  width: 90,
                  backgroundColor: '#202A44',
                  flexDirection: 'row',
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'white',
                }}>
                <Image
                  source={require('../Images/filter.png')}
                  style={{height: 30, width: 30, tintColor: 'white'}}
                />
                <Text style={{color: 'white', fontSize: 18, fontWeight: '600'}}>
                  Filter
                </Text>
              </View>
            </TouchableOpacity>
          
          </View>
      
        </View>
      </View>
      <View
        style={{
          borderBottomWidth: 2,
          borderBottomColor: '#707070',
          width: '100%',
          
        }}
      />
      <View style={styles.list}>
        {
        //userList !== null || userList == '' ?
        users ? (
          <FlatList
            style={{height: '100%'}}
            data={users}
            numColumns={2}
            renderItem={({item, index}) => {
              return (
                <View style={styles.userContainer}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center', //flexDirection: 'row'
                    }}>
                    <TouchableOpacity onPress={() => selectedUserModal(item)}>
                      <Image
                        source={
                          item.profileImage == '' 
                            ? require('../Images/user.png')
                            : {uri: item.profileImage}
                        }
                        style={styles.user_Image}
                      />
                    </TouchableOpacity>
                    <View style={{marginBottom: 20, flexDirection: 'row'}}>
                      <Text style={styles.userText}>
                        {
                        item.name.substring().length <= 5
                          ? `${item.name}`
                          // ?item._data.name
                          : `${item.name.substring(0, 5)}...`
                          }
                        ,{item.age}
                      </Text>
                    </View>
                  </View>
                  <View>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 22, fontWeight: '600', color: 'red'}}>
              {expandSearch}
            </Text>
          </View>
        )}
      </View>

      <GestureRecognizer
        style={{flex: 1}}
        onSwipeDown={() => setShowOtherUserInfoModal(false)}
        onSwipeRight={() => setShowOtherUserInfoModal(false)}
        onSwipeLeft={() => setShowOtherUserInfoModal(false)}>
        <Modal
          visible={otherUserInfoModal}
          onRequestClose={() => {
            setShowOtherUserInfoModal(false);
          }}>
          <View
            style={{
              flex: 1,
              shadowColor: '#000',
              backgroundColor: '#1c1c1c',
              borderWidth: 0.3,
              borderColor: 'white',
              shadowOffset: {
                width: 12,
                height: 12,
              },
              shadowOpacity: 1,
              shadowRadius: 20.0,

              elevation: 24,
            }}>
            <ScrollView>
              <FinalModal selectedUser={selectedUser} />
            </ScrollView>
          </View>
        </Modal>
      </GestureRecognizer>
      <GestureRecognizer
        style={{flex: 1}}
        // onSwipeUp={() => setShowOtherUserInfoModal(true)}
        onSwipeDown={() => setShowOtherUserInfoModal(false)}>
        <Modal
          visible={false}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setShowOtherUserInfoModal(false);
          }}>
          <View
            style={{
              height: '95%',
              width: '90%',
              alignSelf: 'center',
              borderBottomRightRadius: 30,
              borderBottomLeftRadius: 30,
              marginTop: 15,
              borderRadius: 30,
              shadowColor: '#000',
              backgroundColor: 'white',
              borderWidth: 0.3,
              borderColor: 'black',
              shadowOffset: {
                width: 12,
                height: 12,
              },
              shadowOpacity: 1,
              shadowRadius: 20.0,

              elevation: 24,
              // shadowOffset:20,shadowColor:'black', shadowOpacity:1, shadowRadius:100, elevation:5
            }}>
            <ScrollView>
              <View
                style={{
                  height: '57%',
                  backgroundColor: 'white',
                  width: '100%',
                  alignSelf: 'center',
                  borderBottomRightRadius: 30,
                  borderBottomLeftRadius: 30,
                  borderRadius: 30,
                  // borderTopWidth: 30, borderColor: 'orange'
                }}>
                <View
                  style={[
                    styles.userProfileContainer,
                    {
                      height: 400,
                      width: '100%',
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      borderBottomRightRadius: 30,
                      borderBottomLeftRadius: 30,
                    },
                  ]}>
                  <Image
                    source={{uri: otherUserProfileImage}}
                    style={[
                      styles.user_Image,
                      {height: 100, width: 100, borderRadius: 50},
                    ]}
                  />
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{fontSize: 20, color: 'white', fontWeight: '600'}}>
                      {otherUserName},{' '}
                    </Text>
                    <Text
                      style={{fontSize: 20, color: 'white', fontWeight: '600'}}>
                      {otherUserAge}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 10,
                      marginTop: 40,
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 40,
                      }}>
                      <Text style={styles.EventPhotosNo}>
                        {otherUserEventsPosted <= 9
                          ? '0' + otherUserEventsPosted
                          : otherUserEventsPosted}
                      </Text>
                      <Text
                        style={[
                          styles.EventPhotosNo,
                          {color: '#999999', fontWeight: '500'},
                        ]}>
                        Events{' '}
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 40,
                      }}>
                      <Text style={styles.EventPhotosNo}>
                        {otherUserFollowers <= 9
                          ? '0' + otherUserFollowers
                          : otherUserFollowers}
                      </Text>
                      <Text
                        style={[
                          styles.EventPhotosNo,
                          {color: '#999999', fontWeight: '500'},
                        ]}>
                        Followers
                      </Text>
                    </View>
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={styles.EventPhotosNo}>
                        {otherUserFollowing <= 9
                          ? '0' + otherUserFollowing
                          : otherUserFollowing}
                      </Text>
                      <Text
                        style={[
                          styles.EventPhotosNo,
                          {color: '#999999', fontWeight: '500'},
                        ]}>
                        Following
                      </Text>
                    </View>
                  </View>
                  {/* message and follow button view */}
                  <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                    <TouchableOpacity
                      style={[styles.userButton, {marginTop: 30}]}
                      onPress={() =>
                        getFollowStatus(otherUserFollowersList)
                          ? unfollowUser(modalData)
                          : followFunction(modalData)
                      }>
                      <View style={{flexDirection: 'row'}}>
                        <Image
                          source={require('../Images/add-friend.png')}
                          style={{
                            height: 15,
                            width: 15,
                            alignSelf: 'center',
                            marginLeft: 10,
                            marginTop: 2,
                            tintColor: 'white',
                          }}
                        />
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 14,
                            margin: 10,
                            fontWeight: '700',
                          }}>
                          {getFollowStatus(otherUserFollowersList)
                            ? 'Unfollow'
                            : 'Follow'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.userButton, {flexDirection: 'row'}]}
                      // onPress={() => sendNotification(token)}
                      onPress={() => navigateMessageScreen(modalData)}
                      // onPress=
                      // {() =>
                      //      navigation.navigate('Messages', { data: modalData, id: userId, myProfileImage: myProfileImage })
                      // }
                    >
                      {}
                      <Image
                        source={require('../Images/user-info.png')}
                        style={{
                          height: 15,
                          width: 15,
                          alignSelf: 'center',
                          marginLeft: 10,
                          marginTop: 2,
                          tintColor: 'white',
                        }}
                      />
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 12,
                          margin: 10,
                          fontWeight: '700',
                        }}>
                        Messages
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* message button view */}
                </View>
                <View style={{backgroundColor: 'white', borderRadius: 30}}>
                  <Text
                    style={{
                      fontSize: 23,
                      color: 'black',
                      margin: 15,
                      fontWeight: '700',
                    }}>
                    Photos
                  </Text>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      width: '100%',
                    }}>
                    {otherUserPhotos.length ? (
                      otherUserPhotos
                        .map((photos, myIndex) => {
                          return (
                            <View
                              key={myIndex}
                              style={{height: 100, width: '30%', margin: 5}}
                              //  style={{flexDirection:'row', height:150, width:'45%'}}
                            >
                              {/* <Text style={styles.item}>{person.name}</Text> */}
                              {/* <View style={{ height: 150, width: '45%' }}> */}
                              <TouchableOpacity
                                onPress={() => [
                                  setImageFullModal(!imageFullModal),
                                ]}>
                                {imageFullModal ? (
                                  <Image
                                    source={{uri: photos}}
                                    style={{
                                      height: 100,
                                      width: '100%',
                                      borderWidth: 1,
                                      borderColor: 'black',
                                      borderRadius: 10,
                                    }}
                                  />
                                ) : (
                                  <ScrollView
                                    horizontal={true}
                                    pagingEnabled
                                    decelerationRate={0.5}>
                                    {/* <TouchableOpacity onPress={() => setImageFullModal(false)}> */}
                                    <Image
                                      source={{uri: photos}}
                                      style={{
                                        height: Dimensions.get('window').height,
                                        width: Dimensions.get('window').width,
                                        resizeMode: 'contain',
                                        borderWidth: 1,
                                        borderColor: 'black',
                                        borderRadius: 10,
                                      }}
                                    />
                                    {/* </TouchableOpacity> */}
                                  </ScrollView>
                                )}
                                {/* Dimensions.get('window').height
Dimensions.get('window').width */}
                              </TouchableOpacity>
                              {/* </View> */}
                            </View>
                          );
                        })
                        .reverse()
                    ) : (
                      <Text
                        style={{
                          fontSize: 20,
                          alignSelf: 'center',
                          fontWeight: '500',
                          color: 'black',
                          marginBottom: 30,
                        }}>
                        No Photos to show{' '}
                      </Text>
                    )}
                  </View>
                  {/* <Image source={require('../Images/plus.png')}
                                        style={{ height: 100, width: 100, margin: 5, tintColor: 'black' }}
                                    />
                                    <Image source={require('../Images/plus.png')}
                                        style={{ height: 100, width: 100, margin: 5, tintColor: 'black' }}
                                    />
                                    <Image source={require('../Images/plus.png')}
                                        style={{ height: 100, width: 100, margin: 5, tintColor: 'black' }}
                                    />
                                    <Image source={require('../Images/plus.png')}
                                        style={{ height: 100, width: 100, margin: 5, tintColor: 'black' }}
                                    /> */}
                </View>
                <View style={{width: '100%', marginLeft: 10}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: 'black',
                      marginTop: 20,
                    }}>
                    About Me
                  </Text>
                  <Text
                    style={{fontSize: 22, fontWeight: '600', color: 'black'}}>
                    {otherUserAbout ? otherUserAbout : 'Not Available'}
                  </Text>
                </View>
                <View style={{width: '100%', marginLeft: 10}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: 'black',
                      marginTop: 20,
                    }}>
                    Interests
                  </Text>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: '600',
                      color: 'black',
                      marginBottom: 20,
                    }}>
                    {otherUserInterests ? otherUserInterests : 'Not Available'}
                  </Text>
                </View>
                <View style={{width: '100%', marginLeft: 10}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: 'black',
                      marginTop: 20,
                    }}>
                    Work
                  </Text>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: '600',
                      color: 'black',
                      marginBottom: 20,
                    }}>
                    {otherUserWork ? otherUserWork : 'Not Available'}
                  </Text>
                </View>
                <View style={{width: '100%', marginLeft: 10}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: 'black',
                      marginTop: 20,
                    }}>
                    Education
                  </Text>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: '600',
                      color: 'black',
                      marginBottom: 20,
                    }}>
                    {otherUserEducation ? otherUserEducation : 'Not Available'}
                  </Text>
                </View>
                <View style={{width: '100%', marginLeft: 10}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: 'black',
                      marginTop: 20,
                    }}>
                    Location
                  </Text>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: '600',
                      color: 'black',
                      marginBottom: 20,
                    }}>
                    {otherUserInterests ? otherUserInterests : 'Not Available'}
                  </Text>
                </View>
              </View>
            </ScrollView>
            {/* <TouchableOpacity onPress={() => closeUserProfileModal()}>
                        <View style={{ height: 70, width: 150, borderRadius: 20, backgroundColor: 'black', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: '500', color: 'red' }}>close</Text>

                        </View>
                    </TouchableOpacity> */}
          </View>
        </Modal>
      </GestureRecognizer>
      <Modal
        visible={false}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setImageFullModal(false);
        }}>
        <View style={{backgroundColor: 'black', height: '100%', width: '100%'}}>
          <ScrollView
            horizontal={true}
            pagingEnabled
            decelerationRate={0.5}
            // style={{ width: '100%', height: '40%' }}
          >
            {otherUserPhotos.length ? (
              otherUserPhotos
                .map((photos, myIndex) => {
                  indexOpen = myIndex;
                  return (
                    <View key={indexOpen}>
                      <Text style={{fontSize: 20, color: 'white'}}>
                        {indexOpen}{' '}
                      </Text>
                      {/* <Image source={{ uri: photos }}
                                style={{ height: 300, width: '95%', margin: 5, borderWidth: 1, borderColor: 'black', borderRadius: 10 }}
                              /> */}
                      {/* <Text style={{color:'white', fontSize:18, margin: 10}}>{index1}</Text> */}
                      <Image
                        source={{uri: photos}}
                        style={{
                          height: Dimensions.get('window').height,
                          width: Dimensions.get('window').width,
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  );
                })
                .reverse()
            ) : (
              <Text
                style={{
                  fontSize: 20,
                  alignSelf: 'center',
                  fontWeight: '500',
                  color: 'black',
                  marginBottom: 30,
                }}>
                No Photos to show{' '}
              </Text>
            )}
          </ScrollView>
        </View>
      </Modal>
      {/* filter modal */}
      <Modal
        visible={filterModal}
        transparent={true}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          alignContent: 'flex-end',
        }}
        onRequestClose={() => {
          setFilterModal(false);
        }}>
        <View
          style={{
            flex: 1,
            alignSelf: 'flex-end',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            height: '50%',
            width: '100%',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              alignSelf: 'flex-end',
              height: '95%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              borderWidth: 4,
              borderColor: 'purple',
            }}>
            <View
              style={{
                width: '90%',
                height: '90%',
                backgroundColor: 'white',
                marginBottom: 110,
                marginTop: 40,
              }}>
             
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '700',
                  color: '#707070',
                  margin: 20,
                }}>
                Gender
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setFilterGender('Male');
                    setFilterGenderAll('');
                  }}
                  style={{
                    marginLeft: 10,
                    width: 100,
                    height: 50,
                    backgroundColor:
                      filterGender == 'Male' ? 'blue' : 'white',
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth:2,
                    borderColor:'black'
                  }}>
                  <Text
                    style={{color:  filterGender == 'Male' ?'white':'black', fontSize: 20, fontWeight: '500'}}>
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setFilterGender('Female');
                    setFilterGenderAll('');
                  }}
                  style={{
                    width: 100,
                    height: 50,
                    backgroundColor:
                      filterGender == 'Female' ? 'blue' : 'white',
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth:2,
                    borderColor:'black'
                  }}>
                  <Text
                    style={{color: filterGender == 'Female' ? 'white':'black', fontSize: 20, fontWeight: '500'}}>
                    Female
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setFilterGenderAll('Both');
                    setFilterGender('');
                  }}
                  style={{
                    marginRight: 5,
                    width: 100,
                    height: 50,
                    backgroundColor:
                      filterGenderAll == 'Both' ? 'blue' : 'white',
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth:2,
                    borderColor:'black'
                  }}>
                  <Text
                    style={{color: filterGenderAll?'white':'black', fontSize: 20, fontWeight: '500'}}>
                    Both
                  </Text>
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  fontSize: 20,
                  color: '#707070',
                  fontWeight: '700',
                  margin: 10,
                }}>
                Age Range : {Math.floor(minAge)} to {Math.floor(maxAge)}
              </Text>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#707070',
                    fontWeight: '700',
                    margin: 10,
                  }}>
                  Minimum Age {Math.floor(minAge)}
                </Text>

                <Slider
                  style={{width: 300, height: 50}}
                  minimumValue={18}
                  maximumValue={100}
                  minimumTrackTintColor="black" //"#FFFFFF"
                  maximumTrackTintColor="blue" //"#000000"
                  onValueChange={value => setMinAge(value)}
                />
                <Text
                  style={{
                    fontSize: 20,
                    color: '#707070',
                    fontWeight: '700',
                    margin: 10,
                  }}>
                  Maximum Age {Math.floor(maxAge)}
                </Text>

                <Slider
                  style={{width: 300, height: 50}}
                  minimumValue={minAge}
                  maximumValue={100}
                  minimumTrackTintColor="black" //"#FFFFFF"
                  maximumTrackTintColor="blue" //"#000000"
                  // inverted={true}
                  onValueChange={value => setMaxAge(value)}
                />
                {/* <Text
                  style={{
                    fontSize: 20,
                    color: '#707070',
                    fontWeight: '700',
                    margin: 10,
                  }}>
                  Maximum Distance {Math.floor(maxDistance)} kM
                </Text> */}

                {/* <Slider
                  style={{width: 300, height: 50}}
                  minimumValue={10}
                  maximumValue={1000}
                  minimumTrackTintColor="black" //"#FFFFFF"
                  maximumTrackTintColor="blue" //"#000000"
                  // inverted={true}
                  onValueChange={value => setMaxDistance(value)}
                /> */}
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 50,
                  }}>
                  <TouchableOpacity
                    onPress={() => showInterestModal()}
                    style={[
                      styles.userButton,
                      {
                        backgroundColor: 'white',
                        width: 250,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth:2,
                        borderColor:'black'
                      },
                    ]}>
                    <Text
                      style={{color: 'black', fontSize: 20, fontWeight: '400'}}>
                      Filter Interest
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 50,
                  }}>
                  <TouchableOpacity
                    onPress={() => userFilterData()}
                    style={[
                      styles.userButton,
                      {
                        backgroundColor: 'white',
                        width: 300,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth:2,
                        borderColor:'black'
                      },
                    ]}>
                    <Text
                      style={{color: 'black', fontSize: 20, fontWeight: '600'}}>
                      Apply Filters
                    </Text>
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
  );
};
const styles = StyleSheet.create({
  addButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    borderRadius: 50,
  },
  userProfileContainer: {
    height: 400,
    justifyContent: 'center',
    backgroundColor: '#202A44',
    borderWidth: 2,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  EventPhotosNo: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
    alignSelf: 'center',
  },
  userContainer: {
    justifyContent: 'center',
    backgroundColor: '#202A44',
    alignItems: 'center',
    // backgroundColor:'#202A44',#30313A
    width: '45%',
    height: 220,
    borderWidth: 0.5,
    borderColor: '#ff8501',
    borderRadius: 25,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  userMapping: {
    marginLeft: 10,
  },
  userText: {
    fontSize: 25,
    fontWeight: '500',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: -5,
    color: 'white',
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
    marginLeft: 10,
  },
  user_Image: {
    width: 82,
    height: 82,
    borderRadius: 41,
    margin: 8,
    borderWidth: 0.2,
    borderColor: '#ff8501',
    justifyContent: 'center',
  },
  customContainer: {
    backgroundColor: '#e5e5e5',
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
  },
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  topBar: {
    height: '10%',
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    flexDirection: 'row',
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: '#707070',
    marginTop: 10,
  },
  list: {
    height:'100%',
    alignSelf: 'center',
    marginTop: 1,
    height: '73%',
    // marginBottom: 10,
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
});
export default FriendsScreen;
//new permission
//allow read, write: if request.time #timestamp.date(2020, 9, 10);
//previous
//allow read, write: if true;
