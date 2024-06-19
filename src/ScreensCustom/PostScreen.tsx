import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput, Dimensions, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import UsersPost from './UsersPost';
import axios from 'axios';
import { BASE_URL, CREATE_POST_REEL, CREATE_USER_POST } from '../Utils/Strings';
import storage from '@react-native-firebase/storage';
import Carousel from 'react-native-reanimated-carousel';
import AddPostCustom from './AddPostCustom';
import {RNCamera} from 'react-native-camera'
import Video from 'react-native-video';
import Loader from '../screens/Loader';

// import { Camera } from 'expo-camera';
// import { Audio } from 'expo-av'
// import * as ImagePicker from 'expo-image-picker'
// import * as MediaLibrary from 'expo-media-library'

const PostScreen = () => {
  const isFocused = useIsFocused()

  const camera = useRef(null)
  // const [hasCameraPermissions, setHasCameraPermissions] = useState(false)
  // const [hasAudioPermissions, setHasAudioPermissions] = useState(false)
  // const [hasGalleryPermissions, setHasGalleryPermissions] = useState(false)
  // const [galleryItems, setGalleryItems] = useState([])

  // Reel States
const [reelData, setReelData] = useState()
const [isRecording, setIsRecording] = useState(false)

const [cameraFlash, setCameraFlash] = useState('off')
const [reelUploaded, setReelUploaded] = useState(false)
const [reelCaption, setReelCaption] = useState('')

const [Loading, setLoading] = useState(false)


  const [imageData, setImageData] = useState();
  const [imgDownloadUrl, setImgDownloadUrl] = useState('');

  const [reelVideoData, setReelVideoData] = useState()

  const [reelVideoFileName, setReelVideoFileName] = useState()

  const [postType, setPostType] = useState('post');

  const [postImageData, setPostImageData] = useState('');

  const [stopAutoScroll, setStopAutoScroll] = useState(true)

  let getResult;

  const navigation = useNavigation();

  const options= [
    {
      name: 'Post',
    },
    {
      name: 'Live',
    },
    {
      name: 'Event',
    },
    {
      name: 'Story',
    },
    {
      name: 'Reel',
    }
  ]

  useEffect(() => {
  //  (async()=>{
    // const cameraStatus = await Camera.requestCameraPermissionsAsync()
    // setHasCameraPermissions(cameraStatus.status == 'granted')
    
    // const audioStatus = await Audio.requestPermissionsAsync()
    // setHasAudioPermissions(audioStatus.status == 'granted')

    // const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
    // setHasGalleryPermissions(galleryStatus.status == 'granted')

    // if(galleryStatus == 'granted'){
    //   const userGalleryMedia = await MediaLibrary.getAssetsAsync({
    //     sortBy: ['creationTime'],
    //     mediaType:['video']
    //   })
    //   setGalleryItems(userGalleryMedia)
    // }

  //  })()
  }, [])
  // if(postType == 'reel'){
  // if(!hasCameraPermissions || !hasAudioPermissions || !hasGalleryPermissions){
  //   return(
  //     <View></View>
  //   )
  // }}
  

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
      console.log('Image has been selected with details :: ' + getResult.assets[0].uri)

      //  }
      //  if(imageData !== null){
      setImageData(getResult)
      setPostImageData(getResult.assets[0].uri)
      console.log('Image has been selected in post data :: ' + postImageData)

      //  }
    }
    // rn_image_picker_lib_temp_c4e208ea-87fa-4b9e-806a-bd04b7e84884.jpg
    // file:///data/user/0/com.lifestyle.fml/cache/rn_image_picker_lib_temp_af1a2b92-8dd0-48eb-91bd-fbc8a6f8fb60.jpg

    catch (error) {
      console.log(error.message)
    }

    // if (imageData == null) {
    // }else{
    //   console.log("Image data null")
    // }
    // console.log(result.assets[0].uri);
  }

  const optionsReel = {
    title: 'Select the perfect view',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    },
    customButtons: [
        {name: 'video', title: 'Take Video...'},
        {name: 'video_library', title: 'Choose Video from library...'},
    ],
    maxWidth: 1080,
    maxHeight: 10920,
    noData: true,
    durationLimit: 20,
    // aspectRatio: 9/16
}
  // for reel selection from media 
  const openCameraReel = async () => {
    //later
    try {
      const result = await launchCamera(optionsReel,{ mediaType: 'video' });
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
  const openGalleryReel = async () => {
    //later
    let result;

    try {
      result = await launchImageLibrary({ mediaType: 'video' });
      //  if(result==null){

      getResult = result;

      console.log('Image has been selected with data:: ' + getResult.assets[0])
      console.log('Image has been selected file Name:: ' + getResult.assets[0].fileName)
      console.log('Image has been selected url:: ' + getResult.assets[0].uri)


      setReelVideoFileName(getResult.assets[0].fileName)
    setReelVideoData(getResult.assets[0].uri)

      
      console.log('Image has been selected in post data :: ' + reelVideoFileName)
      console.log('Image has been selected in post data :: ' + reelVideoData)


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


  const OnLivePress=()=>{
    navigation.navigate('HostPage', {
      userID: userID,
      userName: userID,
      liveID: liveID,
  })
  }

  const uploadImageToStorage=async()=>{
    const response = storage().ref(`/profile/${imageData.assets[0].fileName}`);
   const put = await response.putFile(imageData.assets[0].uri);
   console.log(response);
   // setFullImaeRefPath(put.metadata.fullPath);
   const url = await response.getDownloadURL();
   console.log(url);
   setImgDownloadUrl(url);
   console.log('Upload url ', url)
   console.log('Url Here ',imgDownloadUrl)
}

  const UserPostFuncation= async()=>{
    try {
      uploadImageToStorage()
      if(imgDownloadUrl != '')
   { const UserPostData = {
        username:"Your Imi",
        userId:"66395180b6614c4d0b164f38",
        caption:reelCaption,
        imageUrl: imgDownloadUrl,    
      }
    axios.post(BASE_URL+CREATE_USER_POST,UserPostData)
    .then((res)=>{
      Alert.alert("You have successfully Posted your Post")
      console.log(res);
      setImgDownloadUrl('');
      setImageData(undefined);
      setPostImageData('');

    })
    .catch((error)=>{
      console.log('Event Post Failed ', error)
    })}
    } catch (error) {
      console.log('Event Post Failed ', error)

    }
    
 }
 const uploadReelToStorage=async()=>{
  setLoading(true)
  const response = storage().ref(`/reels/${reelVideoFileName}`);
//  const put = await response.putFile(reelVideoData);
//  console.log(response);

//  console.log('Upload url ', url)
//  console.log('Url Here ',imgDownloadUrl)
//  setReelUploaded(true)
//  Alert.alert('Reel uploaded Successfully')


 const task = response.putFile(reelVideoData);

task.on('state_changed', taskSnapshot => {
  console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
});



task.then(async() => {
  const url = await response.getDownloadURL();
// console.log(url);
setImgDownloadUrl(url);
  console.log('Image uploaded to the bucket! = ',url);
  setLoading(false)
//   //  if (imgDownloadUrl !== '' || reelUploaded == true){
  const postReelData = {
    username:'Your Imi',
    userId:'66395180b6614c4d0b164f38',
    caption: reelCaption,
    reelUrl:url,
    // imageUrl:'https://firebasestorage.googleapis.com/v0/b/fir-login-f23d7.appspot.com/o/profile%2Frn_image_picker_lib_temp_70cbfcc4-4aa8-49dc-8675-043fbca9d252.jpg?alt=media&token=4aaad895-3951-4a3a-8239-f0d2697aac07'     
  }
  // if(imgDownloadUrl != '')
  // {
    axios.post(BASE_URL+CREATE_POST_REEL,postReelData)
    .then((res)=>{
      Alert.alert("You have successfully Posted your Reel")
      console.log(res);
      setLoading(false)
      setReelVideoData(undefined)
      setReelVideoFileName(undefined)
      setReelUploaded(false)
    })
    .catch((error)=>{
      console.log('Reel Post Failed ', error)
      Alert.alert("Reel Post Failed Due To Some Reasons")

      setLoading(false)
      setReelUploaded(false)
    })
//  }
});
 // setFullImaeRefPath(put.metadata.fullPath);
 


}
const onRecord=async()=>{
  if(isRecording){
    camera.current.stopRecording();
    setIsRecording(false)
  }else{
    setIsRecording(true)
    const data = await camera.current.recordAsync()
    console.log('recording = ',data)
    let filename = data.uri.substring(data.uri.lastIndexOf('/') + 1, data.uri.length)
    console.log('file name = ',filename)
    setReelVideoFileName(filename);
    setReelVideoData(data.uri)
  }
  // recording =  
  // {"deviceOrientation": 1, 
  //"isRecordingInterrupted": false,
  //  "uri": "file:///data/user/0/com.lifestyle.fml/cache/Camera/d775e4e5-de90-493b-92b0-84b7f46155b3.mp4", 
  //  "videoOrientation": 1}

}

  return (
    <View style={{ flex: 1 }}>
      <Loader visible={Loading}/>
      <View style={{ height: '90%', width: '100%', backgroundColor:'black' }}>      
       {
       postType == 'post' 
       ?  
       <View style={{
          height: '100%', width: '100%', backgroundColor: 'grey', bottom: 0, position: 'absolute',
          margin: 10, justifyContent: 'center', alignItems: 'center'
        }}>
          <View style={{width:'100%', height:'100%', backgroundColor:'black'}}>
          
          {
      // postImageData != '' || postImageData != undefined || postImageData != null
      postImageData 
        ?
        <Image source={{ uri: postImageData }} //source={require('../Images/gallery.png')} 
        style={{width:'100%', height:'100%', resizeMode:'cover', // backgroundColor:'black'
      }} />
        :
        <View style={{height:'100%', width:'100%', justifyContent:'center', alignItems:'center'}}>
        <Image source={require('../Images/gallery.png')}
        style={{width:60, height:60, tintColor:'white'}}/>
        </View>
       

        }
       
      
        {
          postImageData ?
          
          <View style={{bottom:70, right:10, position:'absolute'}}>
            
          <TouchableOpacity onPress={()=>UserPostFuncation()}
            style={stylesPost.postNowBtn}>
          <Text style={stylesPost.postNowBtnText}>Post Now</Text>
          </TouchableOpacity>
          <TextInput style={[stylesPost.inputBoxCaption, { margin: 10 }]} placeholder='Write a Caption' placeholderTextColor='white'
        // value={about}
        // onChangeText={(value) => setAbout(value)}
        />
          </View>
         
        :
        null
        }
          </View>
        
          <View style={{
          height: 70, width: '100%', backgroundColor: 'black', bottom: 0, position: 'absolute',
          margin: 2, justifyContent: 'center', alignItems: 'center', flexDirection:'row'
        }}>
          <TouchableOpacity 
          style={[stylesPost.button, { marginTop: 10, borderTopWidth: 2, borderColor: 'black' }]} 
          onPress={() => openCamera()}>
            <Image source={require('../Images/camera.png')}
              style={{ width: 30, height: 30, marginLeft: 20, borderRadius: 5, tintColor: 'blue' }}
            />
            <Text style={{ marginLeft: 20, fontWeight: '700', color: 'white' }}>Open Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={stylesPost.button} onPress={() => openGallery()}>
            <Image source={require('../Images/gallery.png')}
              style={{ width: 30, height: 30, marginLeft: 20, borderRadius: 5, tintColor: 'green' }}
            />
            <Text style={{ marginLeft: 20, fontWeight: '700', color: 'white' }}>Open Gallery</Text>
          </TouchableOpacity>
          </View>
          

        </View>
        :
        postType == 'live'
        ?
        <View style={{
          height: 200, width: 160, backgroundColor: 'black', bottom: 0, position: 'absolute',
          margin: 10, justifyContent: 'center', alignItems: 'center'
        }}>
          
          <TouchableOpacity style={stylesPost.button}
          //onPress={() => openGallery()}
          >
            <Image source={require('../Images/gallery.png')}
              style={{ width: 30, height: 30, marginLeft: 20, borderRadius: 5, tintColor: 'green' }}
            />
            <Text style={{ marginLeft: 20, fontWeight: '700', color: 'white' }}>Live Effects</Text>
          </TouchableOpacity>

        </View>
        :
        postType == 'event'
        ?
        
          <AddPostCustom />
        
        :
        postType == 'reel'
        ?
        <View style={{
          height: '100%', width: '100%', backgroundColor: 'grey', bottom: 0, position: 'absolute',
          margin: 10, justifyContent: 'center', alignItems: 'center'
        }}>
          
          <View style={{width:'100%', height:'100%', backgroundColor:'black'}}>
          {
      // postImageData != '' || postImageData != undefined || postImageData != null
      reelVideoData 
        ?
        <Video

        // Can be a URL or a local file.
        source={{ uri: reelVideoData}}
      //  poster={item.thumbnailUrl}
        // Store reference  
        // ref={videoRef}
        resizeMode='cover'
        // Callback when remote video is buffering                                      
        // onBuffer={onBuffer}
        // Callback when video cannot be loaded              
        // onError={onError}
        style={{height:'100%', width:'100%'}}
        repeat
        paused={false}
        // paused={true}
    />
        :
        <View style={{height:'100%', width:'100%', justifyContent:'center', alignItems:'center'}}>
        {/* <Image source={require('../Images/gallery.png')}
        style={{width:60, height:60, tintColor:'white'}}/> */}
        <RNCamera
        ref = {camera}
        flashMode= {cameraFlash == 'on' ? 'on' : cameraFlash == 'auto' ? 'auto' : 
        cameraFlash == 'torch' ? 'torch':'off'}
        type='front'
        // defaultVideoQuality=''
        
        onRecordingStart={()=>setIsRecording(true)}
        onRecordingEnd={()=>setIsRecording(false)}
          style={{height:'100%', width:'100%'}}
          />
        
        </View>
        }
       
      
        {
          reelVideoData ?
          
          <View style={{bottom:70, right:10, position:'absolute'}}>
            
          <TouchableOpacity onPress={()=>UserPostFuncation()}
            style={stylesPost.postNowBtn}>
          <Text style={stylesPost.postNowBtnText}>Post Now</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>[uploadReelToStorage()]}//setReelVideoData(undefined)
            style={[stylesPost.postNowBtn,{bottom:0}]}>
          <Text style={stylesPost.postNowBtnText}>Retake</Text>
          </TouchableOpacity>
          <TextInput style={[stylesPost.inputBoxCaption, { marginBottom: 50 }]} placeholder='Write a Caption' placeholderTextColor='white'
        value={reelCaption}
        onChangeText={(value) => setReelCaption(value)}
        />
          </View>
         
        :
        null
        }
        {
          !reelVideoData ?
          <View style={{flex:1,flexDirection:'row', justifyContent:'space-between', alignItems:'center',
      bottom: 10, position: 'absolute', //backgroundColor:'blue', 
      width:250, height:100, alignSelf:'flex-end'
      }}>
        <TouchableOpacity onPress={()=>onRecord()}
         style={{
          height: isRecording ? 100 : 80, width: isRecording?100:80, backgroundColor: 'red',// flexDirection:'row',
          borderRadius:isRecording?50:40, margin:10, justifyContent:'center', alignItems:'center'//alignSelf:'flex-start'
        }}>

          {
            isRecording ?
            <View style={{
          height: 40, width: 40, backgroundColor: 'white',// flexDirection:'row',
          borderRadius:20, alignSelf:'center',//alignSelf:'flex-start'
        }}>

          </View>
          :
          null
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>openGalleryReel()}
        style={{height:30, width:30, //margin:20,
        justifyContent:'center', alignItems:'center'}}>
        <Image source={require('../Images/camera.png')}
        style={{width:30, height:30, tintColor:'white'}}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>openGalleryReel()}
        style={{height:60, width:60, margin:20,justifyContent:'center', alignItems:'center'}}>
        <Image source={require('../Images/gallery.png')}
        style={{width:60, height:60, tintColor:'white'}}/>
        </TouchableOpacity>

        </View>
        :
        null
        }
         

          </View>
        
          {/* <View style={{
          height: 70, width: '100%', backgroundColor: 'black', bottom: 0, position: 'absolute',
          margin: 2, justifyContent: 'center', alignItems: 'center', flexDirection:'row'
        }}>
          <TouchableOpacity 
          style={[stylesPost.button, { marginTop: 10, borderTopWidth: 2, borderColor: 'black' }]} 
          onPress={() => openCamera()}>
            <Image source={require('../Images/camera.png')}
              style={{ width: 30, height: 30, marginLeft: 20, borderRadius: 5, tintColor: 'blue' }}
            />
            <Text style={{ marginLeft: 20, fontWeight: '700', color: 'white' }}>Open Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={stylesPost.button} onPress={() => openGallery()}>
            <Image source={require('../Images/gallery.png')}
              style={{ width: 30, height: 30, marginLeft: 20, borderRadius: 5, tintColor: 'green' }}
            />
            <Text style={{ marginLeft: 20, fontWeight: '700', color: 'white' }}>Open Gallery</Text>
          </TouchableOpacity>
          </View> */}
          

        </View>
        :
        postType == 'story'
        ?
        <View style={{
          height: '100%', width: '100%', backgroundColor: 'grey', bottom: 0, position: 'absolute',
          margin: 10, justifyContent: 'center', alignItems: 'center'
        }}>
          <View style={{width:'100%', height:'100%', backgroundColor:'black'}}>
          
          {
      // postImageData != '' || postImageData != undefined || postImageData != null
      postImageData 
        ?
        <Image source={{ uri: postImageData }} //source={require('../Images/gallery.png')} 
        style={{width:'100%', height:'100%', resizeMode:'cover', // backgroundColor:'black'
      }} />
        :
        <View style={{height:'100%', width:'100%', justifyContent:'center', alignItems:'center'}}>
        <Image source={require('../Images/gallery.png')}
        style={{width:60, height:60, tintColor:'white'}}/>
        </View>
       

        }
       
      
        {
          postImageData ?
          
          <View style={{bottom:70, right:10, position:'absolute'}}>
            
          <TouchableOpacity onPress={()=>UserPostFuncation()}
            style={stylesPost.postNowBtn}>
          <Text style={stylesPost.postNowBtnText}>Post Now</Text>
          </TouchableOpacity>
          <TextInput style={[stylesPost.inputBoxCaption, { margin: 10 }]} placeholder='Write a Caption' placeholderTextColor='white'
        // value={about}
        // onChangeText={(value) => setAbout(value)}
        />
          </View>
         
        :
        null
        }
          </View>
        
          <View style={{
          height: 70, width: '100%', backgroundColor: 'black', bottom: 0, position: 'absolute',
          margin: 2, justifyContent: 'center', alignItems: 'center', flexDirection:'row'
        }}>
          <TouchableOpacity 
          style={[stylesPost.button, { marginTop: 10, borderTopWidth: 2, borderColor: 'black' }]} 
          onPress={() => openCamera()}>
            <Image source={require('../Images/camera.png')}
              style={{ width: 30, height: 30, marginLeft: 20, borderRadius: 5, tintColor: 'blue' }}
            />
            <Text style={{ marginLeft: 20, fontWeight: '700', color: 'white' }}>Open Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={stylesPost.button} onPress={() => openGallery()}>
            <Image source={require('../Images/gallery.png')}
              style={{ width: 30, height: 30, marginLeft: 20, borderRadius: 5, tintColor: 'green' }}
            />
            <Text style={{ marginLeft: 20, fontWeight: '700', color: 'white' }}>Open Gallery</Text>
          </TouchableOpacity>
          </View>
          

        </View>
        :
        null
        }
      </View>

      <View style={stylesPost.bottomBar}>
        <View style={stylesPost.dot}>

        </View>
        <View style={stylesPost.bottomScrollBar}>
          {/* <View style={{height:'100%', width:100}}>

            </View> */}
          {/* <ScrollView horizontal>

            <TouchableOpacity style={stylesPost.bottomButton} onPress={()=>setPostType('post')}>
              <Text style={stylesPost.bottomButtonText}>Post</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesPost.bottomButton} onPress={()=>setPostType('live')}>
              <Text style={stylesPost.bottomButtonText}>Live</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesPost.bottomButton} onPress={() => navigation.navigate('Post Event')}>
              <Text style={stylesPost.bottomButtonText}>Event</Text>
            </TouchableOpacity>
            <TouchableOpacity style={stylesPost.bottomButton}>
              <Text style={stylesPost.bottomButtonText}>Story</Text>
            </TouchableOpacity>
          </ScrollView> */}
           <Carousel
                loop
                width={width/2}
                height={width / 5}
                autoPlay={stopAutoScroll}
                
                // data={[...new Array(6).keys()]}
                data={options}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => [console.log('current index:', index),setStopAutoScroll(false),
                index == 0 ? setPostType('post') : index == 1 ? setPostType('live') : index == 2
              ? setPostType('event') : index == 3 ? setPostType('story') : 
              [setPostType('reel'),{openCameraReel}]]}
                renderItem={({ item,index }) => (
                    <View
                        style={{
                            flex: 1,
                            // width:'100%',
                            // height:'100%',
                            borderWidth: 1,
                            borderColor:'black',
                            justifyContent: 'center',
                            // backgroundColor:'orange',
                          
                        }}
                    >
                      <Text style={{ textAlign: 'center', fontSize: 30, fontWeight:'600',color:'white' }}>
                            {item.name}  
                        </Text>
                        

                    </View>
                )}
            />

        </View>

      </View>

    </View>
  )
}
const { height, width } = Dimensions.get('screen');

const stylesPost = StyleSheet.create({
  bottomBar: {
    height: '10%', width: '100%', backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'
  },
  dot: {
    height: 10, width: 10, backgroundColor: 'white', marginVertical: 2, borderRadius: 5
  },
  bottomScrollBar: {
    justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%',
    flexDirection: 'row',
    backgroundColor: 'black',
    marginBottom: 5
  },
  bottomButton: {
    height: 30, width: 80, justifyContent: 'center', alignItems: 'center'
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 22
  },
  button: {
    width: '50%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  postNowBtn:{
    height:40, width:150, backgroundColor:'black', right:0,bottom:70, position:'absolute',
    justifyContent:'center', alignItems:'center', borderTopLeftRadius:10, borderBottomLeftRadius:10
  },
  postNowBtnText:{
    color:'white', fontSize:20, fontWeight:'600'
  },
  inputBoxCaption: {
    width: width - 30,
    borderRadius: 15,
    borderWidth: 2,
    marginVertical: 10,
    padding: 10,
    borderColor: 'black',
    color: 'white',
    backgroundColor:'black'
  }
})

export default PostScreen