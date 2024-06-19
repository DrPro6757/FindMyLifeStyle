
import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Image, Alert, Modal, TextInput, FlatList } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import { useRoute, useNavigation, StackActions } from '@react-navigation/native';
import Loader from './Loader';

const Test = () => {
    const [myData, setMyData] = useState('');
    const [myPhotos, setMyPhotos] = useState('');
    const [imageClick, setImageClick] = useState(false);
    useEffect(() => {

const myUserId = AsyncStorage.getItem("USERID");
console.log("My user id here :"+myUserId);
  //     firestore()
  // .collection('users')
  // .get()
  // .then(querySnapshot => {
  //   console.log('Total users: ', querySnapshot.size);

  //   querySnapshot.forEach(documentSnapshot => {
  //     console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
  //     setMyData(documentSnapshot.id);
  //     // console.log("My IDD : "+documentSnapshot.data().id);
  //     console.log("My IDD : "+myUserId);
  //     if(myUserId === documentSnapshot.data().id){
  //       setMyPhotos(documentSnapshot.data().photos);
  //       console.log('my photos', myPhotos);
  //     }else{
  //       setMyData('')
  //     }
     
  //   });
  // });

  
  getDataTest();



      }, [])

const getDataTest= async()=>{

///
///  query snaphot not only read collection, all the document in collection but also the data with the documents
///
//  await firestore()
//   .collection('users')
//   .get()
//   .then(querySnapshot => {
//     console.log('Total users: ', querySnapshot.size);

//     querySnapshot.forEach(documentSnapshot => {
//       console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
//       console.log('All user name', documentSnapshot.data().name)
//     });
//   });

///
///  document snapshot only returns the data and meta data with the document
///
  await firestore()
  .collection('users')
  .doc('xxPurLrhPyXIxbJcaB0kELhXSyH3')
  .get()
  .then(documentSnapshot => {
    console.log('User exists: ', documentSnapshot.exists);

    if (documentSnapshot.exists) {
      console.log('User data: ', documentSnapshot.data());
      console.log('User data: ', documentSnapshot.data().age);
      console.log('User data: ', documentSnapshot.data().photos);
      setMyPhotos(documentSnapshot.data().photos)
    }
  });

}



    const getDatabase = async () => {
        try {
            let myPhotos = [];
          const data = await firestore().collection('users')
            .doc(auth().currentUser?.uid).get();
          setMyData(data._data);
          console.log("my data :: "+myData.interest)
          console.log("my data :: "+myData.name)

          // myPhotos = myData._data.photos;
          // console.log('profileName =' + myPhotos[0]);
          // console.log('Image link : '+myData._data.profileImage);
          // console.log('Image Data :"'+imageData);
        } catch (error) {
          console.log(error);
        }
        // setImagePicked(false);
      }
  return (
    <View>
<FlatList
// style={{flex:1}}
  data={myPhotos}
  numColumns={2}
 renderItem= {({item,index}) => {
   return(
     // console.log('my items ::'+item);
     <View  key={index} style={{flex:1,height:'100%'}}>
     <View style={{flexDirection:'row',borderWidth:2,borderColor:'white'}}>
      {/* <Text style={{fontSize:18, color:'black'}}>{item.photos}</Text> */}
      <TouchableOpacity onPress={()=>{setImageClick(!imageClick)}}>
       <Image 
       source={{ uri: item}}
       style={{width: 160,
         height: 160,
         borderRadius: 10,
         borderWidth: 2,
         borderColor: '#ff8501',
         alignSelf: 'center',
         margin: 5 }}
     />
     </TouchableOpacity>
     </View>
     </View>
   )
   
  }}
  />
 
    </View>
    
  )
}

export default Test

// {
//   myPhotos!== '' ?
//   <FlatList
//   data={myPhotos}
//  renderItem= {({item,index}) => {
//    return(
//      // console.log('my items ::'+item);
//      <View style={{flex:1,flexDirection:'row' }}>
//      <View style={{flex:1, justifyContent:'flex-start', flexDirection:'row',width:100, height:100,borderWidth:2,borderColor:'red'}} key={index}>
//       {/* <Text style={{fontSize:18, color:'black'}}>{item.photos}</Text> */}
//        <Image 
//        source={{ uri: item}}
//        style={{width: 100,
//          height: 100,
//          borderRadius: 50,
//          borderWidth: 2,
//          borderColor: '#ff8501',
//          alignSelf: 'center',
//          marginTop: 5 }}
//      />
//      </View>
//      </View>
//    )
   
//   }}
//   />

//      :
  
//      <Text style={{fontSize:30, color:'black'}}>
//      No photos to show
//      </Text>

//     }













