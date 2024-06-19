import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, TextInput, Dimensions, ScrollView, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, UPDATE_EVENT, UPDATE_USER } from '../Utils/Strings';
import { useNavigation, useRoute } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";


const EditEvent = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [coverPhoto, setCoverPhoto] = useState(route.params.data.imageUrl == '' ? '' : route.params.data.imageUrl);
  const [profilePhoto, setProfilePhoto] = useState(route.params.data.profilePic == '' ? '' : route.params.data.profilePic);
  const [imgDownloadUrl, setImgDownloadUrl] = useState("");

  const [imageData, setImageData] = useState();
  const [coverPhotoChanged, setCoverphotoChanged] = useState(false);
  const [profilePhotoChanged, setProfilePhotoChanged] = useState(false);

  // const [name, setName] = useState(route.params.data.name == '' ? '' : route.params.data.name);
  // const [about, setAbout] = useState(route.params.data.about == '' ? '' : route.params.data.about);

  const [eventDate, setEventDate] = useState(route.params.data.eventData);
  const [eventTime, setEventTime] = useState(route.params.data.eventTime);
  const [eventLocation, setEventLocation] = useState('');
  const [eventMembers, setEventMembers] = useState(route.params.data.members.toString());

  const [eventDescription, setEventDescription] = useState(route.params.data.eventDescription
    );
  const [eventName, setEventName] = useState(route.params.data.eventName);
  const [caption, setCaption] = useState(route.params.data.caption);
  const [Loading, setLoading] = useState(false)
  const [uploadPhotoModal, setUploadPhotoModal] = useState(false);
  const [imageState, setImagestate] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const[myFcmToken, setMyFcmToken] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);


  const [locationModal, setLocationModal] = useState(false);
  const [markerPostion, setMarkerPosition] = useState();


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


  const [myId, setMyId] = useState('');

  console.log('My cover photo ', coverPhoto)
  let getResult;

  useEffect(() => {
    myIdFtn()
  }, [])


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
  const openGallery = async (type) => {
    //later
    let result;

    try {
      result = await launchImageLibrary({ mediaType: 'photo' });
      //  if(result==null){

      getResult = result;

      console.log('Image has been selected :: ' + getResult.assets[0].uri)

      //  }
      //  if(imageData !== null){
      if (type == 'cover') {
        setCoverPhoto(getResult.assets[0].uri)
        setCoverphotoChanged(true);
        setProfilePhotoChanged(false);
        setImageData(getResult.assets[0].uri)
      }
      if (type == 'profile') {
        setProfilePhoto(getResult.assets[0].uri)
        setCoverphotoChanged(false);
        setProfilePhotoChanged(true);
        setCoverphotoChanged(false);
        setImageData(getResult.assets[0].uri)

      }
       

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
  const myIdFtn = async () => {

    try {
      let idValue = await AsyncStorage.getItem('USER_DATA_ID')
      console.log('data from async here in login ', idValue)
      setMyId(idValue)

    } catch (error) {
      console.log('error', error)
    }

  }
  const uploadImageToStorage=async()=>{
         const response = storage().ref(`/profile/${imageData.assets[0].fileName}`);
        const put = await response.putFile(imageData.assets[0].uri);
        console.log(response);
        // setFullImaeRefPath(put.metadata.fullPath);
        const url = await response.getDownloadURL();
        console.log(url);
        setImgDownloadUrl(url);
  }
  const UpdateCoverPhoto = () => {
    uploadImageToStorage()
    const userCoverPhoto = {
      coverPic: imgDownloadUrl
    }
    axios.put(BASE_URL + UPDATE_USER + myId, userCoverPhoto)
      .then((res) => {
        Alert.alert("You have successfully Changed your Photo")
        setCoverphotoChanged(false);
        setCoverPhoto(null);
        // setImageData(null);
        navigation.goBack();
        console.log(res);
      })
      .catch((error) => {
        console.log('Event Post Failed ', error)
      })
  }
  const UpdateProfilePhoto = () => {
    uploadImageToStorage()
    const userProfilePhoto = {
      profilePic: imgDownloadUrl
    }
    axios.put(BASE_URL + UPDATE_USER + myId, userProfilePhoto)
      .then((res) => {
        Alert.alert("You have successfully Changed your Photo")
        setProfilePhotoChanged(false);
        setProfilePhoto(null);
        // setImageData(null);
        navigation.goBack();
        console.log(res);
      })
      .catch((error) => {
        console.log('Event Post Failed ', error)
      })
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
    console.log('Time Picked For Event ', x);
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

  const updateDetails = () => {
    const userDetails = {
      eventName: eventName,
    }
    axios.put(BASE_URL + UPDATE_EVENT + route.params.data._id, userDetails)
      .then((res) => {
        Alert.alert("You have successfully Updated Your Event Details")
        setProfilePhotoChanged(false);
        setProfilePhoto(null);
        // setImageData(null);
        navigation.goBack();
        console.log(res);
      })
      .catch((error) => {
        console.log('Event Post Failed ', error)
      })
  }
//   const uploadPhotoShowModal = () => {
//     setImagestate(false);
//     setUploadPhotoModal(true);
//     setImageData();
//   }
//   const uploadPhotoModalHideCancel = () => {
//     setUploadPhotoModal(!uploadPhotoModal);
//     setImagestate(true);
//     setImageData(undefined);
//     setCaption('');
//     // if(imageData === imageData.assets[0].fileName){
//     //   imageData=='';
//     // }

//   }
//   const uploadPhotoModalHideConfirm = () => {
//     setImageData(undefined);
//     setUploadPhotoModal(!uploadPhotoModal);
//     // if(imageData === ''){
//     //   imageData===imageData.assets[0].fileName;
//     // }
//     // if(imageData!== ''){
//     //   setImagestate(false);
//     //   setImageData(imageData.assets[0].fileName);
//     // }
//   }
//   const openCamera = async () => {
//  //later
//     try {
//       const result = await launchCamera({ mediaType: 'photo' });
//       getResult = result;
//       console.log('Image has been selected :: ' + getResult.assets[0].uri)

//       //  }
//       //  if(imageData !== null){
//       setImageData(getResult)
//       // console.warn('Image :'+ imageData!==null?imageData.assets[0].uri:null);
//     } catch (error) {
//       console.log(error.message)
//     }


//   }
//   const openGallery = async () => {
//     //later
//     let result;

//     try {
//       result = await launchImageLibrary({ mediaType: 'photo' });
//       //  if(result==null){

//       getResult = result;
//       console.log('Image has been selected :: ' + getResult.assets[0].uri)

//       //  }
//       //  if(imageData !== null){
//       setImageData(getResult)
//       //  }
//     }

//     catch (error) {
//       console.log(error.message)
//     }

//     // if (imageData == null) {
//     // }else{
//     //   console.log("Image data null")
//     // }
//     // console.log(result.assets[0].uri);
//   }
  //create event api
 const PostEventFunction= async()=>{
    setLoading(true)
    const response = storage().ref(`/profile/${imageData.assets[0].fileName}`);
    const put = await response.putFile(imageData.assets[0].uri);
    console.log(response);
    // setFullImaeRefPath(put.metadata.fullPath);
    const url = await response.getDownloadURL();
    console.log('Uploaded Image Url ',url);
    setImgDownloadUrl(url);
  
    // longitude: '-0.15940368175506592',
    // latitude: '51.51051699012749',
    const postEventData = {
        eventName:eventName,
        username:myUserData.name,
        userId:myUserData._id,
        userImage:myUserData.profilePic,
        caption: caption,
        interest: selectedInterest,
        eventDate:eventDate,
        eventTime:eventTime,
        longitude: markerPostion.longitude, //"-0.159403"
        latitude: markerPostion.latitude,//"51.510516"
        members: eventMembers,
        eventDescription:eventDescription,
        profilePic: myUserData.profilePic,
        userCoverPic: myUserData.coverPic,
        imageUrl:imgDownloadUrl,
        // imageUrl:'https://firebasestorage.googleapis.com/v0/b/fir-login-f23d7.appspot.com/o/profile%2Frn_image_picker_lib_temp_70cbfcc4-4aa8-49dc-8675-043fbca9d252.jpg?alt=media&token=4aaad895-3951-4a3a-8239-f0d2697aac07'     
      }
      // if(imgDownloadUrl != '')
      // {
        axios.post(BASE_URL+POST_EVENT,postEventData)
        .then((res)=>{
          Alert.alert("You have successfully Posted your Event")
          console.log(res);
          setLoading(false)
          setEventName('')
          setEventDate('')
          setEventDescription('')
          setEventMembers('')
          setEventTime(undefined)
          setMarkerPosition(undefined)
          setImageData(undefined)
          setImgDownloadUrl('')
          setSelectedInterest(null)
        })
        .catch((error)=>{
          console.log('Event Post Failed ', error)
          Alert.alert("Event Post Failed Due To Some Reasons")

          setLoading(false)
        })
      // }
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
    <ScrollView>
    <View style={styles.container}> 
    <Text style={{ color: 'white', fontSize: 22, fontWeight: '500' }}>Edit Your Event Image</Text>

      <TouchableOpacity
        style={styles.coverBtn}
        onPress={() => [openGallery('cover')]}
      >
        {
          coverPhoto != ''
            ?
            <Image source={{ uri: coverPhoto }} //source={require('../Images/gallery.png')} 
              style={styles.coverImageStyle} />
            :
            <Image source={require('../Images/gallery.png')}
              style={styles.galleryImg} />

        }

        <Image source={require('../Images/edit.png')} style={styles.editImg} />
        {
          !coverPhotoChanged
            ?
            null
            :
            <TouchableOpacity style={styles.updloadCoverBtn} onPress={() => UpdateCoverPhoto()}>
              <Text style={{ fontWeight: '600', fontSize: 20, color: 'black' }}>Upload</Text>
            </TouchableOpacity>
        }

      </TouchableOpacity>

      

      {/* <View style={{ marginVertical: 20 }}>
        <Text style={{ color: 'white', fontSize: 22, fontWeight: '500' }}>Edit Your Personal Details</Text>
        <TextInput style={[styles.inputBox, { margin: 10 }]} placeholder='Enter Your Name' placeholderTextColor='white'
          value={name}
          maxLength={30}
          onChangeText={(value) => setName(value)}
        />
        <TextInput style={[styles.inputBox, { margin: 10 }]} placeholder='Write Something About Yourself' placeholderTextColor='white'
        value={about}
        onChangeText={(value) => setAbout(value)}
        />

        <TouchableOpacity style={styles.updateBtn} onPress={() => updateDetails()}
        >
          <Text style={{ fontWeight: '600', fontSize: 20, color: 'white' }}>Save Changes</Text>
        </TouchableOpacity>


      </View> */}
    </View>


<View style={{backgroundColor:'black'}}>
<Text style={{ color: 'white', fontSize: 22, margin:15,fontWeight: '500' }}>Edit Your Event Details</Text>

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
                   
                    <Text
                      style={[styles.headingStyle, { justifyContent: 'center', margin: 5, fontWeight: '600', color: 'white' }]}>
                      Members</Text>
                    <TextInput placeholder='Members Allowed' placeholderTextColor='white'
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
                      style={[styles.UploadButton, { width: 300, borderRadius: 10, backgroundColor:'red', 
                      marginBottom: 20, alignSelf: 'center', marginRight: 40 }]}

                      onPress={() => updateDetails()}
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
                        Update Details
                      </Text>
                    </TouchableOpacity>
                  </View>
</View>
    



    </ScrollView>
  )
}
const { height, width } = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  coverBtn: {
    width: '90%',
    height: 400,
    backgroundColor: 'blue',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  galleryImg: {
    width: 50, height: 50, tintColor: 'white',
  },
  editImg: {
    width: 30,
    height: 30,
    tintColor: 'white',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  updloadCoverBtn: {
    width: 90,
    height: 30,
    borderRadius: 10,
    borderWidth: 1, justifyContent: 'center', alignItems: 'center',
    borderColor: 'orange',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  coverImageStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10
  },
  profileView: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'blue',
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 20,

  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  profileImageEdit: {
    width: 40,
    height: 40,
    borderRadius: 10,
    //borderWidth:1, justifyContent:'center', alignItems:'center',
    //borderColor:'black',
    tintColor: 'white',
    position: 'absolute',
    bottom: 0,
    right: 0,
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
  updateBtn:{
    width: 180,
    height: 40,
    borderRadius: 10,
    borderWidth: 1, justifyContent: 'center', alignItems: 'center',
    borderColor: 'yellow',
    backgroundColor: 'blue',
    alignSelf:'center',
    marginVertical:20

  },
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
})
export default EditEvent