import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, Alert, TurboModuleRegistry, BackHandler, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import HomeScreen from '../screens/HomeScreen'
import ProfileScreen from '../screens/ProfileScreen'
import ImageUpload from '../screens/ImageUpload'
import ChatScreen from '../screens/ChatScreen'
import EventsScreen from '../screens/EventsScreen'
import PostEvent from '../screens/PostEvent'
import AddPhoto from '../screens/AddPhoto'
import Main from '../screens/Main'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Notifee from '../screens/Notifee'
import FriendsScreen from '../screens/FriendsScreen'
import AddFriend from '../screens/AddFriend'
import Maps from '../screens/Maps'
import SendNotifications from '../screens/SendNotifications'
import MyEvents from '../screens/MyEvents'
import SettingScreen from '../screens/SettingScreen'
import Test from '../screens/Test'
import { el } from 'date-fns/locale'
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import Loader from '../screens/Loader'
import NotificationList from '../screens/NotificationList';
import LoginScreen from '../screens/LoginScreen';
import InernetCheck from '../screens/InernetCheck';
import MyFollower from '../screens/MyFollower';
import Address from '../screens/Address';
import ExploreEvents from '../screens/ExploreEvents';
import Progress from '../screens/Progress';
import Fast from '../screens/Fast';
import MyEventList from '../screens/MyEventList';
import GestureRecognizer from 'react-native-swipe-gestures';
import { closestIndexTo } from 'date-fns';
import { useRoute, useNavigation, StackActions } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import StartScreen from '../screens/StartScreen';
import ContactTest from '../ReduxComponents/ContactTest';
import MapEventsScreen from '../screens/MapEventsScreen';
import { useSelector, useDispatch } from 'react-redux';


const TabNavigationCustom = (props) => {
  const navigation = useNavigation();
  const [userProfileImage, setuserProfileImage] = useState()
  const [selectedTab, setSelectedTab] = useState(6)
  const [imageData, setImageData] = useState('');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [uploadPhotoModal, setUploadPhotoModal] = useState(false);
  const [imageState, setImagestate] = useState(false);
  const [imgDownloadUrl, setImgDownloadUrl] = useState("");
  const [Loading, setLoading] = useState(false);
  const [imagePicked, setImagePicked] = useState(false);
  const [update, setUpdate] = useState(false);

  const [drawerModal, setDrawerModal] = useState(false);
  const [screenName, setScreenName] = useState('Home');

  const [userData, setUserData] = useState([]);

  const [allUserData, setAllUserData] = useState([]);
  const [allpostData, setAllPostData] = useState([]);

  const [deviceFcmToken, setFcmToken] = useState('');

  const [updateUserDataState, setUpdateUserDataState] = useState(false); 

  const [notificationsCount, setNotificationsCount] = useState(0);

  const [chatsReader,setChatsReader] = useState(false);

  let profileImage;
  let getResult;
  let photoSet = AsyncStorage.getItem("PHOTOSET");
  let checkPhotoSet = "PHOTOSET"
  const dispatch = useDispatch();
  useEffect(() => {
    //  getImage();
    //later
    if(Platform.OS=='ios'){
      async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
        if (enabled) {
          console.log('Authorization status:', authStatus);
        }
      }
    }
    getFcmToken();
    GetUserData();
    if(selectedTab ===  0){
      <FriendsScreen allUserData = {allUserData} />
              }
    // getEventData();
    // getAllUserData();
    NotificationsCounterFuntction();
    

  }, [!updateUserDataState])
  let myID = "";
  let myNameHere = "";
  let myProfileImageHere = "";
  const {mydata} = useSelector(state => state.myUserData);
    mydata && 
    mydata.map(item=>{
     myID = item.id;
     myNameHere = item.name;
     myProfileImageHere = item.profileImage;
    })
const NotificationsCounterFuntction=async()=>{
  let tempNotificationCount;
  await firestore()
    .collection('notifications')
    .doc(auth().currentUser?.uid)
    .get()
    .then(documentSnapshot => {
      // console.log('User exists: ', documentSnapshot.exists);

      if (documentSnapshot.exists) {
        // console.log('User data for events: ', documentSnapshot.data());
        // console.log('User data for event notification counter :: ', documentSnapshot.data().notificationCounter);
        tempNotificationCount = documentSnapshot.data().notificationCounter;
        setNotificationsCount(tempNotificationCount)
        // setMyPhotos(documentSnapshot.data().photos)

      }

    });
}
  const GetUserData = async () => {
    const data = await firestore().collection('users').doc(auth().currentUser?.uid).get();
    setUserData(data._data);
    setuserProfileImage(data._data.profileImage)
    if(props.tempMessages.length !== undefined)
    if(data._data.messageFrom.length>0 && props.tempMessages.length > 0){
      
      props.updateMessage  = true;
      setChatsReader( true);
    }else  if(data._data.messageFrom.length>0){
      props.updateMessage  = true;
      setChatsReader( true);
    }
    // console.log('user function in tab navigation '+props.updateMessage)

    const name = data._data.name;
    const email = data._data.email;
    const id = data._data.id;
    const profileImage = data._data.profileImage;
    const myLatitude = data._data.myLocation.latitude;
    const myLongitude = data._data.myLocation.longitude;
    // if (data._data.profileImage !== '') {
    //   uploadPhotoModalHideCancel();
      

      goToNext(name, email, id, profileImage, myLatitude, myLongitude);
    // }
    // else {  
    //   if(userProfileImage===''){
    //     setImagestate(false);
    //     setUploadPhotoModal(true)
    //   }else{
    //     uploadPhotoModalHideCancel();
    //   }
      
    // }

    // console.log('My Data ss    Stored'+userData);
    // console.log('My Data Stored here'+data.profileImage);
    // profileImage = data._data.profileImage;

    // setuserProfileImage(data._data.profileImage)

    // if (userProfileImage !== data._data.profileImage) {
    //   // console.log("My profile IMage is here:::"+userProfileImage);
    //   uploadPhotoShowModal();
    // } else {
    //   setUploadPhotoModal(false);
    // }
    // setUpdate(!update)
  }
  const goToNext = async (name, email, id, profileImage, myLatitude, myLongitude) => {
    name = await AsyncStorage.setItem('NAME', name);
    email = await AsyncStorage.setItem('EMAIL', email);
    id = await AsyncStorage.setItem('USERID', id);
    profileImage = await AsyncStorage.setItem('profileImage', profileImage);
    myLatitude = await AsyncStorage.setItem('MyLat', myLatitude);
    myLongitude = await AsyncStorage.setItem('MyLong', myLongitude);
    let checkUserName = await AsyncStorage.getItem('NAME');
    // setMyUserName(checkUserName);
    let checkProfileImage = await AsyncStorage.getItem('profileImage');
    // setMyProfileImage(checkProfileImage);
    console.warn("My User Id Stored And Set Asynchronysly:" + id);
    console.warn("My Profile Image Link Stored And Set Asynchronysly:" + myProfileImage);
    console.warn("My Name Stored And Set Asynchronysly:" + myUserName);

  };
  const getAllUserData = async () => {
    setLoading(true);
    let tempUsers = [];

    firestore()
      .collection('users')
      .where('id', '!=', 'userId')
      .get()
      .then(querySnapshot => {
        querySnapshot._docs.map(item => {
          if (item._data.id !== auth().currentUser?.uid) {
            tempUsers.push(item);
            console.log('temp users profile iMage :' + item._data.name);
            //  console.log('other people fcm token == '+item._data.fcmToken);
            // if (item._data.followers === auth().currentUser?.uid) {
            //   setStatusUpdate('xxx');
            // } else {
            //   setStatusUpdate('vvv');
            // }
          }
        });
        setLoading(false);
        setAllUserData(tempUsers);
        console.log('Tab Navigation Screen Data for Users ======== '+allUserData);
      });
      setUpdateUserDataState(true);
        
  };
  let getEventData = () => {
    setLoading(true);
    let tempData = [];

    firestore()
      .collection('events')
      .get()
      .then(querySnapshot => {
        // console.log('Total posts: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          tempData.push(documentSnapshot.data());

          // tempData.map((item1)=>{
          //    pdis = getPreciseDistance(
          //     { latitude: item1.eventLocation.latitude, longitude: item1.eventLocation.longitude},
          //     { latitude:  myData.myLocation.latitude, longitude: myData.myLocation.longitude }
          //   );
          //   console.log('Distance = '+pdis/1000+' Kms')
          //   // tempData.push(pdis)
          // })

          // console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
          // console.log('all user id ' + documentSnapshot.data().userId);
          // <MyEventList myprop={testSendData} />
          // userIDsPosts = documentSnapshot.data().userId;
          // TimePosted = moment(documentSnapshot.data().postTimeDate || moment.now()).fromNow();
          setLoading(false);
        });

        // let allData = concat(tempData, pdis)
        setAllPostData(tempData);
        // setEventData(tempData);
        <MapEventsScreen Filter='this is filter data' />

        // setDistanceData(pdis);
        // console.log("total posts imag : "+postData.img);
        console.log('post data in Tab Navigation Scree ;;;;;;;; '+allpostData)
      });

    // setFilterModal(false);
  }
  // const getImage = async () => {
  //   profileImage = await AsyncStorage.getItem('profileImage');
  //   setuserProfileImage(profileImage);
  // }

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
  const UploadImage = async () => {
    // if(imagePicked === true){
    try {
      setLoading(true);

      const userId = await AsyncStorage.getItem("USERID");

      const response = storage().ref(`/profile/${imageData.assets[0].fileName}`);

      const put = await response.putFile(imageData.assets[0].uri);
      console.log(response);
      console.log("upload image button pressed");
      const myprofileImage = await AsyncStorage.setItem('profileImage', imageData.assets[0].uri);

      // setFullImaeRefPath(put.metadata.fullPath);
      const url = await response.getDownloadURL();
      console.log(url);
      setImgDownloadUrl(url);
      setuserProfileImage(url);
      await AsyncStorage.setItem('profileImage', url);
      firestore().collection('users').doc(userId).update({
        profileImage: url,
      })
        .then(() => {
          console.log('Profile Photo added');
          setLoading(false);
          setImageUploaded(true);

        })



      Alert.alert("Image Uploaded");
      GetUserData();
      // firestore()
      //   .collection('users')
      //   .get()
      //   .then(querySnapshot => {
      //     console.log('Total posts: ', querySnapshot.size);

      //     querySnapshot.forEach(documentSnapshot => {
      //       console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
      //     });
      //   });
    } catch (error) {
      console.log(error);
    }


    // }

  }

  const uploadPhotoShowModal = () => {
    setImagestate(false);
    if (profileImage == '') {
      setUploadPhotoModal(true);

    }
    // setImageData('');
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

      UploadImage();
      setUploadPhotoModal(!uploadPhotoModal);
    } else {
      setUploadPhotoModal(!uploadPhotoModal);
    }
  }
  const TestFucntion = () =>{
    console.log('show me results *************++++++++++++++++++==================');
  }
 
  //later
  const getFcmToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log(fcmToken, "the old token for ios")
    
    if (!fcmToken) {
      try {
        let fcmToken = await messaging().getToken();

        if (fcmToken) {
          console.log(fcmToken, "new generated token for ios");
          await AsyncStorage.setItem('fcmToken', fcmToken);
          firestore()
          .collection('users')
          .doc(auth().currentUser?.uid)
          .update({
            fcmToken: fcmToken,
          })
          .then(res => {})
          .catch(error => {
            console.log(error);
          });
          setFcmToken(fcmToken);
        }

      } catch (error) {
        console.log(error, 'error raised in fcmToken for ios');
      }
    }

    // setFcmToken(fcmToken);
    
  }
  const checkMessages=()=>{
    return(
      chatsReader  ?
      <View style={{height:15, width:15, borderRadius:7, backgroundColor:'red', marginTop:15}}>

      </View>:
      null
    )
  }
  const LeftDrawer = () => {
    // console.log('My stuff '+userData);
    // console.log('Profile Image '+userProfileImage)
    return (
      <View style={{ width: '70%', height: '100%', backgroundColor: 'black' }}>
        <View style={{ flexDirection: 'row', padding: 10, marginVertical: 20, marginBottom: 10 }}>
          
          
          <View style = {{flexDirection:'row', justifyContent:'center'}}>
          <TouchableOpacity onPress={() => setDrawerModal(false)} >
          <Image
              source={require('../Images/back.png')}
              style={{ height: 20, width: 20, tintColor: 'white', margin:10, marginTop:18 }}
            />
            </TouchableOpacity>
            {
              notificationsCount > 0 ?
              <TouchableOpacity onPress={() => setDrawerModal(false)}
            style={{justifyContent:"flex-start", marginLeft:10, height:25, width:25, borderRadius:12, backgroundColor:'white',marginRight:-10}}
            >

            <Text style={{color : 'red', fontSize:20, fontWeight:'bold', alignSelf:'center', paddingBottom:-20}}>{notificationsCount}</Text>
            </TouchableOpacity>
            :
            null
            }
          </View>
            
          
          <TouchableOpacity
           onPress={() => { navigation.navigate('ProfileScreen', {allUserData:allUserData}), setDrawerModal(false) }}
          >

            <Image
              source={myProfileImageHere == "" ? (require('../Images/user.png')) : { uri: myProfileImageHere }}
              // source={require('../Images/user.png')}
              style={[styles.user_Image, { borderRadius: 35, borderColor:'black' }]}
            />
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={require('../Images/MCBadge.png')}
                style={{ height: 20, width: 20, marginTop: 15 }}
              /><Text style={[styles.userText, { fontSize: 15, fontWeight: '500', marginLeft: 5 }]}>
                {userData.eventsPosted == 0 ? 'Baron': userData.eventsPosted == 1 ? 'Viscount' 
                : userData.eventsPosted == 2 ? 'Earl': userData.eventsPosted == 3 ? 'Marquess'
                : userData.eventsPosted == 4 ? 'Prince': userData.eventsPosted == 5 ? 'King': 'Emperor'}</Text>
            </View>

          </TouchableOpacity>
          <View >
            <Text style={styles.userText}>
              {userData.name}</Text>
            {/* <Text style={[styles.userText, { fontSize: 12, fontWeight: '300', marginLeft: 5,
             flexWrap:'wrap', flex:1, width:160 }]}>
              {userData.email}</Text> */}
          </View>
        </View>
        <View style={styles.separator}>
        </View>

        <View style={styles.drawerbuttonView}>
        <View style={styles.buttonStyle}>
            <Image
              source={require('../Images/globe.png')}
              style={[styles.user_Image, { height: 35, width: 35, borderRadius: 5 }]}
            />
            <TouchableOpacity onPress={() => { setSelectedTab(3), setDrawerModal(false), setScreenName('Explore') }}>
              <Text style={[styles.userText, { marginTop: 15 }]}>Explore</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.separator, { borderWidth: 0.5, borderColor: '#808080', width: '90%' }]}>
          </View>
          <View style={styles.buttonStyle}>
            <Image
              source={require('../Images/calendar.png')}
              style={[styles.user_Image, { height: 35, width: 35, borderRadius: 5, tintColor: 'orange' }]}
            />
            <TouchableOpacity onPress={() => { setSelectedTab(1), setDrawerModal(false), setScreenName('Events') }}>
              <Text style={[styles.userText, { marginTop: 15 }]}>Events</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.separator, { borderWidth: 0.5, borderColor: '#808080', width: '90%' }]}>
          </View>
          <View style={styles.buttonStyle}>
            <Image
              source={require('../Images/post.png')}
              style={[styles.user_Image, { height: 35, width: 35, borderRadius: 7 }]}
            />
            <TouchableOpacity onPress={() => { setSelectedTab(2), setDrawerModal(false), setScreenName('My Events') }}>
              <Text style={[styles.userText, { marginTop: 15 }]}>My Events</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.separator, { borderWidth: 0.5, borderColor: '#808080', width: '90%' }]}>
          </View>
          <View style={styles.buttonStyle}>
            <Image
              source={require('../Images/usersIcon.png')}
              style={[styles.user_Image, { height: 35, width: 35, borderRadius: 5,// tintColor: 'white' 
            }]}
            />
            <TouchableOpacity onPress={() => { setSelectedTab(0), setDrawerModal(false), setScreenName('Folks') }}>
              <Text style={[styles.userText, { marginTop: 15 }]}>Folks</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.separator, { borderWidth: 0.5, borderColor: '#808080', width: '90%' }]}>
          </View>
          <View style={styles.buttonStyle}>
            <Image
              source={require('../Images/messenger.png')}
              style={[styles.user_Image, { height: 35, width: 35, borderRadius: 5, tintColor: 'white' }]}
            />
           
            <TouchableOpacity onPress={() => { setSelectedTab(4), setDrawerModal(false), setScreenName('Chats') }}>
              <Text style={[styles.userText, { marginTop: 15 }]}>Chats</Text>
            </TouchableOpacity>
            {
                checkMessages()
            }
          </View>
          <View style={[styles.separator, { borderWidth: 0.5, borderColor: '#808080', width: '90%' }]}>
          </View>

        </View>

      </View>
    )
  }
  // const getFcmToken = async () => {
  //   let fcmToken = await AsyncStorage.getItem('fcmToken');
  //   console.log(fcmToken, "the old token")
  //   if (!fcmToken) {
  //     try {
  //       let fcmToken = await messaging().getToken();

  //       if (fcmToken) {
  //         console.log(fcmToken, "new generated token");
  //         await AsyncStorage.setItem('fcmToken', fcmToken);
  //       }

  //     } catch (error) {
  //       console.log(error, 'error raised in fcmToken');
  //     }
  //   }
  //   // setFcmToken(fcmToken);
  //   Alert.alert('fcmTOken')
  // }
  const changeNumber =()=>{
    setSelectedTab(3);
    setScreenName('Folks');
  }
  const disableBackButton=()=>
  {
    // if(selectedTab === 1){
      // BackHandler.exitApp();
      // BackHandler.addEventListener('hardwareBackPress', this.setSelectedTab(1))
    // }
    // setSelectedTab(2);
    return selectedTab
  }
  return (
    <View //style={{ flex: 1 }}
    style={{height:'100%', width:'100%'}}
    >
      {/* <EventsScreen getToken = {getFcmToken}/> */}
      <View
        style={{
          bottom: 0,
          height: Platform.OS=='ios'?120:70,
          width: '100%',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          // #202A44,#30313A, 
          backgroundColor: '#202A55',
          flexDirection: 'row',
          // borderRadius: 30,
          padding: 10
        }}>
        <TouchableOpacity onPress={() => setDrawerModal(true)} style={{ marginRight: 20, marginTop:Platform.OS=='ios'?15:5}}>
          <Image source={require('../Images/list.png')}
            style={{
              width: 35,
              height: 35,
              tintColor: 'orange',
            }}
          />
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 25, fontWeight: '700', marginHorizontal: 55, marginTop:Platform.OS=='ios'?15:5 }}>{screenName}</Text>
        <Image source={require('../Images/logoFml.png')}
        // {require('../Images/logoFml.png')}
          style={{
            width: 45,
            height: 45,
            marginTop:Platform.OS=='ios'?15:5
          }}
        />

      </View>
      <Loader visible={Loading} />
      <GestureRecognizer
        onSwipeRight={() => setDrawerModal(true)}
        onSwipeLeft={() => setDrawerModal(false)}
        onSwipeDown={() => setDrawerModal(false)}
      >
        <Modal
          visible={drawerModal}
          transparent={true}
          animationType='slide'
          onRequestClose={()=>setDrawerModal(false)}
        >
          <LeftDrawer />
        </Modal>
      </GestureRecognizer>
      
      
      {/* <View style={{height:300, width:'100%', backgroundColor:'black'}}>
        <TouchableOpacity style={{height:300, width:'100%', backgroundColor:'black'}}  onPress={() => { 
          setSelectedTab(0)
          , setScreenName('Folks'), setUpdateUserDataState(false), setSelectedTab(0) 
        }}
        >
          <Text style={{color:'white', fontSize:30}}>Click to update</Text>
        </TouchableOpacity>
      </View> */}
        {

// selectedTab === 0 ? <FriendsScreen allUserData = {allUserData} />
//   : selectedTab === 1 ? <EventsScreen allpostData={allpostData}/>
//     : selectedTab === 2 ? <MyEvents allpostData={allpostData} allUserData = {allUserData}/>
//       : selectedTab === 3 ? <MapEventsScreen allpostData={allpostData} allUserData = {allUserData} selectedTab = {selectedTab}/>
//         : selectedTab === 4 ? <ChatScreen allUserData = {allUserData} userUpdate = {checkMessages}/>
//           : //<ContactTest/>
//           <StartScreen numberFtn = {changeNumber}/>

}
 {/* {

selectedTab === 0 ? <FriendsScreen allUserData = {allUserData} />
  : selectedTab === 1 && BackHandler.addEventListener('hardwareBackPress', setSelectedTab(0)) ? <EventsScreen allpostData={allpostData}/>
    : selectedTab === 2 && BackHandler.addEventListener('hardwareBackPress', setSelectedTab(1))? <MyEvents />
      : selectedTab === 3 && BackHandler.addEventListener('hardwareBackPress', setSelectedTab(2)) ? <ExploreEvents allpostData={allpostData}/>
        : selectedTab === 4 ? <ChatScreen allUserData = {allUserData}/>
          : <HomeScreen />

} */}

      <View
        style={{
          position: 'absolute',
          bottom: 8,
          height: 70,
          width: Platform.OS=='ios'?'93%':'97%',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          // #202A44,#30313A, 
          backgroundColor: '#202A55',
          flexDirection: 'row',
          borderRadius: 30,
          alignSelf:'center'
        }}>
 <TouchableOpacity style={{
          width: '20%',
          height: '100%', justifyContent: 'center', alignItems: 'center'
        }}
          onPress={() => { setSelectedTab(3), setScreenName('Explore') }}>
          <View style={styles.buttonImageView}>
            <Image source={require('../Images/globe.png')}
              style={{
                width: 30, height: 30, alignSelf: 'center',
                // tintColor: selectedTab === 3 ? 'white' : '#b2b2b2'
              }}
            />
          </View>

        </TouchableOpacity>
      
        <TouchableOpacity
          style={{
            width: '20%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => { setSelectedTab(1), setScreenName('Events') }}>

          <View style={styles.buttonImageView} >
            <Image source={require('../Images/calendar.png')}
              style={{
                width: 30,
                height: 30,
                alignSelf: 'center',
                tintColor: selectedTab === 1 ? 'white' : 'orange'//'#b2b2b2'
              }}
            />
          </View>

        </TouchableOpacity>
        <TouchableOpacity style={{
          width: '20%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}
          onPress={() => { setSelectedTab(2), setScreenName('MyEvents') }}>
          <View style={styles.buttonImageView}>
            <Image source={require('../Images/post.png')}
              style={{
                width: 35,
                height: 35,
                alignSelf: 'center',
                borderRadius: 7
                // tintColor: selectedTab === 2 ? 'white' : '#b2b2b2'
              }}
            />
          </View>

        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '20%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onPress={() => { setSelectedTab(0), setScreenName('Folks') }}
        >
          <View style={styles.buttonImageView}>
            <Image source={require('../Images/usersIcon.png')}
              style={{
                width: 30,
                height: 30,
                alignSelf: 'center',
                // tintColor: selectedTab === 0 ? 'white' : '#b9b9b9'
              }}
            />

            </View>

        </TouchableOpacity>
        <TouchableOpacity style={{ width: '20%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => { setSelectedTab(4), setScreenName('Chats') }}>
          <View style={[styles.buttonImageView,{flexDirection:'row'}]}>

            {/* <Image source={require('../Images/user.png')}
                            style={{
                                width: 40, height: 40, alignSelf: 'center',
                                borderRadius: 20, borderWidth: .2,
                                borderColor: '#ff8501',
                            }}
                        /> */}
                           
            {
              //    profileImage == '' ?
              <Image source={require('../Images/messenger.png')}
                style={{
                  width: 30, height: 30, alignSelf: 'center',
                  tintColor: selectedTab === 4 ? 'white' : '#b2b2b2',
                  borderRadius: 20, borderWidth: .2,
                  borderColor: '#ff8501',

                }}
              />
              
              // :
              // <Image source={{ uri: userProfileImage }}
              //   style={{
              //     width: 40, height: 40, alignSelf: 'center',
              //     borderRadius: 20, borderWidth: .2,
              //     borderColor: '#ff8501',
              //   }}
              // />
            }
            {
                           chatsReader  ?
              <View style={{height:15, width:15, borderRadius:7, backgroundColor:'orange', marginTop:15}}>

              </View>:
              null
            }
         
 
          </View>

        </TouchableOpacity>
      </View>
    {/* later */}
      {/* <Modal
        animationType='slide'
        visible={false}
        transparent={false}
      >
        <View style={[styles.uploadImageModal,{borderWidth:0}]}>
          <Text style={{ fontWeight: '700', fontSize: 20 }}>Choose Profile Image</Text>

          <View
            style={[styles.uploadImageBox, { borderColor: 'white' }]}
          >
            {
              imageData && imageState === false ?
                // <Text style={{color:'white', fontSize:15}}>Image Data:{imageData}</Text>
                <Image source={{ uri: imageData.assets[0].uri }}
                  // style={{ width: '90%', height: 150, borderRadius: 10, margin: 10 }} 
                  style={styles.uploadImageBox}
                />
                :
                <Image source={require('../Images/image.png')}
                  style={[styles.uploadImageBox, { opacity: 0.3 }]}
                />
            }

          </View>

          <TouchableOpacity style={styles.button} onPress={() => openCamera()}>
            <Image source={require('../Images/camera.png')}
              style={{ width: 24, height: 24, marginLeft: 20, backgroundColor: 'black', borderRadius: 5 }}
            />
            <Text style={{ marginLeft: 20, fontWeight: '700', color: 'black' }}>Open Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => openGallery()}>
            <Image source={require('../Images/gallery.png')}
              style={{ width: 24, height: 24, marginLeft: 20, backgroundColor: 'black', borderRadius: 5 }}
            />
            <Text style={{ marginLeft: 20, fontWeight: '700', color: 'black' }}>Open Gallery</Text>
          </TouchableOpacity>
          <View style={{ marginVertical:40 }}>
        
        
    <TouchableOpacity
      style={[styles.UploadButton, { marginTop: 20, height:45, width:100 }]}
      onPress={() => uploadPhotoModalHideConfirm()}
    >
      <Text style={[{ justifyContent: 'center', margin: 5, fontWeight: '600', color: 'white' }]}>
        Upload
      </Text>
        </TouchableOpacity>
          </View>
        </View>

      </Modal> */}


    </View>
  )
}
const styles = StyleSheet.create({
  buttonImageView: {
    flex:1,
    width: 40, height: 40,
    // backgroundColor: '#412a7a',
    // backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10
  },
  uploadImageModal: {
    height: 450,
    width: 380,
    marginTop: 70,
    // marginBottom:70,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'black',

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
  }, uploadImageBox: {
    width: '60%',
    height: 115,
    borderWidth: 1,
    alignSelf: 'center',
    marginVertical: 20,
    borderColor: 'black',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center'
    // flexDirection: 'row'
  }, button: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,

  },
  user_Image: {
    width: 62,
    height: 62,
    margin: 8,
    borderWidth: 0.5,
    borderColor: '#ff8501',
    justifyContent: 'center',
  },
  userText: {
    fontSize: 20,
    fontWeight: '500',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: -5,
    color: 'white'
  },
  separator: {
    width: '100%',
    height: 2,
    borderWidth: 1,
    borderColor: 'white'
  },
  drawerbuttonView: {
    marginLeft: 40,
    marginTop: 30
  },
  buttonStyle: {
    flexDirection: 'row',
    marginVertical: 10
  }
});
// const testThisReference = new TabNavigationCustom();
export default TabNavigationCustom
// export default testThisReference;

{/* <Modal
animationType='slide'
visible={uploadPhotoModal}
transparent={true}
>
<View style={styles.uploadImageModal}>
  <Text style={{ fontWeight: '700', fontSize: 20 }}>Choose Profile Image</Text>

  <View
    style={[styles.uploadImageBox, { borderColor: 'white' }]}
  >
    {
      imageData && imageState === false ?
        // <Text style={{color:'white', fontSize:15}}>Image Data:{imageData}</Text>
        <Image source={{ uri: imageData.assets[0].uri }}
          // style={{ width: '90%', height: 150, borderRadius: 10, margin: 10 }} 
          style={styles.uploadImageBox}
        />
        :
        <Image source={require('../Images/image.png')}
          style={[styles.uploadImageBox, { opacity: 0.3 }]}
        />
    }

  </View>

  <TouchableOpacity style={styles.button} onPress={() => openCamera()}>
    <Image source={require('../Images/camera.png')}
      style={{ width: 24, height: 24, marginLeft: 20, backgroundColor: 'black', borderRadius: 5 }}
    />
    <Text style={{ marginLeft: 20, fontWeight: '700', color: 'black' }}>Open Camera</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.button} onPress={() => openGallery()}>
    <Image source={require('../Images/gallery.png')}
      style={{ width: 24, height: 24, marginLeft: 20, backgroundColor: 'black', borderRadius: 5 }}
    />
    <Text style={{ marginLeft: 20, fontWeight: '700', color: 'black' }}>Open Gallery</Text>
  </TouchableOpacity>
  <View style={{ flexDirection: 'row' }}>
    {/* <TouchableOpacity
            style={[styles.UploadButton, { marginTop: 20 }]}
            onPress={() => uploadPhotoModalHideCancel()}
          >
            <Text style={[{ justifyContent: 'center', margin: 5, fontWeight: '600', color: 'white' }]}>
              Cancel
            </Text>
          </TouchableOpacity> */}
{/*
    <TouchableOpacity
      style={[styles.UploadButton, { marginTop: 20 }]}
      onPress={() => uploadPhotoModalHideConfirm()}
    >
      <Text style={[{ justifyContent: 'center', margin: 5, fontWeight: '600', color: 'white' }]}>
        Upload
      </Text>
    </TouchableOpacity>
  </View>
</View>

</Modal> */}


