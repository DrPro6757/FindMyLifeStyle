import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image, Alert, Modal, TextInput, FlatList, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { useRoute, useNavigation, StackActions } from '@react-navigation/native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import NotificationList from './NotificationList';

import Loader from './Loader';
import Test from './Test';
import AboutSection from './AboutSection';
import MyFollower from './MyFollower'; 
import MyFollowing from './MyFollowing';
import Slider from '@react-native-community/slider';
import FriendsScreen from './FriendsScreen';
import {SliderBox} from 'react-native-image-slider-box';
import {useDispatch, useSelector} from "react-redux";
import { getMyUserDataAction } from '../Redux/actionsUser';

// const {scrollWidth} = Dimensions.get('window').width;
// const scrollHeight =  scrollWidth * 100  / 60;
const ProfileScreen = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [myData, setMyData] = useState('');
  const [imageData, setImageData] = useState('');
  const [imagePicked, setImagePicked] = useState(false);
  const [imgDownloadUrl, setImgDownloadUrl] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);
  const [uploadPhotoModal, setUploadPhotoModal] = useState(false);
  const [imageState, setImagestate] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [myPhotos, setMyPhotos] = useState([])
  const [myFollowersList, setMyFollowersList] = useState([]);
  const [myFollowingList, setMyFollowingList] = useState([]);

  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [showAboutSection, setShowAboutSection] = useState(false);
  const [aboutText, setAboutText] = useState('');
  const [showNameSection, setShowNameSection] = useState(false);
  const [nameText, setNameText] = useState('');

  const [showWorkSection, setShowWorkSection] = useState(false);
  const [workText, setWorkText] = useState('');

  const [imageFullModal, setImageFullModal] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0)


  const [progressValue, setProgressValue] = useState(50);
  const [TCModal, setTCModal] = useState(false);
  const [AboutModal, setAboutModal] = useState(false);
  const [supportModal, setSupportModal] = useState(false);
  const [eventNotificationCount, setEventNotificationCount] = useState(0);

  const [notificationsCount, setNotificationsCount] = useState(0);


  let index2;
  let index1;
  let myprofileImage = ''
  let getResult;
  let sliderValue = 50;
  // let myPhotos=[];
  const dispatch = useDispatch();

  useEffect(() => {
    
    // getDatabase();
    dispatch(getMyUserDataAction());

    myFollowerListData();
    myFollowingListData();
    photosListData();
    NotificationsCounterFuntction();
    // myprofileImage =  AsyncStorage.getItem('profileImage').toString();
    // console.log('My profile image ' + myprofileImage);
  }, [imageUploaded, showAboutSection, clickedIndex])

  const {mydata} = useSelector(state => state.myUserData);


  const photosListData = async () => {
    await firestore()
      .collection('users')
      .doc(auth().currentUser?.uid)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);

        if (documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());
          console.log('User data: ', documentSnapshot.data().age);
          console.log('User data for photos on my profile screen: ', documentSnapshot.data().photos);
          setMyPhotos(documentSnapshot.data().photos)
          if (documentSnapshot.data().photos.length >= 2) {
            sliderValue += 20;
            setProgressValue(sliderValue)
          }
          console.log('User data for photos on my profile screen in state: ', myPhotos);

        }
      });
  }
  const NotificationsCounterFuntction=async()=>{
    let tempNotificationCount;
    await firestore()
      .collection('notifications')
      .doc(auth().currentUser?.uid)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);
  
        if (documentSnapshot.exists) {
          console.log('User data for events: ', documentSnapshot.data());
          console.log('User data for event notification counter :: ', documentSnapshot.data().notificationCounter);
          tempNotificationCount = documentSnapshot.data().notificationCounter;
          setNotificationsCount(tempNotificationCount)
          // setMyPhotos(documentSnapshot.data().photos)
  
        }
  
      });
  }
  const getDatabase = async () => {
    try {
      // console.log('data from main screen '+route.params.myData.id);
      const data = await firestore().collection('users')
        .doc(auth().currentUser?.uid).get();
      setMyData(data._data);
      if (data._data.work !== '') {
        sliderValue += 10;
        setProgressValue(sliderValue)
      }
      if (data._data.about !== '') {
        sliderValue += 10;
        setProgressValue(sliderValue)
      }
      // setMyPhotos(data._data.photos)
      // console.log('profile Photos  =' + myData.photos.length);
      // console.log('Image link : '+myData._data.profileImage);
      // console.log('Image Data :"'+imageData);
    } catch (error) {
      console.log(error);
    }
    setImagePicked(false);
  }
  const myFollowingListData = async () => {
    let tempMyFollowerList = [];
    let myFollowing = [];
    await firestore().collection('users').doc(auth().currentUser?.uid).get()
      .then(
        querySnapshot => {
          myFollowing = querySnapshot.data().following;
          console.log("my followers data == " + myFollowing);
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
            myFollowing.map(item1 => {
              if (item._data.id == item1) {
                tempUsers.push(item);
                console.log("My following name list :" + item._data.name);
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

          setMyFollowingList(tempUsers);

        }
      );

  }
  const myFollowerListData = async () => {
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
            myFollowers.map(item1 => {
              if (item._data.id == item1) {
                tempUsers.push(item);
                console.log("My followers name list :" + item._data.name);
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

          setMyFollowersList(tempUsers);

        }
      );

  }

  const openCamera = async () => {
    let result;
    try {
      result = await launchCamera({ mediaType: 'photo' });

      getResult = result;
      console.log('Image has been selected :: ' + getResult.assets[0].uri)



      setImageData(getResult);
    } catch (error) {
      console.log(error.message);
    }
    // console.warn('Image :'+ imageData!==null?imageData.assets[0].uri:null);

  }
  const openGallery = async () => {
    let result;
    try {
      result = await launchImageLibrary({ mediaType: 'photo' });

      getResult = result;
      console.log('Image has been selected :: ' + getResult.assets[0].uri)



      setImageData(getResult);
      setImagePicked(true);
      setImageUploaded(false);
    } catch (error) {
      console.log(error.message);
    }


  }
  const openPhotoUploadModal = () => {
    setUploadPhotoModal(true);
    setPhotoModalOpen(true);
    setImagestate(false);
    setImageData('');
  }
  const UploadImage = async () => {
    // if(imagePicked === true){
    try {
      if (imageData !== '') {


        setLoading(true);

        const userId = await AsyncStorage.getItem("USERID");

        const response = storage().ref(`/profile/${imageData.assets[0].fileName}`);

        const put = await response.putFile(imageData.assets[0].uri);
        console.log(response);
        console.log("upload image button pressed");
        myprofileImage = await AsyncStorage.setItem('profileImage', imageData.assets[0].uri);

        // setFullImaeRefPath(put.metadata.fullPath);
        const url = await response.getDownloadURL();
        console.log(url);
        setImgDownloadUrl(url);
        firestore().collection('users').doc(userId).update({
          profileImage: url,
        })
          .then(() => {
            console.log('Profile Photo added');
            setLoading(false);
            setImageUploaded(true);
          })



        Alert.alert("Image Uploaded");

        // firestore()
        //   .collection('users')
        //   .get()
        //   .then(querySnapshot => {
        //     console.log('Total posts: ', querySnapshot.size);

        //     querySnapshot.forEach(documentSnapshot => {
        //       console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
        //     });
        //   });
      } else {
        setUploadPhotoModal(false);
      }
    } catch (error) {
      console.log(error);
    }


    // }

  }
  const UploadImagePhotos = async () => {
    // if(imagePicked === true){
    try {
      if (imageData !== '') {


        setLoading(true);

        const userId = await AsyncStorage.getItem("USERID");

        const response = storage().ref(`/profile/${imageData.assets[0].fileName}`);

        const put = await response.putFile(imageData.assets[0].uri);
        console.log(response);
        console.log("upload image button pressed");
        myprofileImage = await AsyncStorage.setItem('profileImage', imageData.assets[0].uri);

        // setFullImaeRefPath(put.metadata.fullPath);
        const url = await response.getDownloadURL();
        console.log(url);
        setImgDownloadUrl(url);
        firestore().collection('users').doc(userId).update({
          photos: firestore.FieldValue.arrayUnion(url),
        })
          .then(() => {
            console.log('Profile Photo added');
            setLoading(false);
            setImageUploaded(true);
          })



        Alert.alert("Image Uploaded");

        // firestore()
        //   .collection('users')
        //   .get()
        //   .then(querySnapshot => {
        //     console.log('Total posts: ', querySnapshot.size);

        //     querySnapshot.forEach(documentSnapshot => {
        //       console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
        //     });
        //   });
      } else {
        setUploadPhotoModal(false);
      }
    } catch (error) {
      console.log(error);
    }


    // }

  }
  const uploadPhotoShowModal = () => {
    setPhotoModalOpen(false);
    setImagestate(false);
    setUploadPhotoModal(true);
    setImageData('');
  }
  const uploadPhotoModalHideCancel = () => {
    setUploadPhotoModal(!uploadPhotoModal);
    setImagestate(true);
    setImageData('');
    // if(imageData === imageData.assets[0].fileName){
    //   imageData=='';
    // }

  }
  const uploadPhotoModalHideConfirm = () => {

    if (imageData !== null) {
      if (photoModalOpen == false) {
        UploadImage();
      } else {
        UploadImagePhotos();
      }

      setUploadPhotoModal(!uploadPhotoModal);
    } else {
      setUploadPhotoModal(!uploadPhotoModal);
    }

    // if(imageData === ''){
    //   imageData===imageData.assets[0].fileName;
    // }
    // if(imageData!== ''){
    //   setImagestate(false);
    //   setImageData(imageData.assets[0].fileName);
    // }
  }
  const showAboutSectionFtn = async () => {

    await firestore().collection('users').doc(auth().currentUser?.uid).update({
      about: aboutText,
    })
      .then(() => {
        console.log('Profile Photo added');
        setLoading(false);
        setImageUploaded(true);
      })
    setShowAboutSection(false);
  }
  const showNameSectionFtn = async () => {
    if (nameText !== '') {
      await firestore().collection('users').doc(auth().currentUser?.uid).update({
        name: nameText,
      })
        .then(() => {
          console.log('Profile Photo added');
          setLoading(false);
          setImageUploaded(true);
        })
      setShowNameSection(false);
    }
    else {
      Alert.alert('You mus have a name');
    }
  }
  const showWorkSectionFtn = async () => {

    await firestore().collection('users').doc(auth().currentUser?.uid).update({
      work: workText,
    })
      .then(() => {
        console.log('Profile Photo added');
        setLoading(false);
        setImageUploaded(true);
      })
    setShowWorkSection(false);

  }
  const showNotificaiton = async () => {
    // NotificationList();

    await firestore()
      .collection('notifications')
      .doc(auth().currentUser?.uid)
      .update({
        notificationCounter: 0,
      }).then(res => {
        setEventNotificationCount(0);
      }

      ).catch(error => {
        console.log(error);
      })
    navigation.navigate('NotificationList');
  }
  const openCloseTCModal = () => {
    setTCModal(!TCModal);
  }
  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView>
        {/* about modal */}
        <GestureRecognizer
          style={{ flex: 1 }}
          // onSwipeUp={() => setShowAboutSection(false)}
          onSwipeDown={() => setShowAboutSection(false)}
        >
          <Modal visible={showAboutSection} transparent
            onRequestClose={() => { setShowAboutSection(false); }}
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
                <TextInput placeholder='Write About Yourself'
                  editable
                  placeholderTextColor='black'
                  style={{ color: 'black' }}
                  numberOfLines={5}
                  maxLength={250}
                  value={aboutText}
                  onChangeText={(text) => setAboutText(text)}
                />
                <TouchableOpacity onPress={() => showAboutSectionFtn()} style={{ alignSelf: 'center', marginTop: 20 }}>
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
        </GestureRecognizer>
        {/* about modal */}
        {/* Name modal */}
        <GestureRecognizer
          style={{ flex: 1 }}
          // onSwipeUp={() => setShowAboutSection(false)}
          onSwipeDown={() => setShowNameSection(false)}
        >
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
                <TextInput
                placeholder='Please Write Your Name'
                // defaultValue={myData.name.toString()}
                autoCapitalize='words'
                  editable
                  placeholderTextColor='black'
                  style={{ color: 'black' }}
                  numberOfLines={1}
                  maxLength={30}
                  underlineColorAndroid='blue'
                  value={nameText}
                  onChangeText={(text) => setNameText(text)}
                />
                <TouchableOpacity onPress={() => showNameSectionFtn()} style={{ alignSelf: 'center', marginTop: 20 }}>
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
        </GestureRecognizer>
        {/* Name modal */}
        {/* work modal */}
        <GestureRecognizer
          style={{ flex: 1 }}
          // onSwipeUp={() => setShowAboutSection(false)}
          onSwipeDown={() => setShowWorkSection(false)}
        >
          <Modal visible={showWorkSection} transparent
            onRequestClose={() => { setShowWorkSection(false); }}

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
                <TextInput placeholder='Please add detail about your work'
                underlineColorAndroid='blue'
                  editable
                  placeholderTextColor='black'
                  style={{ color: 'black' }}
                  numberOfLines={1}
                  maxLength={50}
                  value={workText}
                  onChangeText={(text) => setWorkText(text)}
                />
                <TouchableOpacity onPress={() => showWorkSectionFtn()} style={{ alignSelf: 'center', marginTop: 20 }}>
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
        </GestureRecognizer>
        {/* work modal */}
        <View>
          {/* <AboutSection showAbout={false} /> */}
          <Loader visible={Loading} />

          {/* Top Container fawithout photos */}
          <View>
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
                <View style={{ height: '75%', width: '95%', justifyContent: 'center', alignSelf: 'center', marginTop: 50 }}>
                  <View style={[styles.uploadImageModal]}>
                    <Text style={{ fontWeight: '700', fontSize: 20, marginRight: 150 }}>Add Photo</Text>

                    <View style={styles.uploadImageBox}>
                      <View style={{ width: '80%', height: 200, borderRadius: 10, borderWidth: 1, borderColor: 'black', alignSelf: 'center', marginLeft: 20, marginTop: 10 }}>
                        {
                          imageData && imageState === false ?
                            // <Text style={{color:'white', fontSize:15}}>Image Data:{imageData}</Text>
                            <Image source={{ uri: imageData.assets[0].uri }}
                              style={{ width: 140, height: 140, margin: 10 }} />
                            :
                            <Text style={{ color: '#707070', width: '100%', height: 200 }}>             Photo will appear hear</Text>
                          // <Image source={require('../Images/add-image.png')}
                          //   style={{ width: 140, height: 140, margin: 10 }}
                          // />
                        }
                      </View>
                      <TouchableOpacity style={[styles.button, { marginTop: 10, borderTopWidth: 2, borderColor: 'black' }]} onPress={() => openCamera()}>
                        <Image source={require('../Images/camera.png')}
                          style={{ width: 24, height: 24, marginLeft: 20, borderRadius: 5, tintColor: 'blue' }}
                        />
                        <Text style={{ marginLeft: 20, fontWeight: '700', color: 'black' }}>Open Camera</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.button} onPress={() => openGallery()}>
                        <Image source={require('../Images/gallery.png')}
                          style={{ width: 24, height: 24, marginLeft: 20, borderRadius: 5, tintColor: 'green' }}
                        />
                        <Text style={{ marginLeft: 20, fontWeight: '700', color: 'black' }}>Open Gallery</Text>
                      </TouchableOpacity>
                      <View style={{ flexDirection: 'row', backgroundColor: 'white', width: '100%' }}>
                        <TouchableOpacity
                          style={[styles.UploadButton, {
                            marginTop: 13, marginRight: 40, height: 40,
                            borderRadius: 10, marginLeft: 10, width: 100, alignItems: 'center', shadowColor: "#000FFF",
                            shadowOffset: {
                              width: 0,
                              height: 6,
                            },
                            shadowOpacity: 0.58,
                            shadowRadius: 10.00,

                            elevation: 12,
                          }]}
                          onPress={() => uploadPhotoModalHideCancel()}
                        >
                          <Text
                            style={[styles.headingStyle, { justifyContent: 'center', margin: 5, fontWeight: '500', color: 'white' }]}>
                            Cancel
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.UploadButton, {
                            marginTop: 13, width: 100, borderRadius: 10,
                            alignItems: 'center', shadowColor: "#000FFF", height: 40,
                            shadowOffset: {
                              width: 0,
                              height: 6,
                            },
                            shadowOpacity: 0.58,
                            shadowRadius: 10.00,

                            elevation: 12,
                          }]}
                          onPress={() => uploadPhotoModalHideConfirm()}
                        >
                          <Text style={[styles.headingStyle, { justifyContent: 'center', margin: 5, fontWeight: '500', color: 'white' }]}>
                            Upload
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                  </View>
                </View>
              </Modal>
            </GestureRecognizer>
            <View style={styles.TopContainer}>
              <View>
                <View style={{ height: 40, width: 40, marginTop: 40, flexDirection: 'row', marginBottom:20 }}>
                  <View style={{ width: 300, height: 30, alignItems: 'center', marginRight: 5 }}>
                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
                      Profile Completion : {progressValue}%
                    </Text>
                    <Slider
                      style={{ width: 250, height: 30,// borderWidth:4,borderColor:'white'
                     }}
                      minimumValue={0}
                      maximumValue={100}
                      value={progressValue}
                      minimumTrackTintColor='white' //"#FFFFFF"
                      maximumTrackTintColor='white'//"#000000"
                      disabled={true}
                      thumbTintColor='orange'
                    
                    // onValueChange={(value) => setMinAge(value)}
                    />

                  </View>
                  <View>
                    <TouchableOpacity onPress={() => setShowSettingModal(true)} style={{flexDirection:'row'}}>
                      <Image source={require('../Images/settings.png')}
                        style={{ width: 30, height: 30, marginRight: 10, marginTop: 20, tintColor: 'white' }}
                      />
                      {
                        notificationsCount > 0 ?
                        <View
                      style={{height:20, width:20, borderRadius:10, justifyContent:'center', alignItems:'center',
                      backgroundColor:'red', marginTop:10, marginRight:20, marginLeft:-25}}

                      >
                      <Text style={{color : 'white', fontSize:14, fontWeight:'bold'}}>
                        {notificationsCount}
                        </Text>
                      </View>
                    :
                    null  
                    }
                      

                    </TouchableOpacity>
                  </View>

                </View>


                {/* {
                        imageData !== null && myData.profileImage !== null && imagePicked === false?
                        <Image source={{uri: myData.profileImage}}
                        style = {styles.user_Image}
                        /> 
                        :imageData !== null && myData.profileImage !== null && imagePicked === true?
                        
                        <Image source={{uri: imageData.assets[0].uri}}
                        style = {styles.user_Image}
                        /> 
                        : myData.profileImage !== null ?
                        <Image source={{uri: myData.profileImage}}
                        style = {styles.user_Image}
                        /> 
                        :
                        <Image source={require('../Images/user.png')}
                        style = {styles.user_Image}
                        />
                      } */}
                {
               mydata && mydata.map(item=>{
                return(
                  <View>
                    {
                    item.profileImage === '' ?

            <TouchableOpacity
             onPress={() => uploadPhotoShowModal()}
// onPress={() => openGallery()}
            >
           <Image source={require('../Images/user.png')}
              style={styles.user_Image}
            />
            </TouchableOpacity>
             :
// <Image source={{ uri: myData.profileImage }}
            <Image source={{ uri: item.profileImage }}

               style={styles.user_Image}
               />
           }
             <View style={{ width: '100%', marginVertical: 15, flexDirection: 'row', justifyContent: 'center' }}>

             <Text style={[styles.userBio, styles.userName]}> {item.name ? item.name : ''}, {item.age ? item.age : null}</Text>
             <TouchableOpacity onPress={() => setShowNameSection(true)}
             >
              <Image source={require('../Images/edit.png')}
               style={{ height: 20, width: 20, marginLeft: 5, tintColor: 'white' }}
               />
           </TouchableOpacity>
                </View>

                       <View>
                
                {/* <Text style={styles.userName}>{myData ? myData.name : null}, {myData ? myData.age : null}</Text> */}
                <View style={{ width: '95%', marginVertical: 10, flexDirection: 'row', justifyContent: 'center' }}>

                  <Text style={styles.userBio}> {item.about ? 
                        item.about.substring().length <= 30
                          ? `${ item.about}`
                          // ?item._data.name
                          : `${ item.about.substring(0, 30)}...`
                           : 'Write Something About Yourself'}</Text>
                  <TouchableOpacity onPress={() => setShowAboutSection(true)}
                  >
                    <Image source={require('../Images/edit.png')}
                      style={{ height: 20, width: 20, marginLeft: 5, tintColor: 'white' }}
                    />
                  </TouchableOpacity>
                </View>
              </View>



              <View style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: 10 }}>
                <View style={{ marginRight: 80 }} >
                  <Text style={styles.EventPhotosNo}>
                    {item.eventsPosted <= 9 ? '0' + item.eventsPosted : item.eventsPosted}
                  </Text>
                  <Text style={styles.EventPhotosNo}>Events</Text>
                </View>
                <View>
                  <Text style={styles.EventPhotosNo}>
                    0
                    {/* {myData.photos.length.toString()} */}
                    {/* {myData.photos <= 9 ? '00' + myData.photos.length.toString() : myData.photos.length.toString()} */}
                  </Text>
                  <Text style={styles.EventPhotosNo}>Photos</Text>
                </View>
              </View>




              <View style={{
                justifyContent: 'center', alignItems: 'center', marginVertical: 15

              }}>
                <TouchableOpacity //onPress={()=>props.FollowTest}
                 onPress={() => uploadPhotoShowModal()}
                  style={{ borderRadius: 10, backgroundColor: 'purple', marginBottom: 20, height: 40, width: 200, borderWidth: 1, borderColor: 'purple' }}
                >
                  <Text style={[styles.userName, { fontSize: 18 }]}>Change Profile Photo</Text>
                </TouchableOpacity>
              </View>


            
                  </View>
                  )})   

                }
              </View>
            </View>
          </View>
          {/* Bottong setcion Container with photos */}
          <View style={{
            width: '100%', height: '100%',
            borderWidth: 3, borderColor: 'white'
          }}>
            {/* editable section */}
              <View style={{ width: '100%' }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: 'black', marginTop: 20 }}>Interests</Text>
                    <Text style={{ fontSize: 22, fontWeight: '600', color: 'black', marginBottom: 20 }}>
                      {mydata.interest ? mydata.interest : 'Not Available'}</Text>
                  </View>
                  <View style={{ width: '100%' }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: 'black', marginTop: 20 }}>Work</Text>
                    <View style={{ width: '95%', marginVertical: 10, flexDirection: 'row', justifyContent: 'center' }}>


                      <Text style={{ fontSize: 22, fontWeight: '600', color: 'black', marginBottom: 20 }}>
                        {mydata.work ? mydata.work : 'Not Available'}</Text>
                      <TouchableOpacity onPress={() => setShowWorkSection(true)}
                      >
                        <Image source={require('../Images/edit.png')}
                          style={{ height: 20, width: 20, marginLeft: 5, tintColor: 'black' }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ width: '100%' }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: 'black', marginTop: 20 }}>Bio</Text>
                    <Text style={{ fontSize: 22, fontWeight: '600', color: 'black', marginBottom: 20 }}>
                      {mydata.about ? mydata.about : 'Not Available'}</Text>
                  </View>
                  {/* editable section */}
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ margin: 22, fontSize: 20, fontWeight: '700', color: 'black' }}>Photos</Text>
              <TouchableOpacity onPress={() => openPhotoUploadModal()}>
                <View style={[{ height: 40, width: 40, marginLeft: 170, marginTop: 20, borderWidth: 2, borderColor: 'red' }]}>

                  <Image source={require('../Images/add-image.png')}
                    style={{ width: 30, height: 30, borderRadius: 10, tintColor: 'red', alignSelf: 'center' }}
                  />

                </View>
              </TouchableOpacity>
            </View>

            <View >
{/* <View style={{height:400, width:}}>
  <SliderBox myPhotos={myPhotos}/>
</View> */}
              <View
                style={{ height: '100%', width: '100%', backgroundColor: 'white', marginBottom: 70 }}>

                {/* <ScrollView
                //         horizontal = {true}
                //     pagingEnabled
                // style={{ width: '100%', height: '40%' }}
                > */}
                  {
                    myPhotos.length ?

                      myPhotos.map((photos, index) => {
                          return (
                            <View key={index}>
                              <TouchableOpacity onPress={() => { setImageFullModal(true); setClickedIndex(index) }}>
                                {/* <Text style={{fontSize:20, color:'black'}}>scrollh </Text> */}
                                {/* <Text style={{color:'black', fontSize:18}}>{clickedIndex}</Text> */}

                                <Image //source={require('../Images/back.png')}
                                source={{ uri: photos }}
                                  style={{ height: 300, width: '95%', margin: 5, borderWidth: 1, borderColor: 'black',
                                  borderRadius: 10 }}
                                />
                              </TouchableOpacity>
                              {/* <Image source={{ uri: photos }}
                                style={{ height: 300,
                                   width: Dimensions.get('window').width , resizeMode:'contain' }}
                              /> */}
                            </View>

                          );
                        })
                        .reverse()

                      :
                      <Text
                        style={{ fontSize: 20, alignSelf: 'center', fontWeight: '500', color: 'black', marginBottom: 30 }}>No Photos to show </Text>
                  }
                 
                 
                  
                {/* </ScrollView> */}
                <View style={{ justifyContent: 'space-evenly', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => setSelectedTab(0)}>
                      <Text style={{ fontSize: 25, fontWeight: '600', color: 'black' }}>Followers</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setSelectedTab(1)}>
                      <Text style={{ fontSize: 25, fontWeight: '600', color: 'black' }}>Following</Text>
                    </TouchableOpacity>

                  </View>
                  {/* Followers List To Show On Profile Screen */}
                {
                    selectedTab == 0 ?
                      <MyFollower friendFtn = {props.FollowTest}/>
                      
                      :
                      // Following List To Show On Profile Screen
                      <MyFollowing />
                    
                  }
                <Modal
                  visible={imageFullModal}
                  onRequestClose={() => setImageFullModal(false)}
                >
                  <View style={{ backgroundColor: 'black', height: '100%', width: '100%' }}>
                    <ScrollView
                      horizontal={true}
                      pagingEnabled
                      decelerationRate={1}
                    // style={{ width: '100%', height: '40%' }}
                    >
                      {
                        myPhotos.map((photoPath, Index) => {
                          Index = clickedIndex;
                          return (
                            <View key={Index}>
                                {/* <Text style={{ color: 'white', fontSize: 18, margin: 10 }}>
                                  {Index}</Text> */}
                                  {/* <Text style={{ color: 'white', fontSize: 18, margin: 10 }}>
                                  {photoPath}</Text> */}
                              <Image source={{ uri: photoPath}}
                                style={{
                                  height: Dimensions.get('window').height,
                                  width: Dimensions.get('window').width, resizeMode: 'contain'}}
                              />                      
                              </View>
                          )
                        })
                      }
                    </ScrollView>
                  </View>
                </Modal>
                {
                  //   <View
                  //   style={{ height: '100%', width: '100%', backgroundColor: 'white', marginBottom: 70 }}>
                  //   <MyFollower/>
                  // </View>
                }

                {/* <Test /> */}


              </View>


            </View>

          </View>

          {/* */}
        </View>

      </ScrollView>
      <Modal
        visible={showSettingModal}
        animationType='slide'
        transparent={false}
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        <View style={{
          height: '50%', width: '100%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'
        }}>
          <View style={{
            height: '70%', width: '85%', backgroundColor: 'white', marginBottom: 110
          }}>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <TouchableOpacity onPress={() => setShowSettingModal(false)}>
                  <Image source={require('../Images/back.png')}
                    style={{
                      width: 20, height: 20, padding: 20,
                      tintColor: 'black', marginTop: 50, alignSelf: 'flex-start'
                    }}
                  />
                </TouchableOpacity>
              </View>

              {/* headingSettings */}
              <View style={styles.headingSettings}>

                <Text
                  style={{ fontSize: 25, fontWeight: '700', margin: 50, color: 'black', marginTop: 30, marginRight: 130 }}>
                  Settings
                </Text>
              </View>
            </View>
            <View style={{ borderWidth: 0.6, width: '100%', borderColor: 'black', marginTop: -10 }}>

            </View>
            {/* First button 1 */}
            <View style={styles.buttonViewSettings}>
              <TouchableOpacity onPress={() => [showNotificaiton(), setShowSettingModal(false), setNotificationsCount(0)]}>
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../Images/notification.png')}
                    style={{ width: 25, height: 25, margin: 10, tintColor: 'black', marginLeft: 10, marginTop: 30 }}
                  />
                  {
                        notificationsCount > 0 ?
                        <View
                      style={{height:20, width:20, borderRadius:10, justifyContent:'center', alignItems:'center',
                      backgroundColor:'red', marginTop:10, marginRight:20, marginLeft:-25}}

                      >
                      <Text style={{color : 'white', fontSize:14, fontWeight:'bold'}}>
                        {notificationsCount}
                        </Text>
                      </View>
                    :
                    null  
                    }
                  <Text
                    style={{ fontSize: 18, fontWeight: '500', margin: 10, color: 'black', marginLeft: 10, marginTop: 30 }}>
                    Notificaitons
                  </Text>
                  <Image source={require('../Images/right-arrow.png')}
                    style={{
                      width: 20, height: 20, margin: 10,
                      tintColor: 'black', marginLeft: 70, marginTop: 30, alignSelf: 'flex-end'
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/* Second Button 2*/}
            <View style={styles.buttonViewSettings}>
              <TouchableOpacity onPress={() => openCloseTCModal()}>
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../Images/privacy-policy.png')}
                    style={{ width: 25, height: 25, margin: 10, tintColor: 'black', marginLeft: 10, marginTop: 30 }}
                  />
                  <Text
                    style={{ fontSize: 18, fontWeight: '500', margin: 10, color: 'black', marginLeft: 10, marginTop: 30 }}>
                    Terms And Conditions
                  </Text>
                  <Image source={require('../Images/right-arrow.png')}
                    style={{
                      width: 20, height: 20, margin: 10,
                      tintColor: 'black', marginLeft: 10, marginTop: 30, alignSelf: 'flex-end'
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/* Third Button 3*/}
            {/* <View style={styles.buttonViewSettings}>
              <TouchableOpacity >
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../Images/account-setting.png')}
                    style={{ width: 25, height: 25, margin: 10, tintColor: 'black', marginLeft: 10, marginTop: 30 }}
                  />
                  <Text
                    style={{ fontSize: 18, fontWeight: '500', margin: 10, color: 'black', marginLeft: 10, marginTop: 30 }}>
                    Account
                  </Text>
                  <Image source={require('../Images/right-arrow.png')}
                    style={{
                      width: 20, height: 20, margin: 10,
                      tintColor: 'black', marginLeft: 98, marginTop: 30, alignSelf: 'flex-end'
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View> */}
            {/* Fourth Button 4*/}
            <View style={styles.buttonViewSettings}>
              <TouchableOpacity onPress={() => setAboutModal(true)} >
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../Images/info.png')}
                    style={{ width: 25, height: 25, margin: 10, tintColor: 'black', marginLeft: 10, marginTop: 30 }}
                  />
                  <Text
                    style={{ fontSize: 18, fontWeight: '500', margin: 10, color: 'black', marginLeft: 10, marginTop: 30 }}>
                    About
                  </Text>
                  <Image source={require('../Images/right-arrow.png')}
                    style={{
                      width: 20, height: 20, margin: 10,
                      tintColor: 'black', marginLeft: 114, marginTop: 30, alignSelf: 'flex-end'
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/* Fifth Button 5*/}
            <View style={styles.buttonViewSettings}>
              <TouchableOpacity onPress={() => setSupportModal(true)} >
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../Images/support.png')}
                    style={{ width: 25, height: 25, margin: 10, tintColor: 'black', marginLeft: 10, marginTop: 30 }}
                  />
                  <Text
                    style={{ fontSize: 18, fontWeight: '500', margin: 10, color: 'black', marginLeft: 10, marginTop: 30 }}>
                    Support
                  </Text>
                  <Image source={require('../Images/right-arrow.png')}
                    style={{
                      width: 20, height: 20, margin: 10,
                      tintColor: 'black', marginLeft: 99, marginTop: 30, alignSelf: 'flex-end'
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/* Sixth Button 6*/}
            <View style={styles.buttonViewSettings}>
              <TouchableOpacity onPress={
                async () => {
                  await auth().signOut();
                  navigation.dispatch(StackActions.replace('LoginScreen'));
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../Images/logout.png')}
                    style={{ width: 25, height: 25, margin: 10, tintColor: 'red', marginLeft: 10, marginTop: 30 }}
                  />
                  <Text
                    style={{ fontSize: 18, fontWeight: '500', margin: 10, color: 'red', marginLeft: 10, marginTop: 30 }}>
                    Logout
                  </Text>
                  <Image source={require('../Images/right-arrow.png')}
                    style={{
                      width: 20, height: 20, margin: 10,
                      tintColor: 'black', marginLeft: 104, marginTop: 30, alignSelf: 'flex-end'
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <Image source={require('../Images/logoFml.png')}
              style={{ height: 160 , width: 160, marginVertical: 10, alignSelf: 'center' }}
            />
          </View>
        </View>
      </Modal>
      <GestureRecognizer
        style={{ flex: 1 }}
        // onSwipeUp={() => setShowOtherUserInfoModal(true)}
        onSwipeDown={() => setTCModal(false)}
      >
        <Modal visible={TCModal}
          transparent={true}
          onRequestClose={() => { setTCModal(false); }}

        >
          <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{
              height: '80%', width: '90%', backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center',
              shadowColor: "#000FFF",
              shadowOffset: {
                width: 0,
                height: 12,
              },
              shadowOpacity: 0.58,
              shadowRadius: 16.00,

              elevation: 24,
            }}>
              <View style={{
                height: '75%', width: '85%', backgroundColor: 'white'
              }}>
                <ScrollView>
                  <View style={{ margin: 10 }}>
                    <Text style={{ color: 'black' }}>
                      Acceptance of Terms: By registering and using the "FML" social media app, you agree to comply with these terms and conditions.

                      Eligibility: Users must be at least 18 years old to use the app. By signing up, users confirm that they meet the age requirement and provide accurate and up-to-date information during registration.
                      Data Collection and GDPR: By signing up for "FML," users consent to the collection and processing of their personal data as per our Privacy Policy and in compliance with the General Data Protection Regulation (GDPR).
                      Data Usage and Third Parties: "FML" may collect user data to enhance the app's functionality and improve user experience. We may share data with third parties in a way that respects our Privacy Policy and complies with applicable data protection laws.
                      User Conduct: Users are expected to use the app responsibly and respect other users' rights and privacy. Any abusive, offensive, or harmful behavior towards other users will not be tolerated.
                      Event Participation: "FML" enables users to connect with each other based on shared interests and attend events. Users acknowledge that attending events is at their own risk, and "FML" assumes no liability for any incidents or personal belongings lost during events.
                      Account Security and Blocking: Users are responsible for maintaining the security of their accounts. "FML" reserves the right to block accounts that violate these terms or engage in fraudulent or abusive behavior, without prior notice.
                      User Content: Users are solely responsible for the content they post, share, or upload on the app. "FML" reserves the right to remove any content that violates these terms or community guidelines.
                      Intellectual Property: Users must respect intellectual property rights. Unauthorized use or distribution of copyrighted material is prohibited.
                      App Modifications and Rights: "FML" reserves the right to modify, update, or terminate the app and its features without prior notice. We retain full control over the app and its functionalities.
                      Liability: "FML" is not liable for any damages or losses incurred through app usage or participation in events organized through the app. Users are responsible for their interactions and experiences at events.
                      Disputes: Any disputes arising from app usage or these terms will be resolved through arbitration in accordance with UK laws.
                      Third-Party Links: "FML" may contain links to third-party websites or services. We are not responsible for the content or practices of these external sites.
                      Governing Law: These terms and conditions are governed by and construed in accordance with the laws of the United Kingdom.
                      By using "FML," you acknowledge that you have read, understood, and agreed to these terms and conditions, including the data collection and sharing practices outlined in our Privacy Policy. If you do not agree with these terms, please refrain from using the app.
                    </Text>

                  </View>
                </ScrollView>
                <TouchableOpacity onPress={() => openCloseTCModal()} style={{ alignSelf: 'center', marginTop: 20 }}>
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
                    <Text style={{ fontSize: 18, fontWeight: '600', color: 'black' }}>Okay</Text>
                  </View>
                </TouchableOpacity>
              </View>

            </View>
          </View>

        </Modal>
      </GestureRecognizer>
      <GestureRecognizer
        style={{ flex: 1 }}
        // onSwipeUp={() => setShowOtherUserInfoModal(true)}
        onSwipeDown={() => setAboutModal(false)}
      >
        <Modal visible={AboutModal}
          transparent={true}
          onRequestClose={() => { setAboutModal(false); }}

        >
          <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{
              height: '80%', width: '90%', backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center',
              shadowColor: "#000FFF",
              shadowOffset: {
                width: 0,
                height: 12,
              },
              shadowOpacity: 0.58,
              shadowRadius: 16.00,

              elevation: 24,
            }}>
              <View style={{
                height: '75%', width: '85%', backgroundColor: 'white'
              }}>
                <ScrollView>
                  <View style={{ margin: 10 }}>
                    <Text style={{ color: 'black' }}>
                      FML (Find My Lifestyle)
                      This app is provided by MJ Platform Limited to give you the remarkable for socializing with
                      friends and family. You can not only handle your social connections but also have ultimate 
                      fun by joining different communities and connect with people by joining the events around.
                      This app is will give you most charishing and mesmerizing experience of socilizing.
                    </Text>

                  </View>
                </ScrollView>
                <TouchableOpacity onPress={() => setAboutModal(false)} style={{ alignSelf: 'center', marginTop: 20 }}>
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
                    <Text style={{ fontSize: 18, fontWeight: '600', color: 'black' }}>Okay</Text>
                  </View>
                </TouchableOpacity>
              </View>

            </View>
          </View>

        </Modal>
      </GestureRecognizer>
      <GestureRecognizer
        style={{ flex: 1 }}
        // onSwipeUp={() => setShowOtherUserInfoModal(true)}
        onSwipeDown={() => setSupportModal(false)}
      >
        <Modal visible={supportModal}
          transparent={true}
          onRequestClose={() => { setSupportModal(false); }}

        >
          <View style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{
              height: '80%', width: '90%', backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center',
              shadowColor: "#000FFF",
              shadowOffset: {
                width: 0,
                height: 12,
              },
              shadowOpacity: 0.58,
              shadowRadius: 16.00,

              elevation: 24,
            }}>
              <View style={{
                height: '75%', width: '85%', backgroundColor: 'white'
              }}>
                <ScrollView>
                  <View style={{ margin: 10 }}>
                    <Text style={{ color: 'black' }}>
                      FML (Find My Lifestyle).

                      In case you want to leave your 
                      valueable feedback or facing any problem you can reach us out at
                      FindMyLifeStyle@Support.Com
                    </Text>

                  </View>
                </ScrollView>
                <TouchableOpacity onPress={() => setSupportModal(false)} style={{ alignSelf: 'center', marginTop: 20 }}>
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
                    <Text style={{ fontSize: 18, fontWeight: '600', color: 'black' }}>Okay</Text>
                  </View>
                </TouchableOpacity>
              </View>

            </View>
          </View>

        </Modal>
      </GestureRecognizer>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  headingSettings: {
    // borderBottomWidth: 1,
    // borderColor: 'black',
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    // flexDirection: 'row',
  },
  buttonViewSettings: {
    height: 70,
    width: '70%',
    borderBottomWidth: 0.3,
    borderColor: 'black',
    margin: 5,
    marginTop: 5,
    marginLeft: 30,
  },
  TopContainer: {
    height: 480,
    justifyContent: 'center',
    backgroundColor: '#202A44',
    borderWidth: 1.5,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  user_Image: {
    width: 125,
    height: 125,
    borderRadius: 62,
    borderWidth: 1,
    borderColor: '#ff8501',
    alignSelf: 'center',
    marginTop: 10
  },
  userName: {
    color: 'white',
    fontWeight: '700',
    fontSize: 30,
    alignSelf: 'center'
  },
  userBio: {
    color: 'white',
    fontWeight: '300',
    fontSize: 15,
    alignSelf: 'center'
  },
  headingStyle: {
    // marginLeft: 20,
    fontSize: 15,
    color: 'white',
    fontWeight: '700'
  },
  EventPhotosNo: {
    color: 'white',
    fontWeight: '400',
    fontSize: 20,
    alignSelf: 'center',
  },
  addPhotos: {
    backgroundColor: 'red',
    width: 200,
    alignItems: 'center',
    padding: 5,
    marginVertical: 10,
    borderRadius: 50,
    alignSelf: 'center',
  },
  photoContainer: {
    width: 110,
    height: 110,
    borderWidth: 2,
    borderColor: '#ff8501',
    borderRadius: 40,
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
  }, uploadImageBox: {
    width: '100%',
    height: 400,
    borderWidth: 1,
    alignSelf: 'center',
    marginVertical: 20,
    borderColor: 'black',
    borderRadius: 5,
    // flexDirection: 'row'
  }, button: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,

  }, UploadButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    padding: 5,
    marginVertical: 5,
    borderRadius: 50,
    width: 180,
    height: 60,
    margin: 5,
    justifyContent: 'center'
  },
  userContainer: {
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
  }
});

export default ProfileScreen