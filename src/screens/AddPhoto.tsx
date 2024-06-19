import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Loader from './Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

let name = ''
let email = ''
const AddPhoto = () => {

  const [imageData, setImageData] = useState('');
  const [fullImaeRefPath, setFullImaeRefPath] = useState("");
  const [imgDownloadUrl, setImgDownloadUrl] = useState("");
  const [caption, setCaption] = useState('');

  useEffect(() => {
    userDetails();
  }, [])
  const userDetails = async () => {
    name = await AsyncStorage.getItem('NAME');
    email = await AsyncStorage.getItem('EMAIL');
  }


  const openCamera = async () => {
    const result = await launchCamera({ mediaType: 'photo' });

    if (imageData !== null) {
      setImageData(result);
    }
    console.log(result);
    // console.warn('Image :'+ imageData!==null?imageData.assets[0].uri:null);

  }
  const openGallery = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });

    if (imageData !== null) {
      setImageData(result);
    }
    console.log(result.assets[0].uri);

  }
  const UploadImage = async () => {
    try {
      const response = storage().ref(`/profile/${imageData.assets[0].fileName}`);
      const put = await response.putFile(imageData.assets[0].uri);
      console.log(response);
      // setFullImaeRefPath(put.metadata.fullPath);
      const url = await response.getDownloadURL();
      console.log(url);
      setImgDownloadUrl(url);
      Alert.alert("Image Uploaded");
      firestore().collection('users').doc().add({
        img: url,
        caption: caption,
        name, name,
        email, email,
      })
        .then(() => {
          console.log('Post added');
        })

      firestore()
        .collection('posts')
        .get()
        .then(querySnapshot => {
          console.log('Total posts: ', querySnapshot.size);

          querySnapshot.forEach(documentSnapshot => {
            console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
          });
        });
    } catch (error) {
      console.log(error);
    }


  }
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View
        style={styles.upperContainer}>
        <Text style={styles.headingStyle}>
          Create Event
        </Text>
        <Text style={{
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
        </Text>
      </View>
      <View style={styles.uploadImageBox}>
        {
          imageData ?
            // <Text style={{color:'white', fontSize:15}}>Image Data:{imageData}</Text>
            <Image source={{ uri: imageData.assets[0].uri }}
              style={{ width: 50, height: 50, borderRadius: 10, margin: 10 }} />
            :
            <Image source={require('../Images/image.png')}
              style={{ width: 150, height: 150, alignSelf:'center'}}
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
      <View style={{
        flexDirection: 'row',
        borderWidth: 1,
        width: '100%',
        height: 200,
        borderColor: 'black',
        justifyContent: 'space-evenly'
      }}>
       
        
      </View>
    </View>
  )
}
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
    width: '90%',
    height: 150,
    borderWidth: 1,
    alignSelf: 'center',
    marginVertical: 20,
    borderColor: 'black',
    borderRadius: 5,
  },
  button: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,

  }
});
export default AddPhoto