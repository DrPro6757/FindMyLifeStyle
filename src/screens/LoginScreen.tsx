import { View, Text, StyleSheet, Alert, TextInput, Dimensions, TouchableOpacity, StatusBar, FlatList, Platform, Image, Modal, ScrollView } from 'react-native'
import React, { isValidElement, useEffect, useState } from 'react'
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
// import firestore from '@react-native-firebase/firestore';
import { useNavigation, StackActions } from '@react-navigation/native'
import SignUpScreen from './SignUpScreen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import Loader from './Loader';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import axios from 'axios';
import { BASE_URL, LOGIN_USER, REGISTER_USER } from '../Utils/Strings';
import {useDispatch} from 'react-redux';
import { getMyUserDataAction } from '../Redux/actionsUser';

let getName;
let getEmail;
let getId;
let getFcm;
let getProfilepic;

let tcCheck = '';
let tcChecked = '';

const LoginScreen = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [imageData, setImageData] = useState('');
  const [acceptTC, setAcceptTC] = useState(true);
  const [TCModal, setTCModal] = useState(false);
  const [mydata, setMyData] = useState();
  const [myName, setMyName] = useState("");


  const navigation = useNavigation();

  const photoSetOkay = 'set';
  const dispatch = useDispatch();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '437973898135-795sca94fnnjnrbv3m1f3tb9tbj7apcp.apps.googleusercontent.com',
    });
    getTC();
    AsyncStorage.setItem("PHOTOSET", photoSetOkay)
  }, [])

  const termsAndConditionsAccept = async () => {
    setAcceptTC(true);
    // 
    tcCheck = await AsyncStorage.setItem('TCCHECK', 'accepted')
    tcChecked = await AsyncStorage.getItem('TCCHECK');
  }
  const getTC = async () => {
    tcChecked = await AsyncStorage.getItem('TCCHECK');
    tcChecked = 'accepted';
  }
  const openCloseTCModal = () => {
    setTCModal(!TCModal);
  }

  const GoogleLogin = async () => {
    try {
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
      navigation.dispatch(StackActions.replace('TabNavigationCustom'));
    } catch (error) {
      console.log(error);
    }
  }
  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
  
    // Once signed in, get the users AccessToken
    const data = await AccessToken.getCurrentAccessToken();
  
    if (!data) {
      console.log('data=>',data)
      throw 'Something went wrong obtaining access token';
    }
  
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  }
  async function _signInWithFaceBook(){
   let cred = await onFacebookButtonPress();
   console.log('cred=>',cred)
  //  ().then(() =>
  //      console.log('Signed in with Facebook!')
  //     )
  }
  let myDataIdHere = '';
  const HandleLoginUser= async()=>{
    console.log('email ', email)
    console.log('password ', password)

      const userData = {
        email:email,
        password:password,
      };
      
      // send a post request to the backend API for Login
      // http://10.0.2.2:8000/api/
      await axios.post(BASE_URL+'users/login',userData)
      .then((res)=>{
        if(res.data.message == "user not found"){
          Alert.alert(res.data.message)
        }
        else if(res.data.message == "Wrong Password")
        {
        Alert.alert(res.data.message)
      }else{
        Alert.alert(res.data.message)
        
        myDataIdHere = res.data.data._id;
        setPermanentValue();
        // const myDataId = AsyncStorage.getItem('USER_DATA_ID');
        AsyncStorage.setItem('isLoggedIn', 'true');
        
        dispatch(getMyUserDataAction(res.data))
        
        navigation.dispatch(StackActions.replace('DrawerTabNavigation'));//CustomNavigator
      }
        
      })
      .catch((error)=>{
        console.log('Please check your email id or password ', error)
      })
   
    
  }
  const setPermanentValue = async()=>{
    console.log('My Data On Login Screen',myDataIdHere);

    try {
      AsyncStorage.setItem('USER_DATA_ID', myDataIdHere)
    } catch (error) {
      console.log('error',error)
    }
    try {
      const idValue = await AsyncStorage.getItem('USER_DATA_ID')
      console.log('data from async here in login ', idValue)

    } catch (error) {
      console.log('error',error)
    }

  } 
  const LoginUser = async () => {
    try {
      if (email.length > 0 && password.length > 0 && tcChecked == 'accepted') {
        const user = await auth().signInWithEmailAndPassword(email, password);
        console.log(user);
        if (user.user.emailVerified) {
      // getDatabase();
          // Alert.alert("Welcome, to our online community! We're thrilled to have you here...");
          setMessage('');
          // console.log(isUserLogin);
          navigation.dispatch(StackActions.replace('TabNavigationCustom'));
          // navigation.dispatch(StackActions.replace('HomeScreen'));
        } else {
          Alert.alert("Please verify email by clicking link in Inbox");
          await auth().currentUser?.sendEmailVerification();
          await auth().signOut();
        }

        
        <Loader visible={true} />
      }
      else {
        Alert.alert('Please Enter Username or Password');
      }
    }
    catch (error) {
      console.log(error);
      setMessage(error.message);
      Alert.alert('Please Enter Valid Username or Password');
    }
  }

  // const getDatabase = async () => {
  //   try {
  //     const data = await firestore().collection('users').doc(auth().currentUser?.uid).
  //       get();
  //     console.log("my data::" + auth().currentUser?.uid);
  //     setMyData(data._data);
  //     // const name = data._data.name;
  //     setMyName(data._data[0]);
  //     console.log('my name '+myName)
  //     // const name = data._data.name;
  //     // const email = data._data.email;
  //     // const id = data._data.id;
  //     // const profileImage = data._data.profileImage;
  //     // const fcmToken = data._data.fcmToken;
  //     // setImageData(profileImage);
  //     //     goToNext(name, email, id, fcmToken, profileImage);
  //     //     getName = await AsyncStorage.setItem("NAME", name);
  //     //     getEmail        =  await AsyncStorage.setItem("EMAIL", email);
  //     // getId = await AsyncStorage.setItem("USERID", id);
  //     // getProfilepic = await AsyncStorage.setItem("profileImage", profileImage);
  //     // getFcm = await AsyncStorage.setItem("MYFCMTOKEN", fcmToken);
  //     // console.warn("My User ID FCM TOKEN Stored And Set Asynchronysly:" + getFcm);
  //     // console.warn("My User ID Stored And Set Asynchronysly:" + getId);


  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // const goToNext = async (name, email, id, fcmToken, profileImage) => {
  //     name = await AsyncStorage.setItem("NAME", name);
  //     email = await AsyncStorage.setItem("EMAIL", email);
  //     id = await AsyncStorage.setItem("USERID", id);
  //     profileImage = await AsyncStorage.setItem("profileImage", profileImage);
  //     fcmToken = await AsyncStorage.setItem("MYFCMTOKEN", fcmToken);
  //     console.warn("My User ID FCM TOKEN Stored And Set Asynchronysly:" + fcmToken);
  // }
  const NavigateSignUp = () => {
    navigation.navigate('SignUpScreen');
  }
  const resetPassword = async() => {
    if (email !== '') {
      let myEmail =await firebase.auth().currentUser?.email 
      if(myEmail == null)
      {
        myEmail = await AsyncStorage.getItem("EMAIL")

      }
      await firebase.auth().sendPasswordResetEmail(myEmail)
        .then(() => {
          Alert.alert('An Password Reset Link Has Been Sent To Your Email')
        }).catch((error) => {
          Alert.alert(error)
        })
    } else {
      Alert.alert('Please Enter The Valid Email')
      console.log('no email entered')
    }

  }
  return (
    // 
    // <ScrollView>
    // <SafeAreaView>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%',backgroundColor:'black' }}>
      {/* <Video source={require('../Images/video.mp4')}
        paused={false}
        style={styles.backgroundVideo}
        autoplay={true}
        repeat={true}
        muted={false}
        volume={1.0}
        resizeMode={'cover'}
      /> */}
      <View style={styles.mainContainer}>

        <Image source={require('../Images/logoFml.png')}
          style={{ height: 100, width: 100, marginTop: 30 }}
        />
        <View style={styles.container}>
          <StatusBar hidden={true} />
          <Text style={styles.table}>Log In</Text>
          <View>
            <TextInput style={styles.inputBox} placeholder='Enter Your Email'
              placeholderTextColor='white'

              value={email}
              onChangeText={(value) => setEmail(value)}
            />
            {/* <Text style={{color:'red'}}>User not found</Text> */}
            <TextInput style={styles.inputBox} placeholder='Enter Your Password'
              placeholderTextColor='white'
              value={password}
              onChangeText={(value) => setPassword(value)}
              secureTextEntry={true}
            />
            {/* <Text style={{color:'red'}}>Wrong Password</Text> */}
            <TouchableOpacity style={styles.addButton} onPress={() => HandleLoginUser()}>
              <Text style={{ color: 'white', fontSize: 22 }}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={() => NavigateSignUp()}>
              <Text style={{ color: 'white', fontSize: 22 }}>Sign Up</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 15, color: 'red' }}>{message}</Text>
          </View>

          <TouchableOpacity onPress={() => resetPassword()}>
            <Text
              style={{
                marginBottom: 15,
                color: 'white', fontSize: 16, marginRight: 5, alignSelf: 'center'
              }}>Forget Password?</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <TouchableOpacity onPress={() => termsAndConditionsAccept()}>
              <View style={styles.radioButton}>
                <View style={styles.circle}>
                  {
                    tcChecked !== '' || acceptTC ?
                      <View style={styles.circleInside}>

                      </View> :

                      <View></View>

                  }
                </View>
                <Text style={{ color: 'white', fontSize: 16, alignSelf: 'center', marginLeft: 10 }}>I Agree To </Text>

              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openCloseTCModal()}>
              <Text style={{ textDecorationLine: 'underline', color: 'lightblue', fontSize: 16, marginRight: 5, alignSelf: 'center', marginTop: 9 }}>Term's and Conditions</Text>
            </TouchableOpacity>
          </View>




          {Platform.OS === 'android' ? (
            <View>
              <TouchableOpacity
                style={{ backgroundColor: '#f5e7ea', width: 300, alignSelf: 'center', height: 50, marginBottom: 10 }}
                onPress={() => { GoogleLogin() }}
              >
                <Text style={{ alignSelf: 'center', marginVertical: 10, color: '#de4d41', fontSize: 20, fontWeight: '700' }}>
                  Sign in with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#f5e7ea', width: 300, alignSelf: 'center', height: 50, marginBottom: 100 }}
                onPress={() => { _signInWithFaceBook() }}
              >
                <Text style={{ alignSelf: 'center', marginVertical: 10, color: 'blue', fontSize: 20, fontWeight: '700' }}>
                  Sign in with Facebook</Text>
              </TouchableOpacity>
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
              {/* <TouchableOpacity
        style={{backgroundColor:'#e6eaf4', width:300, alignSelf:'center', height:50,
         marginTop:10, marginBottom:30}}
        onPress={()=>{GoogleLogin()}}
        >
          <Text style={{alignSelf:'center', marginVertical:10, color:'#4867aa', fontSize:20, fontWeight:'700'}}>
            Sign in with Facebook</Text>
        </TouchableOpacity> */}
            </View>

          ) : null}

        </View>

      </View>
    </View>
    // </SafeAreaView>
    // </ScrollView>

  )
}
const { height, width } = Dimensions.get('screen');
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    // backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',

  },
  table: {
    color: 'white',
    fontSize: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    fontWeight: '700'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    marginTop: 20,
    width: '100%',
    // #30313A, #292460,#202A44
    // backgroundColor: '#202A44',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,

  },
  inputBox: {
    width: width - 30,
    borderRadius: 15,
    borderWidth: 2,
    marginVertical: 10,
    padding: 10,
    borderColor: 'white',
    color: 'white'
  },
  addButton: {
    backgroundColor: '#00A36C',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  cardContainer: {
    marginVertical: 20,
  },
  card: {
    backgroundColor: 'green',
    width: width - 40,
    padding: 20,
    borderRadius: 30,
    marginVertical: 10,
  },
  radioButton: {
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
    margin: 10,
    flexDirection: 'row',
  },
  circle: {
    height: 25,
    width: 25,
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 1,
    justifyContent: 'center'
  },
  circleInside: {
    height: 18,
    width: 18,
    borderRadius: 17,
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: '#00A36C',
    alignSelf: 'center',
    marginTop: 1.4,
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
export default LoginScreen;