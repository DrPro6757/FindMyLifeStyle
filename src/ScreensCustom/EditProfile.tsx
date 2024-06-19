import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, TextInput, Dimensions, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, UPDATE_USER } from '../Utils/Strings';
import { useNavigation, useRoute } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';


const EditProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [coverPhoto, setCoverPhoto] = useState(route.params.data.coverPic == '' ? '' : route.params.data.coverPic);
  const [profilePhoto, setProfilePhoto] = useState(route.params.data.profilePic == '' ? '' : route.params.data.profilePic);
  const [imgDownloadUrl, setImgDownloadUrl] = useState("");

  const [imageData, setImageData] = useState();
  const [coverPhotoChanged, setCoverphotoChanged] = useState(false);
  const [profilePhotoChanged, setProfilePhotoChanged] = useState(false);

  const [name, setName] = useState(route.params.data.name == '' ? '' : route.params.data.name);
  const [about, setAbout] = useState(route.params.data.about == '' ? '' : route.params.data.about);



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

  const updateDetails = () => {
    const userDetails = {
      name: name,
      about: about
    }
    axios.put(BASE_URL + UPDATE_USER + myId, userDetails)
      .then((res) => {
        Alert.alert("You have successfully Updated Your Profile")
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


  return (
    <View style={styles.container}>
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

      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={styles.profileView}
          onPress={() => [openGallery('profile')]}>
          {
            profilePhoto != ''
              ?
              <Image source={{ uri: profilePhoto }} //source={require('../Images/gallery.png')} 
                style={styles.profileImage} />
              :
              <Image source={require('../Images/camera.png')}
                style={styles.galleryImg} />

          }
          <Image source={require('../Images/edit.png')} style={styles.profileImageEdit} />
        </TouchableOpacity>
        {
          !profilePhoto
            ?
            null
            :
            <TouchableOpacity style={[styles.updloadCoverBtn, { right: 120 }]} onPress={() => UpdateProfilePhoto()}>
              <Text style={{ fontWeight: '600', fontSize: 20, color: 'black' }}>Upload</Text>
            </TouchableOpacity>
        }
      </View>

      <View style={{ marginVertical: 20 }}>
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


      </View>

    </View>
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
    height: 140,
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

  }
})
export default EditProfile