import { View, Text, Button, Image, Alert, Permission, PermissionsAndroid } from 'react-native'
import React, { useState } from 'react'
// import DocumentPicker from 'react-native-document-picker';
// import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const ImageUpload = () => {
  const [imageData, setImageData] = useState(null);
  const [fullImaeRefPath, setFullImaeRefPath] = useState("");
  const [imgDownloadUrl, setImgDownloadUrl] = useState("");
  let num = 0;
  const uriResult = '';

  const pickImage = async () => {
//later
    // try {
    //   const response = await DocumentPicker.pickSingle({
    //     type: [DocumentPicker.types.images],
    //     copyTo: 'cachesDirectory',
    //   })
    //   num = 1;
    //   console.log(response);
    //   setImageData(response);
    // } catch (error) {
    //   console.log(error);
    // }
  }
  const openCamera = async () => {
   //later
    // const result = await launchCamera({ mediaType: 'photo' });
    // num = 2;
    // setImageData(result);
    // console.log(result);

    }
  const UploadImage = async () => {
    try {
      const response = storage().ref(`/profile/${imageData.name}`);
      const put = await response.putFile(imageData.fileCopyUri);
      console.log(response);
      setFullImaeRefPath(put.metadata.fullPath);
      const url = await response.getDownloadURL();
      setImgDownloadUrl(url);
      Alert.alert("Image Uploaded");
    } catch (error) {
      console.log(error);
    }
  }
  const DeleteImage = async () => {
    try {
      const response = await storage().ref(fullImaeRefPath).delete();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  const requestPermission = async()=>{
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.Camera,{
          title:'Camera Permission',
          message:'App need camera permission',
          buttonNeutral:'ask me later',
          buttonNegative:'Cancel',
          buttonPositive:'OK',
        },
      );
      if(granted === PermissionsAndroid.RESULTS.granted){
        openCamera();
      }else{
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>ImageUpload</Text>
      <Text>Image uri:{imageData? (imageData.assets[0].uri):<Text>image not found</Text>}</Text>
  
      {/* {
        num === 1? uriResult=imageData.assests[0].uri
        :uriResult=imageData.uri
      } */}
      {
        imageData ? (
          
          // <Image source={{ uri: imageData.uri }} style={{ height: 100, width: 100, marginVertical: 20 }} />
          <Image  source={{ uri: imageData.assets[0].uri}}
           style={{ height: 100, width: 100, marginVertical: 20 }} />

          ) : <Text>No Image Found</Text>
      }

      <View style={{ width: "100%",position:'absolute', height:70,margin: 10, 
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button title='Select Image'
          onPress={() => pickImage()}

        />
        <Button title='Open Camera'
          onPress={() => openCamera()}
        />
        <Button title='Upload Image'
          onPress={() => UploadImage()}
        />
        <Button title='Delete Image'
          onPress={() => DeleteImage()}
          color='red'
        />
      </View>
      <View style={{ marginVertical: 30 }}>
        <Text>Url = {imgDownloadUrl.length > 0 ? imgDownloadUrl : "notfound"}</Text>
      </View>
      {
        imgDownloadUrl.length > 0 ?
          <Image source={{ uri: imgDownloadUrl }} style={{ height: 500, width: 500 }} />
          : null
      }

    </View>
  )
}

export default ImageUpload