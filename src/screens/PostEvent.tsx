import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, Modal, Dimensions, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
// import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Loader from './Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Time } from 'react-native-gifted-chat';
import MyEvents from './MyEvents';
import { useRoute, useNavigation, StackActions } from '@react-navigation/native';
import GestureRecognizer from 'react-native-swipe-gestures';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import { useSelector } from 'react-redux';

let name = ''
let email = ''
let userId = ''
let profileImage = ''
// let myFcmToken;
let getResult;
const PostEvent = () => {
  const navigation = useNavigation();

  const [imageData, setImageData] = useState();
  const [fullImaeRefPath, setFullImaeRefPath] = useState("");
  const [imgDownloadUrl, setImgDownloadUrl] = useState("");
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState();
  const [eventLocation, setEventLocation] = useState('');
  const [eventMembers, setEventMembers] = useState('0');

  const [eventDescription, setEventDescription] = useState('');
  const [eventName, setEventName] = useState('');
  const [caption, setCaption] = useState('');
  const [Loading, setLoading] = useState(false)
  const [uploadPhotoModal, setUploadPhotoModal] = useState(false);
  const [imageState, setImagestate] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const[myFcmToken, setMyFcmToken] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);


  const [locationModal, setLocationModal] = useState(false);
  const [markerPostion, setMarkerPosition] = useState();

  let getResult;

  const interests = [
    {
      interestName: 'Hobbies and Activities', index: 0,
    },
    { interestName: 'Professional Interests', index: 1, },
    { interestName: 'Health and Lifestyle', index: 2, },
    { interestName: 'Food and Dining', index: 3, },
    { interestName: 'Technology and Gaming', index: 4, },
    { interestName: 'Social Causes', index: 5, },
    { interestName: 'Travel', index: 6, },
    { interestName: 'Arts and Culture', index: 7, },
    { interestName: 'Learning and Education', index: 8, },
    { interestName: 'Regional and Cultural Interests', index: 9, },
    { interestName: 'Entertainment', index: 10, },
    { interestName: 'Dating And Party', index: 11, },
  ]
  const [selectedInterest, setSelectedInterest] = useState(null);
const [selectedView, setSelectedView] = useState();
const [interestModal, setInterestModal] = useState(false);

const [myFollowersFcmTokens, setMyFollowersFcmTokens] = useState([]);
  useEffect(() => {
    // setLoading(true);
    getFcmToken();
    // userDetails();
    setImagestate(false);
    myFollowerListData();

  }, [])
  const {mydata} = useSelector(state => state.myUserData);
  mydata && 
  mydata.map(item=>{
   userId = item.id;
   name = item.name;
   profileImage = item.profileImage;
   email = item.email;
  })
  const getFcmToken = async () => {
    //later
    // let fcmToken = await AsyncStorage.getItem('fcmToken');
    // console.log(fcmToken, "the old token")
    // if (!fcmToken) {
    //   try {
    //     let fcmToken = await messaging().getToken();

    //     if (fcmToken) {
    //       console.log(fcmToken, "new generated token");
    //       await AsyncStorage.setItem('fcmToken', fcmToken);
    //     }

    //   } catch (error) {
    //     console.log(error, 'error raised in fcmToken');
    //   }
    // }
    // setMyFcmToken(fcmToken)
    // console.log('My Fcm Token In Event Screen = '+myFcmToken)
  }
  const userDetails = async () => {
    name = await AsyncStorage.getItem('NAME');
    email = await AsyncStorage.getItem('EMAIL');
    profileImage = await AsyncStorage.getItem('profileImage');
    userId = await AsyncStorage.getItem('USERID');
    // myFcmToken = await AsyncStorage.getItem('MYFCMTOKEN');
    

    console.log("My Name " + name);
  }
  const showDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };
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
  }
  const showTimePicker = () => {
    setTimePickerVisibility(!isTimePickerVisible);
  };
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
  const uploadPhotoShowModal = () => {
    setImagestate(false);
    setUploadPhotoModal(true);
    setImageData();
  }
  const uploadPhotoModalHideCancel = () => {
    setUploadPhotoModal(!uploadPhotoModal);
    setImagestate(true);
    setImageData('');
    setCaption('');
    // if(imageData === imageData.assets[0].fileName){
    //   imageData=='';
    // }

  }
  const uploadPhotoModalHideConfirm = () => {
    setUploadPhotoModal(!uploadPhotoModal);
    // if(imageData === ''){
    //   imageData===imageData.assets[0].fileName;
    // }
    // if(imageData!== ''){
    //   setImagestate(false);
    //   setImageData(imageData.assets[0].fileName);
    // }
  }
  const openCamera = async () => {
 //later
    try {
      const result = await launchCamera({ mediaType: 'photo' });
      getResult = result;
      console.log('Image has been selected :: ' + getResult.assets[0].uri)

      //  }
      //  if(imageData !== null){
      setImageData(getResult)
      // console.warn('Image :'+ imageData!==null?imageData.assets[0].uri:null);
    } catch (error) {
      console.log(error.message)
    }


  }
  const openGallery = async () => {
    //later
    let result;

    try {
      result = await launchImageLibrary({ mediaType: 'photo' });
      //  if(result==null){

      getResult = result;
      console.log('Image has been selected :: ' + getResult.assets[0].uri)

      //  }
      //  if(imageData !== null){
      setImageData(getResult)
      //  }
    }

    catch (error) {
      console.log(error.message)
    }

    // if (imageData == null) {
    // }else{
    //   console.log("Image data null")
    // }
    // console.log(result.assets[0].uri);
  }

  const UploadEvent = async () => {
    try {
      if (eventName !== '' && eventDate !== '' && eventTime !== '' && eventDescription !== null
        && eventMembers !== '' && markerPostion !== null && imgDownloadUrl !== null
      ) {

        setLoading(true);

        let id = uuid.v4();
        const response = storage().ref(`/profile/${imageData.assets[0].fileName}`);
        const put = await response.putFile(imageData.assets[0].uri);
        console.log(response);
        // setFullImaeRefPath(put.metadata.fullPath);
        const url = await response.getDownloadURL();
        console.log(url);
        setImgDownloadUrl(url);
        firestore().collection('events').doc(id).set({
          img: url,
          caption: caption,
          name: name,
          email: email,
          postId: id,
          userId: userId,
          likes: [],
          comments:[],
          eventName: eventName,
          eventDate: eventDate,
          eventTime: eventTime,
          eventLocation: markerPostion,
          eventDescription: eventDescription,
          eventJoinRequests: [],
          postTimeDate: new Date(),
          profileImage: profileImage.toString(),
          members: Number(eventMembers),
          fcmTokens: myFcmToken,
          eventMembersList: [],
          interest: selectedInterest,
          status: 'Active',
        })
          .then(() => {
            console.log('Post added');
          })

        setLoading(false);

        Alert.alert("Event Posted Successfully");

        firestore()
          .collection('events')
          .get()
          .then(querySnapshot => {
            console.log('Total Events: ', querySnapshot.size);

            querySnapshot.forEach(documentSnapshot => {
              console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
            });
          });
      } else {
        Alert.alert("Please Fill All Details");
      }
    } catch (error) {
      console.log(error);
    }



    const data = await firestore().collection('users').doc(userId).
                get();
            // setMyData(data._data);
            const eventsPosted = data._data.eventsPosted;

 
    await firestore().collection('users').doc(userId).update({
      eventsPosted: eventsPosted + 1,
    })
      .then(() => {
        console.log('Profile Photo added');
        setLoading(false);
      })

      myFollowersFcmTokens.map(notifi=>{
        sendNotificationMessageSent(notifi);
      })

  }
  const sendNotificationMessageSent = async (notifi) => {
    
    // var axios = require('axios');

    // const notificationData =route.params.name + " send you a message at " + new Date();
    // setChatNotificationContent("notificationData");
    console.log("notifcation sent :: " + name);

    var data = JSON.stringify({
      data: {},
      notification: {
        body: name + ' Posted an Event ',
        title: 'New Event Posted, '+eventName,
      },
      to: notifi,
    });
    // setChatNotificationBody(JSON.stringify(data));
    // setChatNotificationTitle(JSON.stringify(data));
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
    // let tempNotificationCount;
    // await firestore()
    //   .collection('notifications')
    //   .doc(route.params.data.id)
    //   .get()
    //   .then(documentSnapshot => {
    //     console.log('User exists: ', documentSnapshot.exists);

    //     if (documentSnapshot.exists) {
    //       console.log('User data for events: ', documentSnapshot.data());
    //       console.log('User data for event notification counter :: ', documentSnapshot.data().notificationCounter);
    //       tempNotificationCount = documentSnapshot.data().notificationCounter;
    //       setChatNotificationCount(tempNotificationCount + 1)
    //       // setMyPhotos(documentSnapshot.data().photos)

    //     }

    //   });



    // await firestore()
    //   .collection('notifications')
    //   .doc(route.params.data.id)
    //   .update({
    //     notificationCounter: chatNotificationCount,
    //     messageContent: firestore.FieldValue.arrayUnion(route.params.name+ " Send you a message at "+new Date()),
    //     messageBody: firestore.FieldValue.arrayUnion(chatNotificationBody.toString()),
    //     messageTitle: firestore.FieldValue.arrayUnion(chatNotificationTitle.toString()),
    //     messageType: 'chat',
    //     receiverId: route.params.data.id,
    //     receiverToken: route.params.data.fcmToken,
    //     senderId: 'myUserId',
    //     senderToken: 'myFcmToken',
    //     senderProfileImage: route.params.myProfileImage,
    //     senderUserName: route.params.name,
    //     timeStamp: new Date(),
    //   }).then(res => {
    //     console.log("notifcation sent :: " + chatNotificationContent);
    //   }

    //   ).catch(error => {
    //     console.log(error);
    //   })

  };
  const myFollowerListData = async()=>{
    let tempMyFollowerList = [];
    let myFollowers = [];
    await firestore().collection('users').doc(auth().currentUser?.uid).get()
        .then(
            querySnapshot => {
                myFollowers = querySnapshot.data().followers;
                console.log("my followers data == " + myFollowers);
            })



            let tempUsers = [];
            var i;
            firestore().
            collection("users")
     //      .where('id', 'array-contains', 'myFollowers')
            .get()
            .then(
                querySnapshot => {
                        querySnapshot._docs.map((item) => {
                            console.log("My  list :" + item._data.id);
                            myFollowers.map(item1=>{
                                if (item._data.id == item1) {
                                    tempUsers.push(item._data.fcmToken);
                                    console.log("My followers name list :" + item._data.name, item._data.fcmToken);
                                  //  console.log('other people fcm token == '+item._data.fcmToken);
                             
                                }
                            })
                            // if (item._data.id == myFollowers) {
                            //     tempUsers.push(item);
                            //     console.log("My followers name list :" + item._data.name);
                            //   //  console.log('other people fcm token == '+item._data.fcmToken);
                         
                            // }
                        }
    
                        );
                    
                    setMyFollowersFcmTokens(tempUsers);
                    
                }
            );




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
  }
  return (
    // <KeyboardAwareScrollView extraHeight={120} enableOnAndroid>

    <View style={{ flex: 1, backgroundColor: 'white', height: '100%' }}>
      <Loader visible={Loading} />
      <View
      // style={styles.upperContainer}
      >
        {/* <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <TouchableOpacity onPress={() => setSelectedTab(0)}>
            <Text style={styles.headingStyle}>
              Create Event    |
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MyEvents')}>
            <Text style={styles.headingStyle}>
              My Events
            </Text>
          </TouchableOpacity>
        </View> */}
        {/* <Text style={{
          marginLeft: 20,
          fontSize: 20,
          color: 'black',
          marginRight: 20,
          color: imageData !== null ? 'black' : '#8e8e8e',
        }}
          onPress={() => {
            if (imageData !== null) {
              UploadImage();
            }
          }}
        >
          Upload
        </Text> */}
      </View>
      <GestureRecognizer
        style={{ flex: 1 }}
        onSwipeUp={() => setUploadPhotoModal(true)}
        onSwipeDown={() => setUploadPhotoModal(false)}
      >
        <Modal
          animationType='slide'
          visible={uploadPhotoModal}
          transparent={true}
          onRequestClose={() => { setUploadPhotoModal(false); }}

        >
          <View style={{ height: '85%', width: '95%', alignSelf: 'center', marginTop:50 }}>
            <View style={[styles.uploadImageModal]}>
              <Text style={{ fontWeight: '700', fontSize: 20, marginRight:100 }}>Add Event Image</Text>

              <View style={[styles.uploadImageBox]}>

                <View style={{ width: '90%', }}>
                  {
                    imageData && imageState == false ?
                      // <Text style={{color:'white', fontSize:15}}>Image Data:{imageData}</Text>
                      <Image source={{ uri: imageData.assets[0].uri }}
                        style={{ width: '100%', height: 200, borderRadius: 10, borderWidth: 1, borderColor: 'black', alignSelf: 'center', marginLeft: 20, marginTop: 10 }} />
                      :
                      <Text style={{color:'#707070', width: '100%', height: 200}}>                 Image will appear hear</Text>
                      // <Image source={require('../Images/add-image.png')}
                      //   style={{ width: '100%', height: 200,
                      //    borderRadius: 10,
                      //     borderWidth: 1, borderColor: 'black',
                      //     alignSelf: 'center',
                      //     marginLeft: 20, marginTop: 10,
                      //   shadowColor: "#000FFF",
                      //   shadowOffset: {
                      //     width: 0,
                      //     height: 6,
                      //   },
                      //   shadowOpacity: 0.58,
                      //   shadowRadius: 10.00,
                      //   // elevation: 12, 
                      // }}
                      // />
                  }

                </View>
                {/* <View
                  style={{ width: '90%', height: 190 }}
                >
                  <TextInput
                    placeholder='Type Caption Here Max Characters 300'

                    placeholderTextColor='black'
                    maxLength={300}
                    value={caption}
                    multiline={true} editable={true}
                    onChangeText={(text) => setCaption(text)}
                    style={{
                      width: '100%',
                      height: '80%',
                      borderColor: 'black',
                      color: 'black',
                      // backgroundColor: '#30313A',
                      borderWidth: 2,
                      borderEndColor: 'white',
                      marginLeft: 20,
                      marginTop: 10,
                      alignSelf: 'center',
                      borderRadius: 10,
                    }}
                  />
                </View> */}
               
                <TouchableOpacity style={[styles.button, { marginTop: 10, borderTopWidth:2, borderColor:'black' }]} onPress={() => openCamera()}>
                <Image source={require('../Images/camera.png')}
                  style={{ width: 30, height: 30, marginLeft: 20, borderRadius: 5, tintColor:'blue' }}
                />
                <Text style={{ marginLeft: 20, fontWeight: '700', color: 'black' }}>Open Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => openGallery()}>
                <Image source={require('../Images/gallery.png')}
                  style={{ width: 30, height: 30, marginLeft: 20, borderRadius: 5, tintColor:'green' }}
                />
                <Text style={{ marginLeft: 20, fontWeight: '700', color: 'black' }}>Open Gallery</Text>
              </TouchableOpacity>
              
              <View style={{ flexDirection: 'row', backgroundColor:'white',width:'100%' }}>
                <TouchableOpacity
                  style={[styles.UploadButton, { marginTop: 20, marginRight:40,
                     borderRadius:10, marginLeft:10,width:100, alignItems:'center', shadowColor: "#000FFF",
                     shadowOffset: {
                       width: 0,
                       height: 6,
                     },
                     shadowOpacity: 0.58,
                     shadowRadius: 10.00,
   
                     elevation: 12, }]}
                  onPress={() => uploadPhotoModalHideCancel()}
                >
                  <Text style={[styles.headingStyle, { justifyContent: 'center', margin: 5, fontWeight: '500', color: 'white' }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.UploadButton, { marginTop: 20, width:100, borderRadius:10,
                    alignItems:'center',  shadowColor: "#000FFF",
                    shadowOffset: {
                      width: 0,
                      height: 6,
                    },
                    shadowOpacity: 0.58,
                    shadowRadius: 10.00,
  
                    elevation: 12, }]}
                  onPress={() => uploadPhotoModalHideConfirm()}
                >
                  <Text style={[styles.headingStyle, { justifyContent: 'center', margin: 5, fontWeight: '500', color: 'white' }]}>
                    Post
                  </Text>
                </TouchableOpacity>
              </View>
              
              
              </View>


           
            </View>
          </View>
        </Modal>
      </GestureRecognizer>
      {
        selectedTab == 0 ?
          <View style={{
            flexDirection: 'row',
            borderWidth: 1,
            // width: '100%',
            height: '95%',
            borderColor: 'black',

            // justifyContent: 'space-evenly',
          }}>
            <View style={{
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 20,
              // margin: 15,
              marginRight: 5,
              marginLeft: 2,
              marginTop: 20,
              marginBottom: 20,
              // flex: 1,
              width: 400,
              backgroundColor: '#30313A'
            }}>
              {/* <Text 
          style={[styles.headingStyle, {color:'white' ,justifyContent: 'center', margin: 5, fontWeight: '600' }]}>
            Invite Friends</Text>

        </View>
        <View style={{
          borderWidth: 1,
          borderColor: 'black',
          borderRadius: 20,
          margin: 3,
          marginRight:5,
          width:240,
          // flex: 1,
          backgroundColor: '#30313A'
        }}> */}
              <KeyboardAwareScrollView extraHeight={120} enableOnAndroid>
                <ScrollView>
                  <View style={styles.createEventView}>
                    <Text
                      style={[styles.headingStyle, { justifyContent: 'center', margin: 5, fontWeight: '600', color: 'white' }]}>
                      Create Event</Text>

                    <Text
                      style={[styles.headingStyle, { justifyContent: 'center', margin: 2, fontWeight: '600', color: 'white' }]}>
                      Name</Text>
                    <TextInput placeholder='Enter Event Name' placeholderTextColor='white'
                      style={styles.createEventTextInput}
                      value={eventName}
                      onChangeText={(text) => setEventName(text)}

                    />
                    {/* <Loader visible={false}/> */}

                    <TouchableOpacity onPress={() => showDatePicker()} >
                      {
                        isDatePickerVisible === true ?
                          <View
                          //  style={{width:300, height:400, backgroundColor:"black", alignSelf:'center',marginBottom:200}}
                          >
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
                          : null
                      }


                      <Text
                        style={[styles.headingStyle, { justifyContent: 'center', margin: 2, fontWeight: '600', color: 'white' }]}>
                        Date</Text>
                      {
                        eventDate
                          ?
                          <Text style={styles.inputBox}>{eventDate}</Text>
                          :
                          <Text style={styles.inputBox}>Select Event Date</Text>

                      }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => showTimePicker()} >
                      <Text
                        style={[styles.headingStyle, { justifyContent: 'center', margin: 2, fontWeight: '600', color: 'white' }]}>
                        Time</Text>
                      {
                        isTimePickerVisible === true ?
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
                          : null
                      }



                      {
                        eventTime
                          ?
                          <Text style={styles.inputBox}>{eventTime}</Text>
                          :
                          <Text style={styles.inputBox}>Select Event Time</Text>

                      }
                    </TouchableOpacity>
                    <Text
                      style={[styles.headingStyle, { justifyContent: 'center', margin: 5, fontWeight: '600', color: 'white' }]}>
                      Select Interest</Text>
                      <TouchableOpacity onPress={()=>showInterestModal()}>
                        <Text style={styles.createEventTextInput}>{selectedInterest !== null ? selectedInterest:'Select Event Type'}</Text>
                      </TouchableOpacity>
                    <Text
                      style={[styles.headingStyle, { justifyContent: 'center', margin: 5, fontWeight: '600', color: 'white' }]}>
                      Location</Text>
                      <TouchableOpacity onPress={()=>setLocationModal(true)}>
                        <Text style={styles.createEventTextInput}>{markerPostion !== undefined ? 'selected':'Select Location on Map'}</Text>
                      </TouchableOpacity>
                    {/* <TextInput placeholder='Enter Event Location' placeholderTextColor='white'
                      style={styles.createEventTextInput}
                      value={eventLocation}
                      onChangeText={(text) => setEventLocation(text)}
                    /> */}
                    <Text
                      style={[styles.headingStyle, { justifyContent: 'center', margin: 5, fontWeight: '600', color: 'white' }]}>
                      Memebers</Text>
                    <TextInput placeholder='Memebers Allowed' placeholderTextColor='white'
                      style={[styles.createEventTextInput, { width: 100, marginLeft: 20, fontSize: 20 }]}
                      // inputMode='numeric'
                      keyboardType={'numeric'}
                      value={eventMembers}
                      onChangeText={(txt) => setEventMembers(txt)}
                    />
                    <Text
                      style={[styles.headingStyle, { justifyContent: 'center', margin: 5, fontWeight: '600', color: 'white' }]}>
                      Description</Text>
                    <TextInput placeholder='Enter Event Description' placeholderTextColor='white'
                      style={styles.createEventTextInput}
                      value={eventDescription}
                      onChangeText={(text) => setEventDescription(text)}
                    />
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity
                        style={[styles.UploadButton, { borderRadius: 5, height: 50, marginLeft: 20 }]}
                        onPress={() => uploadPhotoShowModal()}
                      >
                        <Text style={[styles.headingStyle, { justifyContent: 'center', margin: 5, fontWeight: '600', 
                        color: 'white', shadowColor: "#000FFF",
                        shadowOffset: {
                          width: 0,
                          height: 6,
                        },
                        shadowOpacity: 0.58,
                        shadowRadius: 10.00,
      
                        elevation: 24 }]}>
                          Add Photo
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => uploadPhotoShowModal()}
                      >
                        {
                          imageData ?
                            // <Text style={{color:'white', fontSize:15}}>Image Data:{imageData}</Text>
                            <Image source={{ uri: imageData.assets[0].uri }}
                              style={{ width: 70, height: 70, borderRadius: 10, marginLeft: 50, marginBottom: 5 }} />
                            :
                            <Image source={require('../Images/add-image.png')}
                              style={{ width: 70, height: 70, borderRadius: 10, marginLeft: 50, marginBottom: 5 }}
                            />
                        }
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={[styles.UploadButton, { width: 300, borderRadius: 10, backgroundColor: 'red', marginBottom: 20, alignSelf: 'center', marginRight: 40 }]}
                      onPress={() => UploadEvent()}
                    >
                      <Text
                        style={[styles.headingStyle, {
                          justifyContent: 'center', margin: 5, fontWeight: '600',
                          color: 'white', shadowColor: "#000FFF",
                          shadowOffset: {
                            width: 0,
                            height: 6,
                          },
                          shadowOpacity: 0.58,
                          shadowRadius: 10.00,
        
                          elevation: 12,
                        }]}>
                        Post Event
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </KeyboardAwareScrollView>
              {/* <Image source={{uri : imageData.assets[0].uri}}
          style = {{width:70, height:70, alignSelf:'center'}}
          /> */}
          {/* location Modal For picking location */}
          <Modal visible={locationModal}
          >
             <View style={{flex:1, height: '100%', width: '100%', backgroundColor: 'white', justifyContent:'center', alignItems:'center' }}>
             <View style={{width:300, height:50, justifyContent:'center', alignItems:'center'}}>
              <TouchableOpacity onPress={()=>setLocationModal(false)}
              style={[styles.UploadButton,{width:200}]}>
                <Text style={{color:'white', fontWeight:'600', fontSize:22}}>Confirm Location</Text>
              </TouchableOpacity>
            </View>
           <View style={{ height: '95%', width: '100%', backgroundColor: 'white', justifyContent:'center', alignItems:'center' }}>
           <MapView
            provider={PROVIDER_GOOGLE}
            zoomControlEnabled={true}
            showsMyLocationButton={true}
                style={{ width: '100%', height: '100%' }}
                initialRegion={{
                    latitude: 51.50746, // 33.51995346211034, 73.08200449215008// 51.50746, -0.1277,
                    longitude: -0.1277,
                    latitudeDelta: 0.1,//0.0922,
                    longitudeDelta: 0.1,//0.0421,
                }}
                onRegionChange={x => {
                    // console.log(x);
                }}
                onPress={e=>setMarkerPosition(e.nativeEvent.coordinate)}>
               {markerPostion !== undefined ? <Marker coordinate={markerPostion}/>:null}
            </MapView>
           </View>
            
           
            
        </View>
          </Modal>
            </View>
          </View> : <MyEvents />
      }
             <Modal
                animationType='slide'
                transparent={true}
                visible={interestModal}
                onRequestClose={() => { setInterestModal(false); }}
              >

                <View
                  style={{
                    height: '80%', width: '90%', padding: 10, borderRadius: 15,
                    elevation: 100,
                    shadowColor: 'indigo',
                    shadowOffset: {
                      width: 3,
                      height: 3
                    },
                    shadowRadius: 5,
                    shadowOpacity: 1.0,
                    backgroundColor: 'white', alignSelf: 'center',
                    marginTop: 100, marginBottom: 50, flexWrap: 'wrap'
                  }}
                >
                  <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    <View style={{ margin: 5 }}>


                      {interests.map((item, index) => {
                        return (
                          <View key={index}
                            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>

                            <TouchableOpacity
                              style={{
                                borderRadius: 40, width: 300,
                                height: 50, backgroundColor: '#E2DFD2',
                                marginVertical: 5, justifyContent: 'flex-start', marginLeft: 2, flexDirection: 'row'
                              }}
                              onPress={() => selectInterest(item)}
                            >
                              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                {
                                  selectedView === index ?
                                    <View
                                      style={{
                                        backgroundColor: 'red', marginTop: 6, marginLeft: 15,
                                        borderWidth: 1, height: 25, width: 25, borderRadius: 15, borderColor: 'blue'
                                      }}>

                                    </View> :
                                    <View style={{
                                      borderWidth: 1, height: 25, width: 25, marginLeft: 15,
                                      borderRadius: 15, borderColor: 'blue', marginTop: 6
                                    }}>

                                    </View>

                                }

                              </View>
                              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 18, color: 'blue', marginLeft: 10 }}>{item.interestName}</Text>
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
    // </KeyboardAwareScrollView>
  )
}
const { height, width } = Dimensions.get('screen');

const styles = StyleSheet.create({
  upperContainer: {
    width: '100%',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'black',
    borderBottomColor: '#8e8e8e',
    backgroundColor: 'white'
  },
  headingStyle: {
    marginLeft: 20,
    fontSize: 20,
    color: 'black',
    fontWeight: '700'
  },
  uploadImageBox: {
    width: '100%',
    height: 400,
    borderWidth: 1,
    alignSelf: 'center',
    marginVertical: 20,
    borderColor: 'black',
    borderRadius: 5,
    // flexDirection: 'row'
  },
  button: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,

  },
  uploadImageModal: {
    height: '96%',
    width: '98%',
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    // justifyContent: 'center',
    // alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    borderWidth: 5,
    borderColor: 'grey'
  },
  createEventView: {
  },
  createEventTextInput: {
    width: width - 30,
    borderRadius: 15,
    borderWidth: 2,
    marginVertical: 10,
    padding: 10,
    borderColor: 'white',
    color: 'white',
  }, UploadButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 50,
    width: 150,
    height: 40,
    justifyContent: 'center'
  },
  inputBox: {
    width: width - 30,
    borderRadius: 15,
    borderWidth: 2,
    marginVertical: 10,
    padding: 10,
    borderColor: 'white',
    color: 'white'
  }
});
export default PostEvent