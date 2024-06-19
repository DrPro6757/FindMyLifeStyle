import { View, Text, StyleSheet, TextInput, Dimensions, PermissionsAndroid, TouchableOpacity, StatusBar, Modal, FlatList, Alert, ScrollView, Image, KeyboardAvoidingView } from 'react-native'
import React, { isValidElement, useEffect, useState } from 'react'
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation, StackActions, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';

import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { differenceInYears } from 'date-fns';
import ImageUpload from './ImageUpload';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import messaging from '@react-native-firebase/messaging';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

import GetLocation from 'react-native-get-location';
import LocationUser from './LocationUser';
import { requestAndroidPermission } from 'react-native-get-location/dist/utils';
import GestureRecognizer from 'react-native-swipe-gestures';
import DropDownPicker from 'react-native-dropdown-picker';
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import { color } from 'react-native-reanimated';
import Video from 'react-native-video';
import EventsScreen from './EventsScreen';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Loader from './Loader';
import axios from 'axios';
import { BASE_URL, REGISTER_USER } from '../Utils/Strings';

// import firestore from '@react-native-firebase/firestore';
const SignUpScreen = () => {
  const route = useRoute();
  const [email, setEmail] = useState('kali@gmail.com');
  const [password, setPassword] = useState("123456");
  const [name, setName] = useState("Kali");
  const [dob, setDob] = useState(null);
  const [myAge, setMyAge] = useState(0);
  const [gender, setGender] = useState(null);
  const [genderModal, setGenderModal] = useState(false);
  const [education, setEducation] = useState(null);
  const [educationModal, setEducationModal] = useState(false);

  const [work, setWork] = useState('');


  const [message, setMessage] = useState("");
  const [date, setDate] = useState(new Date());

  const [inputTextValue, setInputTextValue] = useState('');
  const [list, setList] = useState('');
  const [isUpdateData, setIsUpdateData] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [relationShipModal, setRelationShipModal] = useState(false);
  const [relationShip, setRelationship] = useState(null);


  const [radioCircle, setRadioCircle] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState('');
  const [selectedView, setSelectedView] = useState(0);
  const [interestModal, setInterestModal] = useState(false);
  const [deviceFcmToken, setFcmToken] = useState('');
  const [location, setLocation] = useState("");
  const [locationAccessStatus, setLocationAccessStatus] = useState('');
  const [getLongitutde, setGetLongitude] = useState(0);
  const [getLatitude, setGetLatitude] = useState(0);
  const [locationModal, setLocationModal] = useState(false);
  let MLong = 0;
  let MLat = 0;
  const [marker, setMarker] = useState(false);
  const [markerPostion, setMarkerPosition] = useState();

  const [permissionGranted, setPermissionGranted] = useState(false)
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
const interestsArrays = [
  {
      value: 'Hobbies and Activities', key: 0,
  },
  { value: 'Professional Interests', key: 1, },
  { value: 'Health and Lifestyle', key: 2, },
  { value: 'Food and Dining', key: 3, },
  { value: 'Technology and Gaming', key: 4, },
  { value: 'Social Causes', key: 5, },
  { value: 'Travel', key: 6, },
  { value: 'Arts and Culture', key: 7, },
  { value: 'Learning and Education', key: 8, },
  { value: 'Regional and Cultural Interests', key: 9, },
  { value: 'Entertainment', key: 10, },
  { value: 'Dating And Party', key: 11, },
]
// https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/512x512/users5.png
  const interestArr = [
    { key: '34', value: 'Dating And Party', disabled: true },
    { key: '4', value: 'Intimate relationship' },
    { key: '4', value: 'Friends with benefits' },
    { key: '4', value: 'Speed dating' },
    { key: '4', value: 'Casual dating' },
    { key: '4', value: 'Friendship' },
    { key: '4', value: 'Meetup' },
    { key: '4', value: 'Double dating' },
    { key: '4', value: 'Matchmaking' },
    { key: '4', value: 'Serious Relationship' },
    { key: '4', value: 'Balls' },
    { key: '4', value: 'Banquets' },
    { key: '4', value: 'Birthday party' },
    { key: '4', value: 'Surprise party' },
    { key: '4', value: 'Dinner party' },
    { key: '4', value: 'Garden party' },
    { key: '4', value: 'Cocktail party' },
    { key: '4', value: 'Tea party' },
    { key: '4', value: 'Reception' },
    { key: '4', value: 'Dances and balls' },
    { key: '4', value: 'Block party' },
    { key: '4', value: 'Costume or fancy dress party' },
    { key: '4', value: 'Christmas caroling party' },
    { key: '4', value: 'Pool party' },
    { key: '4', value: 'Singles dance party and mixer' },
    { key: '4', value: 'Fundraising party' },
    { key: '4', value: 'Graduation party' },
    { key: '4', value: 'Marriage-related parties' },
    { key: '4', value: 'Showers' },
    { key: '4', value: 'Housewarming party' },
    { key: '4', value: 'Welcome party' },
    { key: '4', value: 'Farewell party' },
    { key: '4', value: 'Cast party' },
    { key: '4', value: 'Pre-party' },
    { key: '4', value: 'After-party' },
    { key: '1', value: 'Hobbies and Activities', disabled: true },
    { key: '2', value: 'Gardening' },
    { key: '3', value: 'Photography' },
    { key: '4', value: 'Reading' },
    { key: '5', value: 'Writing' },
    { key: '6', value: 'Knitting' },
    { key: '7', value: 'Drawing' },
    { key: '8', value: 'Scrapbooking' },
    { key: '9', value: 'Sewing' },
    { key: '10', value: 'Origami' },
    { key: '11', value: 'Chess' },
    { key: '12', value: 'Jewellery' },
    { key: '13', value: 'Quilting' },
    { key: '14', value: 'Blog' },
    { key: '15', value: 'Calligraphy' },
    { key: '16', value: 'Blog' },
    { key: '17', value: 'Embroidery' },
    { key: '18', value: 'Painting' },
    { key: '19', value: 'Acting' },
    { key: '20', value: 'Games' },
    { key: '21', value: 'Magic' },
    { key: '22', value: 'Art' },
    { key: '23', value: 'Music' },
    { key: '24', value: 'Professional Interests', disabled: true },
    { key: '4', value: 'Reading' },
    { key: '5', value: 'Writing' },
    { key: '4', value: 'Marketing' },
    { key: '5', value: 'Creativity' },
    { key: '4', value: 'Leadership' },
    { key: '5', value: 'Construction' },
    { key: '4', value: 'Teamwork' },
    { key: '5', value: 'Coding' },
    { key: '4', value: 'Design' },
    { key: '25', value: 'Health and Lifestyle', disabled: true },
    { key: '4', value: 'Exercise' },
    { key: '5', value: 'Mental Health' },
    { key: '4', value: 'Sleep' },
    { key: '4', value: 'Fitness' },
    { key: '5', value: 'Food' },
    { key: '4', value: 'Health' },
    { key: '4', value: 'Mediation' },
    { key: '4', value: 'Yoga' },
    { key: '26', value: 'Food and Dining', disabled: true },
    { key: '4', value: 'Restaurants' },
    { key: '4', value: 'Clubs' },
    { key: '4', value: 'Hotels' },
    { key: '4', value: 'Serving and Tasting' },
    { key: '4', value: 'Ingredient selection' },
    { key: '27', value: 'Technology and Gaming', disabled: true },
    { key: '4', value: 'Artificial intelligence' },
    { key: '4', value: 'Game design' },
    { key: '4', value: 'Esports' },
    { key: '4', value: 'Video game developer' },
    { key: '4', value: 'Coding' },
    { key: '4', value: 'Crypto' },
    { key: '4', value: 'Block Chain' },
    { key: '4', value: 'Software Development' },
    { key: '28', value: 'Travel', disabled: true },
    { key: '4', value: 'Tourism' },
    { key: '4', value: 'Beach' },
    { key: '4', value: 'Hiking' },
    { key: '4', value: 'Geocoaching' },
    { key: '4', value: 'Cruise ship' },
    { key: '4', value: 'History' },
    { key: '4', value: 'Cultural tourism' },
    { key: '4', value: 'Adventure travel' },
    { key: '4', value: 'Cooking' },
    { key: '4', value: 'Dance' },
    { key: '4', value: 'Amusement park' },
    { key: '4', value: 'Fishing' },
    { key: '4', value: 'Dark tourism' },
    { key: '4', value: 'Agritourism' },
    { key: '29', value: 'Social Causes', disabled: true },
    { key: '4', value: 'Caring for Children' },
    { key: '4', value: 'Learning in a Social Environment' },
    { key: '4', value: 'Collaborative Work' },
    { key: '4', value: 'Concerts' },
    { key: '4', value: 'Community Participation' },
    { key: '4', value: 'Debate' },
    { key: '4', value: 'Substance Abuse disorders' },
    { key: '4', value: 'Medical Social Worker' },
    { key: '4', value: 'Healthcare' },
    { key: '4', value: 'Justice and corrections' },
    { key: '4', value: 'Aging' },
    { key: '4', value: 'Child welfare' },
    { key: '4', value: 'Policy Analyst' },
    { key: '4', value: 'Politics' },
    { key: '4', value: 'Community social work' },

    // {key:'30', value: 'Arts and Culture'},
    // {key:'31', value: 'Learning and Education'},
    // {key:'32', value: 'Regional and Cultural Interests' },
    // {key:'33', value: 'Entertainment'},



  ]
  const [selected, setSelected] = useState([])

  const [allInterests, setAllInterests] = useState()
  const [mySelectedInterests, setMySelectedinterests] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState();


  const [Loading, setLoading] = useState(false);
  const [imgDownloadUrl, setImgDownloadUrl] = useState("");
  const [imageUploaded, setImageUploaded] = useState(false);
  const [uploadPhotoModal, setUploadPhotoModal] = useState(false);


  let myprofileImage = ''

  let getResult;

  const GetLocationOfUser = () => {
    // navigation.navigate('LocationUser');

    // GetUserLocation()
    setLocationModal(true)

  }
  useEffect(() => {
    // GetLocationPermissionFromUser()
    setLoading(false);
  }, [])

  //   useEffect(() => {
  //     //  if(marker!==undefined){
  //     //     Geocoder.from(marker.latitude, marker.longitude).then(data=>{
  //     //         let fetchedAddress = data.results[0].formatted_address;
  //     //         setAddress(fetchedAddress);
  //     //         console.log('Address '+fetchedAddress);
  //     //     });
  //     //  }
  //     GetLocationPermissionFromUser();
  //     }, [marker])
  // if(!permissionGranted){
  //     return
  //     <View>
  //         <Text>Please Allow Persmission</Text>
  //     </View>
  // }
  const myLocationObj = {
    latitude : 51.661128,
    longitude : -0.39702,
  }
  async function GetLocationPermissionFromUser() {

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'Location Permission.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Location');
        // getCurrentLocation();
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }
  const GetUserLocation =  () => {
    GetLocationPermissionFromUser();
    Geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        // setGetLatitude(position.coords.latitude);
        // setGetLongitude(position.coords.longitude);
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }
  async function getCurrentLocation() {
    setMarker(true);
    setLocationAccessStatus('Granted')
    // Alert.alert('Thanks For Sharing Location');
    // GetUserLocation();
    setLocationModal(false);
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(location => {
        
        console.log('My Current Location ::' + location.longitude + ',' + location.latitude);
        setGetLatitude(location.latitude);
        setGetLongitude(location.longitude);
        MLong = location.longitude;
        MLat = location.latitude;
        console.log("My Location on click " + MLong, MLat)
        console.log('My location *******'+location )

        setLocation(MLong + ',' + MLat);
        if (markerPostion == 'null') {
          setMarkerPosition(location)
        }
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
        // Alert.alert('Please Give Location Permission');
        // GetLocation.getCurrentPosition({
        //   enableHighAccuracy: true,
        //   timeout: 60000,
        // })
        // console.log('My Current Location ::' + location.longitude + ',' + location.latitude);
        // setGetLatitude(location.latitude);
        // setGetLongitude(location.longitude);
        // MLong = location.longitude;
        // MLat = location.latitude;
        // console.log("My Location on click " + MLong, MLat)
        // setLocation(MLong + ',' + MLat);
        // if (markerPostion == 'null') {
        //   setMarkerPosition(location)
        // }
        // getPermisionAgain()
        setGetLatitude(myLocationObj.latitude);
        setGetLongitude(myLocationObj.longitude);
        setMarkerPosition(myLocationObj)
      })
  }
  const getPermisionAgain=()=>{
    // getCurrentLocation();
  }

  const GooglePlacesInput = () => {
    return (
      <GooglePlacesAutocomplete
        placeholder='Search'
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
        query={{
          key: 'YOUR API KEY',
          language: 'en',
        }}
      />
    );
  };
  const showInterestModal = () => {
    setInterestModal(true);
  }
  const HideGenderModalFtn = () => {
    setGenderModal(!genderModal)
  }
  const HideEducationModalFtn = () => {
    setEducationModal(!educationModal)
  }
  const setEducationModalFtn = (education) => {
    setEducation(education);
  }
  const setGenderModalFtn = (gender) => {
    setGender(gender);
  }
  const HideRelationShipModalFtn = () => {
    setRelationShipModal(!relationShipModal)
  }
  const setRelationShipModalFtn = (relationShip) => {
    setRelationship(relationShip);
  }

  const showDatePicker = () => {
    setDatePickerVisibility(!isDatePickerVisible);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleDatePicker = (date) => {
    console.warn('Date Picked ' + date);
    const dt = new Date(date);
    const x = dt.toISOString().split("T");
    const x1 = x[0].split('-');
    console.log(x1[2] + "/" + x1[1] + "/" + x1[0]);
    setDob(x1[0] + "/" + x1[1] + "/" + x1[2]);
    setDatePickerVisibility(false);
    // const daysBetween = new Date().getDate() - new Date('2020-07-15T13:29:15.524486Z').getDate()
    // const birthDate = new Date(dob); 
    const DateToday = new Date();
    const today = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const currentDate = year + '/' + month + '/' + today
    console.log("two dates ::" + DateToday, "+date selected = " + date);
    const ageYears = differenceInYears(DateToday, date);
    setMyAge(ageYears);
    console.log("Youe age in years::" + ageYears)
  }

  const navigation = useNavigation();

  const handleAddData = async () => {
    try {
      const index = list.length;
      const response = await database().ref(`social/${index}`).set({
        value: inputTextValue
      });
      console.log(response);
      setInputTextValue('');
    } catch (error) {
      console.log(error)
    }
  }
  const handleUpdateData = async () => {
    try {
      const responseUpdate = await database().ref(`social/${selectedCardIndex}`).update({
        value: inputTextValue
      });
      console.log(responseUpdate);
    } catch (error) {
      console.log(error);
    }
  }
  const handleOnCardPressed = (cardIndex, cardValue) => {
    try {
      console.log(cardIndex);
      setIsUpdateData(true);
      setSelectedCardIndex(cardIndex);
      setInputTextValue(cardValue);
    } catch (error) {
      console.log(error);
    }
  }
  // const [myData, setMyData] = useState('');

  useEffect(() => {
    getDatabase();
    // getFcmToken();
  }, [])
  const getDatabase = async () => {
    try {
      // for rading data from real time database firebase
      // const data = await database().ref('social').once("value");
      const data = await database().ref('social').on("value", tempData => {
        // console.log(data);
        setList(tempData.val());
      });


      // await firebase.initializeApp;
      /// for reading data from firestore
      // const data = await firestore().
      // collection("testingFmp").
      // doc("xElFVN0lXoAveFq63twG").
      // get();
      // setMyData(data._data);

    } catch (error) {
      console.log(error);
    }
  }
 
  let temp = []
  let valueSelected

  const selectInterest = (item) => {
    setSelectedInterest(item.interestName)
        console.warn(selectedInterest);
        setSelectedView(item.index);
        console.log("Selected View = " + selectedView);
        setInterestModal(false);
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
  const UploadImage = async () => {
    //later
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
        // firestore().collection('users').doc(response.user.uid).update({
        //   profileImage: url,
        // })
        //   .then(() => {
        //     console.log('Profile Photo added');
        //     setLoading(false);
        //     setImageUploaded(true);
        //   })



        // Alert.alert("Image Uploaded");

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
  const [emailState, setEmailState] = useState(false);
  const [nameState, setNameState] = useState(true);
  const [passwordState, setPasswordState] = useState(false);
  const [dobState, setDOBState] = useState(false);
  const [genderState, setGenderState] = useState(false);
  const [interestState, setInterestState] = useState(false);
  const [photoState, setPhotoState] = useState(false);
  const [locationState, setLocationState] = useState(false);
  const [imageData, setImageData] = useState();
  const [imageState, setImagestate] = useState(false);
  const [finalState, setFinalState] = useState(false);
  const url = ''
  
  const strongRegex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");
  const EmailScreenFtn=()=>{
    if(name !== ''){
      setEmailState(true);
      setNameState(false);
    }else{
      Alert.alert('Name Field Can Not Be Empty');
    }
    
  }
  const PasswordScreenFtn=(email)=>{
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false) {

      Alert.alert('Please Enter Valid Email');
      // setState({ email: text })
      return false;
    }
    else {
      // this.setState({ email: text })
      setPasswordState(true);
    setEmailState(false);
    setNameState(false);
    }
   
  }
  const DobScreenFtn=()=>{
    if(password.length > 5){
    setPasswordState(false);
    setEmailState(false);
    setDOBState(true);
    }else{
      Alert.alert('Password Must Be 8 Character Long');
    }
  }
  const GenderScreenFtn=()=>{
    if(dob !== null){
    setDOBState(false);
    setGenderState(true);
  }else{
    Alert.alert('Please Choose Valid Date');
  }
  }
  const InterestScreenFtn=()=>{
    if(gender !== null){
    setGenderState(false);
    setInterestState(true);
  }else{
    Alert.alert('Please Choose Your Gender');
  }
  }
  const PhotoScreenFtn=()=>{
    if(selectedInterest !== ''){
    setInterestState(false);
    setPhotoState(true);
  }else{
    Alert.alert('Please Select Any Interest');
  }
  }
  const LocationScreenFtn= async()=>{
    if(imageData !== undefined && imageData!== ''){ 
      // setLoading(true)
      
    setPhotoState(false);
    setLocationState(true);
    // setLoading(true)
  }else{
    Alert.alert('Please Add Proifle Photo');
  }
  }
  const FinalScreenFtn=()=>{
      if(locationAccessStatus !== ''){ 
    setLocationState(false);
    setFinalState(true);
  }else{
    Alert.alert('Please Point Your Location On Map');
  }
  }
  const createUser = async () => {
    try {
      Alert.alert("We're Setting Things Up For You, Almost There!");
      setLoading(true);
      UploadImage();
      if (email.length > 0 && password.length > 0 && name.length > 0
        && dob !== null
        && gender !== null// && locationAccessStatus !== ''
         && selectedInterest!== '' && imgDownloadUrl !== null
      ) {
        const response = await auth().createUserWithEmailAndPassword(email, password);
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
          profileImage: imgDownloadUrl,
          photos: [],
          following: [],
          fcmToken: deviceFcmToken,
          relationshipStatus: relationShip,
          signUpTime: new Date(),
          interest: selectedInterest,
          age: myAge,
          eventsPosted: 0,
          myLocation: markerPostion,
          work: '',
          status: 'online', 
          education: '',
          chatsBy: [],
          messageFrom:[],
          EventWishList:[],
          myLikedEvents:[],

        }

        await firestore().collection("users").doc(response.user.uid).set(userData);
        // await firestore().collection("users").doc(response.user.uid).get();



        await auth().currentUser?.sendEmailVerification();
        await auth().signOut();
        await firestore().collection("fcmToken").doc(response.user.uid).set({ deviceFcmToken });
        goToNext(userData.name, userData.email, userData.id, deviceFcmToken);
        const userNotificationsData = {
          messageBody: ['Welcome To FML'],
          messageTitle: ['Welcome To FML'],
          messageContent:['Welcome To FML'],
          messageType: '',
          receiverId: '',
          receiverToken: '',
          senderId: '',
          senderToken: '',
          senderProfileImage: '',
          senderUserName: '',
          timeStamp: '',
          notificationCounter:1,

        }
        await firestore().collection('notifications').doc(response.user.uid).set(userNotificationsData);
        // await firestore().collection('users').doc(auth().currentUser?.uid).set('')


        Alert.alert("Please verify your email check out Link in your inbox");
        navigation.dispatch(StackActions.replace('LoginScreen'));

      } else {
        Alert.alert('Please Fill All Details');
      }
    } catch (error) {
      console.log(error);
      setMessage(error.message);
    }
  }
  //later
  //  const getFcmToken = async () => {
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
  //   setFcmToken(fcmToken);
  // }
  const goToNext = async (name, email, id, myFcm) => {
    await AsyncStorage.setItem("NAME", name);
    await AsyncStorage.setItem("EMAIL", email);
    await AsyncStorage.setItem("USERID", id);
    await AsyncStorage.setItem("MYFCMTOKEN", myFcm);



  }
  const HandleRegisterUser=()=>{
    console.log('name ', name)
    console.log('email ', email)
    console.log('password ', password)

      const myHeaders = new Headers()
      myHeaders.append('Content-type','application/json')
      const userData = {
        name:name,
        email:email,
        password:password,
        dob: dob,
        gender: gender,
        interest: selectedInterest,
      };
      //10.0.2.2   192.168.18.122  192.168.18.1
      
      // fetch('http://10.0.2.2:8000/register',{
      //   body: JSON.stringify({
      //     name:name,
      //     email:email,
      //     password:password,
      //   }),
      //   method: 'POST',
      //   headers:myHeaders
      // }).then (res =>res.json())
      // .then(json =>{
      //   console.log(json);
      //   Alert.alert("You have successfully registered your email")
      //   setLoading(false)
      // })
      // .catch(error=>{
      //   setLoading(false)
      //   console.log('Registeration Failed', error);
      // })       
      // Alert.alert("You have successfully registered your email")
      
      // send a post request to the backend API
      axios.post(BASE_URL+REGISTER_USER,userData)
      .then((res)=>{
        Alert.alert("You have successfully registered your email")
        console.log(res);
      })
      .catch((error)=>{
        console.log('Registeration Failed ', error)
      })
      setLoading(false);
   
    
  }
  return (
    // <KeyboardAwareScrollView extraHeight={120} enableOnAndroid>
          

<View style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
        {/* <Video source={require('../Images/TwinkleSky.mp4')}
        paused={false}
        style={styles.backgroundVideo}
        autoplay={true} 
        repeat={true}
        muted={false}
        volume={1.0}
        resizeMode={'cover'}
      /> */}
      <Loader visible={Loading}/>
        {/* <Modal visible> */}
      
        {/* </Modal> */}
        <Image source={require('../Images/logoFml.png')}
          style={{ alignSelf: 'center', height: 110, width: 110,marginVertical: 60, borderWidth:1, borderRadius:55, borderColor:'white' }}
        />
        <GestureRecognizer
          style={{ flex: 1 }}
          // onSwipeUp={() => setUploadPhotoModal(true)}
          onSwipeDown={() => setLocationModal(false)}
        >
          <Modal
            transparent
            visible={locationModal}
            onRequestClose={() => { setLocationModal(false); }}

          >
            <View style={{ width: '100%', height: '100%' }}>
              <MapView
                style={{ width: '100%', height: '100%' }}
                initialRegion={{
                  latitude: 51.50746, // 33.51995346211034, 73.08200449215008// 51.50746, -0.1277,
                  longitude: -0.1277,
                  latitudeDelta: 0.9,//0.0922,
                  longitudeDelta: 0.9,//0.0421,
                }}
                onRegionChange={x => {
                  // console.log(x);
                }}
                onPress={e => setMarkerPosition(e.nativeEvent.coordinate)}
              >
                {/* <Marker coordinate={{ latitude: 51.50746, longitude: -0.1277 }} */}
                {markerPostion !== undefined ? <Marker coordinate={markerPostion} /> : null}
              </MapView>

              <TouchableOpacity onPress={() => getCurrentLocation()}
                style={{
                  width: '80%', height: 60, alignSelf: 'center', position: 'absolute'
                  , backgroundColor: 'lightblue', bottom: 20, justifyContent: 'center', alignItems: 'center'
                }}>
                <Text style={{ fontSize: 20, color: 'black' }}>Get Current Location</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </GestureRecognizer>
        {/* <View style={styles.mainContainer}> */}
          <View style={styles.container}>
            <StatusBar hidden={true} />
            <View style={{width:'100%', height:'80%', borderRadius:20, backgroundColor:'#202A44', marginBottom:180}} >
              {
                !emailState && nameState?
                <View style={[styles.mainContainer,{height:'90%', width:'100%',marginVertical:30}]}>
                  <Text style={{color:'white', fontSize:20, margin:10}}>What's your name?</Text>
                  <Text style={{color:'yellow', fontSize:16, margin:10}}>Type your name in box below</Text>
              <TextInput style={[styles.inputBox,{margin:10}]} placeholder='Enter Your Name' placeholderTextColor='white'
                value={name}
                onChangeText={(value) => setName(value)}
              />
              <TouchableOpacity style={[styles.addButton,{width:200,alignSelf:'center'}]} onPress={() => EmailScreenFtn()}
              >
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: '500' }}>Continue</Text>
              </TouchableOpacity>
              </View>
              :
              null
              }

              {
                emailState && !nameState
                ?
                <View style={[styles.mainContainer,{height:'90%', width:'90%',marginVertical:30}]}>
                   <Text style={{color:'white', fontSize:20, margin:10}}>What's your email {name}?</Text>
                  <Text style={{color:'yellow', fontSize:16, margin:10}}>Type your valid Email. This is to verify your account.</Text>
              <TextInput style={[styles.inputBox,{margin:10}]} placeholder='Enter Your Email' placeholderTextColor='white'
                value={email}
                onChangeText={(value) => setEmail(value)}
              />
              <TouchableOpacity style={[styles.addButton,{width:200,alignSelf:'center'}]} onPress={() => PasswordScreenFtn(email)}
              >
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: '500' }}>Continue</Text>
              </TouchableOpacity>
              </View>
              :
               null
              }
              {
                !emailState && passwordState
                ?
                <View style={[styles.mainContainer,{height:'90%', width:'90%',marginVertical:30}]}>
                  <Text style={{color:'white', fontSize:22, margin:10}}>                You're almost there?</Text>
                  <Text style={{color:'yellow', fontSize:16, margin:10}}>Please write unique and easy 8 digit password</Text>
                <TextInput style={[styles.inputBox,{margin:10}]} placeholder='Enter Your Password' placeholderTextColor='white'
                value={password}
                onChangeText={(value) => setPassword(value)}
                secureTextEntry={true}

              />
              <TouchableOpacity style={[styles.addButton,{width:200,alignSelf:'center'}]} onPress={() => DobScreenFtn()}
              >
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: '500' }}>Continue</Text>
              </TouchableOpacity>
              </View>
              :
              null
              }
              {
                dobState 
                ?
                <View style={[styles.mainContainer,{height:'90%', width:'90%',marginVertical:30}]}>
                  <Text style={{color:'white', fontSize:22, margin:10}}>Hey, {name}! When's your birthday?</Text>
                  <Text style={{color:'yellow', fontSize:16, margin:10}}>You must be 18 or above!</Text>
              <TouchableOpacity onPress={() => showDatePicker()} style={[styles.inputBox,{margin:10}]}>
                {/* <TextInput style={styles.inputBox} placeholder='Enter Your Age'
          value={age}
          onChangeText={(value) => setAge(value)}
        /> */}
                {
                  
                  dob === null ? <Text style={{ color: 'white' }}>Select your Date of Birth</Text> : <Text style={{ color: 'white' }}>{dob}</Text>
                  
                }

              </TouchableOpacity>
              <TouchableOpacity style={[styles.addButton,{width:200,alignSelf:'center'}]} onPress={() => GenderScreenFtn()}
              >
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: '500' }}>Continue</Text>
              </TouchableOpacity>
              </View>
              :
              null
              }
              {/* Set Date of birth wiht modal
        user can select its date of birth here
        
        */}
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
                      maximumDate={new Date('2006-06-15')}
                      style={{ height: 400, width: 300 }}

                    />
                  </View>
                  : null
              }

              {/* Set Gender wiht modal
        user can select its gender of birth here
        
        */}
              <Modal
                animationType='slide'
                transparent={true}
                visible={genderModal}
              >
                <View style={styles.modal}>


                  <View style={[styles.modalView,{height:'80%', marginTop:90}]}>
                    <View>


                      <TouchableOpacity onPress={() => setGenderModalFtn('Male')} >
                        <View style={styles.radioButton}>
                          <View style={styles.circle}>
                            {gender === 'Male' ?
                              <View style={styles.circleInside}>

                              </View> :
                              <View></View>
                            }

                          </View>
                          <Text style={{ color: 'black', fontSize: 25, marginLeft: 10, fontWeight: '600' }}>Male</Text>
                        </View>
                      </TouchableOpacity>


                      <TouchableOpacity onPress={() => setGenderModalFtn('Female')}>
                        <View style={styles.radioButton}>
                          <View style={styles.circle}>
                            {gender === 'Female' ?
                              <View style={styles.circleInside}>

                              </View> :
                              <View></View>
                            }
                          </View>
                          <Text style={{ color: 'black', fontSize: 25, marginLeft: 20, fontWeight: '600' }}>Female</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setGenderModalFtn('nonbinary')}>
                        <View style={styles.radioButton}>
                          <View style={styles.circle}>
                            {gender === 'nonbinary' ?
                              <View style={styles.circleInside}>

                              </View> :
                              <View></View>
                            }
                          </View>
                          <Text style={{ color: 'black', fontSize: 25, marginLeft: 20, fontWeight: '600' }}>nonbinary</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => setGenderModalFtn('Transgender')}>
                        <View style={styles.radioButton}>
                          <View style={styles.circle}>
                            {gender === 'Transgender' ?
                              <View style={styles.circleInside}>

                              </View> :
                              <View></View>
                            }
                          </View>
                          <Text style={{ color: 'black', fontSize: 25, marginLeft: 20, fontWeight: '600' }}>Transgender</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => setGenderModalFtn('Bisexual')}>
                        <View style={styles.radioButton}>
                          <View style={styles.circle}>
                            {gender === 'Bisexual' ?
                              <View style={styles.circleInside}>

                              </View> :
                              <View></View>
                            }
                          </View>
                          <Text style={{ color: 'black', fontSize: 25, marginLeft: 20, fontWeight: '600' }}>Bisexual</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => setGenderModalFtn('Lesbian')}>
                        <View style={styles.radioButton}>
                          <View style={styles.circle}>
                            {gender === 'Lesbian' ?
                              <View style={styles.circleInside}>

                              </View> :
                              <View></View>
                            }
                          </View>
                          <Text style={{ color: 'black', fontSize: 25, marginLeft: 20, fontWeight: '600' }}>Lesbian</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => setGenderModalFtn('Gay')}>
                        <View style={styles.radioButton}>
                          <View style={styles.circle}>
                            {gender === 'Gay' ?
                              <View style={styles.circleInside}>

                              </View> :
                              <View></View>
                            }
                          </View>
                          <Text style={{ color: 'black', fontSize: 25, marginLeft: 20, fontWeight: '600' }}>Gay</Text>
                        </View>
                      </TouchableOpacity>


                      <TouchableOpacity onPress={() => setGenderModalFtn('Other')}>
                        <View style={styles.radioButton}>
                          <View style={styles.circle}>
                            {gender === 'Other' ?
                              <View style={styles.circleInside}>

                              </View> :
                              <View></View>
                            }
                          </View>
                          <Text style={{ color: 'black', fontSize: 25, marginLeft: 20, fontWeight: '600' }}>Other</Text>
                        </View>
                      </TouchableOpacity>


                    </View>
                    <TouchableOpacity onPress={() => HideGenderModalFtn()}>
                      <View style={{ backgroundColor: "blue", borderRadius: 10, width: 100, height: 30, alignSelf: 'center', margin: 20 }}>
                        <Text style={{ fontSize: 20, color: 'white', alignSelf: 'center' }}>OK</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {
                genderState?
                <View style={[styles.mainContainer,{height:'90%', width:'100%',marginVertical:30}]}>
                 <Text style={{color:'white', fontSize:22, margin:10}}>      Please Tell Us About Your Gender</Text>
                  <Text style={{color:'yellow', fontSize:16, margin:10}}>We are happy to have you here</Text>

              <TouchableOpacity onPress={() => HideGenderModalFtn()} style={[styles.inputBox,{margin:10}]}>
                {/* <TextInput style={styles.inputBox} placeholder='Enter Your Age'
          value={age}
          onChangeText={(value) => setAge(value)}
        /> */}
                {gender == null ? <Text style={{ color: 'white' }}>Select your Gender</Text> : <Text style={{ color: 'white' }}>{gender}</Text>}

              </TouchableOpacity>
              <TouchableOpacity style={[styles.addButton,{width:200,alignSelf:'center'}]} onPress={() => InterestScreenFtn()}
              >
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: '500' }}>Continue</Text>
              </TouchableOpacity>
              </View>:
              null
              }
              {/* Set Education wiht modal
        user can select its qualification here
        
        */}
              <Modal
                animationType='slide'
                transparent={true}
                visible={educationModal}
              >
                <View style={styles.modal}>


                  <View style={styles.modalView}>
                    <View>


                      <TouchableOpacity onPress={() => setEducationModalFtn('High School')} >
                        <View style={styles.radioButton}>
                          <View style={styles.circle}>
                            {education === 'High School' ?
                              <View style={styles.circleInside}>

                              </View> :
                              <View></View>
                            }

                          </View>
                          <Text style={{ color: 'black', fontSize: 25, marginLeft: 10, fontWeight: '600' }}>High School</Text>
                        </View>
                      </TouchableOpacity>


                      <TouchableOpacity onPress={() => setEducationModalFtn('College')}>
                        <View style={styles.radioButton}>
                          <View style={styles.circle}>
                            {education === 'College' ?
                              <View style={styles.circleInside}>

                              </View> :
                              <View></View>
                            }
                          </View>
                          <Text style={{ color: 'black', fontSize: 25, marginLeft: 20, fontWeight: '600' }}>College</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setEducationModalFtn('Graduate')}>
                        <View style={styles.radioButton}>
                          <View style={styles.circle}>
                            {education === 'Graduate' ?
                              <View style={styles.circleInside}>

                              </View> :
                              <View></View>
                            }
                          </View>
                          <Text style={{ color: 'black', fontSize: 25, marginLeft: 20, fontWeight: '600' }}>Graduate</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setEducationModalFtn('Post Graduate')}>
                        <View style={styles.radioButton}>
                          <View style={styles.circle}>
                            {education === 'Post Graduate' ?
                              <View style={styles.circleInside}>

                              </View> :
                              <View></View>
                            }
                          </View>
                          <Text style={{ color: 'black', fontSize: 25, marginLeft: 20, fontWeight: '600' }}>Post Graduate</Text>
                        </View>
                      </TouchableOpacity>


                    </View>
                    <TouchableOpacity onPress={() => HideEducationModalFtn()}>
                      <View style={{ backgroundColor: "blue", borderRadius: 10, width: 100, height: 30, alignSelf: 'center', margin: 20 }}>
                        <Text style={{ fontSize: 20, color: 'white', alignSelf: 'center' }}>OK</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/* <TouchableOpacity onPress={() => HideEducationModalFtn()} style={styles.inputBox}>
             
                {education == null ? <Text style={{ color: 'white' }}>Your Education</Text> : <Text style={{ color: 'white' }}>{education}</Text>}

              </TouchableOpacity> */}
              {
                /// Select Your RelationShip status
              }
              <Modal
                animationType='slide'
                transparent={true}
                visible={relationShipModal}
              >
                <View style={styles.modal}>


                  <View style={[styles.modalView]}>
                    <View>


                      <TouchableOpacity onPress={() => setRelationShipModalFtn('Single')} >
                        <View style={styles.radioButton}>
                          <View style={styles.circle}>
                            {relationShip === 'Single' ?
                              <View style={styles.circleInside}>

                              </View> :
                              <View></View>
                            }

                          </View>
                          <Text style={{ color: 'black', fontSize: 25, marginLeft: 10, fontWeight: '600' }}>Single</Text>
                        </View>
                      </TouchableOpacity>


                      <TouchableOpacity onPress={() => setRelationShipModalFtn('Married')}>
                        <View style={styles.radioButton}>
                          <View style={styles.circle}>
                            {relationShip === 'Married' ?
                              <View style={styles.circleInside}>

                              </View> :
                              <View></View>
                            }
                          </View>
                          <Text style={{ color: 'black', fontSize: 25, marginLeft: 20, fontWeight: '600' }}>Married</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setRelationShipModalFtn('Divorced')}>
                        <View style={styles.radioButton}>
                          <View style={styles.circle}>
                            {relationShip === 'Divorced' ?
                              <View style={styles.circleInside}>

                              </View> :
                              <View></View>
                            }
                          </View>
                          <Text style={{ color: 'black', fontSize: 25, marginLeft: 20, fontWeight: '600' }}>Divorced</Text>
                        </View>
                      </TouchableOpacity>


                    </View>
                    <TouchableOpacity onPress={() => HideRelationShipModalFtn()}>
                      <View style={{ backgroundColor: "blue", borderRadius: 10, width: 100, height: 30, alignSelf: 'center', margin: 20 }}>
                        <Text style={{ fontSize: 20, color: 'white', alignSelf: 'center' }}>OK</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              {/* <TouchableOpacity style={styles.inputBox}
                onPress={() => HideRelationShipModalFtn()}
              >
                {
                  relationShip ? <Text style={{ color: 'white' }}>{relationShip}</Text>
                    : <Text style={{ color: 'white' }}>Select Relationship Status
                    </Text>
                }
              </TouchableOpacity> */}
              {/* 
              interests section
               */}
          {
            interestState 
            ?
            <View style={[styles.mainContainer,{height:'90%', width:'90%',marginVertical:30}]}>
            <Text style={{color:'white', fontSize:22, margin:10}}>Please Tell Us About Your Interest!</Text>
                  <Text style={{color:'yellow', fontSize:16, margin:10}}>Choose your area of you would most like to elevate.</Text> 
            {/* <Text
              style={{ fontSize: 15, fontWeight: '500', color: 'white' }}>Choose your area of you would most like to elevate</Text> */}
            <TouchableOpacity onPress={() => {setInterestModal(true)}} style={[styles.inputBox,{margin:10}]}>
              <Text style={{ color: 'white' }}>{selectedInterest == '' ? 'Select Your Interests' : selectedInterest}  </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.addButton,{width:200,alignSelf:'center'}]} onPress={() => PhotoScreenFtn()}
            >
              <Text style={{ color: '#fff', fontSize: 22, fontWeight: '500' }}>Continue</Text>
            </TouchableOpacity>
        </View>
        :
        null
        }

              {/* <TouchableOpacity onPress={() => showInterestModal()} style={styles.inputBox}>

                {selectedInterest == null ? <Text style={{ color: 'white' }}>Select your Interest</Text> :
                  <Text style={{ color: 'white' }}>{selectedInterest}</Text>}

              </TouchableOpacity> */}
              {/* Get User Current Location */}
            {  
            photoState 
            ?
            <View style={[styles.mainContainer,{height:'90%', width:'90%',marginVertical:30}]}>
            <Text style={{color:'white', fontSize:22, margin:10}}>Time To Upload Photo!</Text>
            <Text style={{color:'yellow', fontSize:16, margin:10}}>Please Upload Your Photo With Clear Face.</Text> 
            <View style={{ height: '65%', width: '95%', alignSelf: 'center'
            // , marginTop:50
             }}>
            <View >

              <View >

                <View style={{ width: '100%', justifyContent:'center', alignItems:'center'}}>
                  {
                    imageData && imageState == false ?
                    <TouchableOpacity onPress={()=>openGallery()}>
                      <Image source={{ uri: imageData.assets[0].uri }}
                        style={{ width: 180, height: 180, borderRadius: 10, borderWidth: 1, borderColor: 'black', alignSelf: 'center', marginLeft: 20, marginTop: 10 }} />
                      </TouchableOpacity>
                      :
                      <TouchableOpacity onPress={()=>openGallery()}>
                      <View style={{flex:1}}>
                <Image source={require('../Images/gallery.png')}
                  style={{ width: 180, height: 180, marginLeft: 20, borderRadius: 5, tintColor:'white', borderWidth:0.3, borderColor:'green' }}
                />
                <View style={{position:'absolute', alignSelf:'center'}}>
                 <Image source={require('../Images/plus.png')}
                  style={{ width: 50, height: 50, marginLeft: 95, marginTop:80,borderRadius: 5, tintColor:'blue', borderWidth:1, borderColor:'white' }}
                />
                      </View>
                      </View>
                  </TouchableOpacity>
                      
                  }
                  
                </View>     
                
              </View>
            </View>
          </View>
          <TouchableOpacity style={[styles.addButton,{width:200,alignSelf:'center'}]} onPress={() => LocationScreenFtn()}
              >
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: '500' }}>Upload Photo</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={[styles.addButton,{width:200,alignSelf:'center'}]} onPress={() => DobScreenFtn()}
              >
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: '500' }}>Continue</Text>
              </TouchableOpacity> */}
              </View>
              :
              null
              }

             {  
            locationState 
            ?
            <View style={[styles.mainContainer,{height:'90%', width:'90%',marginVertical:30}]}>
            <Text style={{color:'white', fontSize:22, margin:10}}>Share Location To Find People Near You!</Text>
            <Text style={{color:'yellow', fontSize:16, margin:10}}>Please Give Location Access To Sign Up</Text> 
              <TouchableOpacity onPress={() => GetLocationOfUser()} style={styles.inputBox}>
                {/* <TextInput style={styles.inputBox} placeholder='Enter Your Location' placeholderTextColor='white'
               editable={false}
               value={location}
                onChangeText={(value) => setLocation(value)}
              /> */}
                {
                  marker ? <Text style={{ color: 'white' }}>{locationAccessStatus}</Text>
                    : <Text style={{ color: 'white' }}>Select your Location</Text>
                }
              </TouchableOpacity>
              <TouchableOpacity style={[styles.addButton,{width:200,alignSelf:'center'}]} onPress={() => FinalScreenFtn()}
              >
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: '500' }}>Continue</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={[styles.addButton,{width:200,alignSelf:'center'}]} onPress={() => DobScreenFtn()}
              >
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: '500' }}>Continue</Text>
              </TouchableOpacity> */}
              </View>
              :
              null
              }

              {/* <View style={{padding:30, height:60, width:'100%'}}> */}
              {/* <DropDownPicker
              placeholder='chose your interest'
               items={items}
               open={isOpen}
               setOpen={()=>setIsOpen(!isOpen)}
               value={currentValue}
               setValue={(val)=>setCurrentValue(val)}
              /> */}
              {/* </View> */}



              {
                finalState 
                // !emailState && nameState
                ?
                <View style={[styles.mainContainer,{height:'90%', width:'90%',marginVertical:30}]}>
                  
           {/* <Text style={{color:'white', fontSize:16, margin:10}}>          Let's Get Started!</Text> */}
            {/* <Text style={{color:'yellow', fontSize:20, margin:10, marginVertical:20}}>      Your Lifestyle Starts With You</Text>  */}
            <Text style={{fontSize:18, fontWeight:'700',margin:10, marginVertical:20, color:'lightgreen'}}>          Your Lifestyle Starts With You</Text> 
                <TouchableOpacity style={[styles.addButton,{alignSelf:'center', width:'100%', marginLeft:20, borderWidth:3, borderColor:'red'}]} 
                onPress={() => [HandleRegisterUser(), setLoading(false)]}//createUser()
                >
                {/* createUser() */}
                {/* <View style={{flexDirection:'row', justifyContent: 'space-evenly'}}> */}
                  {/* <Text style={{fontSize:22}}>
                    *
                  </Text> */}
                  {/* <Text style={{fontSize:20}}>
                    *                                                      * 
                  </Text> */}
                {/* </View> */}
                
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '500', }}>Enhance My LifeStyle!</Text>
                {/* <Text style={{fontSize:20}}>
                    *                                                      * 
                  </Text> */}
              </TouchableOpacity>
              </View>
              :
              null
              }
                              {/* <View style={[styles.mainContainer,{height:'90%', width:'90%',marginVertical:30}]}> */}

              <TouchableOpacity onPress={() => navigation.dispatch(StackActions.replace('LoginScreen'))} style={{marginTop:60}}>
                <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center', marginBottom: 200, marginTop: 20 }}>
                  Already have an account? Log In Here</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 15, color: 'red' }}>{message}</Text>
              {/* </View> */}

            </View>

          </View>
        {/* </View> */}
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
    // </KeyboardAwareScrollView>
  )
}
const { height, width } = Dimensions.get('screen');
const styles = StyleSheet.create({
  mainContainer: {
    // flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#202A44',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    // marginTop: 70,
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
    borderRadius: 12,
    borderColor: 'black',
    borderWidth: 1
  },
  circleInside: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: 'orange',
    alignSelf: 'center',
    marginTop: 1.4,
  },
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
    shadowColor: '#000',
    width: 300,
    height: 300,
    marginBottom: 180,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  table: {
    color: 'blue',
    fontSize: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    // flex: 1,
    alignItems: 'center',
    marginTop: 40,
    height: '60%',
    width: '100%',

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
  headingStyle: {
    marginLeft: 20,
    fontSize: 20,
    color: 'black',
    fontWeight: '700'
  },
  addButton: {
    backgroundColor: '#00A36C',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10
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
  backgroundVideo: {
    flex:1,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: '100%',
    width: '100%',
  }
});
export default SignUpScreen;


{/* <Modal visible={interestModal}
onRequestClose={() => {setInterestModal(false), console.log('final value = '+selected.toString())}}
>
<MultipleSelectList
  setSelected={(val) => selectedInterests(val)}
  onSelect={()=>console.log(selected)}
  data={interestArr}
  save="value"
  boxStyles={{ borderColor: 'black' }}
  // onSelect={() => Alert.alert(selected)} 
  label="Interests"
  fontFamily='regular'
  inputStyles={{ color: 'black' }}
  search={false}
  searchPlaceholder='Find'
  placeholder='Select Your Interests'
  dropdownTextStyles={{ color: 'black' }}
  notFoundText='No Match Found'
  labelStyles={{ fontWeight: '800', color: 'green' }}
  badgeStyles={{ backgroundColor: 'black' }}
  badgeTextStyles={{ borderColor: 'white' }}
  checkBoxStyles={{}}
  disabledCheckBoxStyles={{ backgroundColor: 'black' }}
  disabledItemStyles={{ backgroundColor: 'orange' }}
  disabledTextStyles={{ color: 'black', fontWeight: '900' }}
/>
</Modal> */}
