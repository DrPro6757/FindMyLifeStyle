import { View, Text } from 'react-native'
import React from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const UsersPost = () => {
    const [imageData, setImageData] = useState();

    let getResult;

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
  return (
    <View>
      <Text>UsersPost</Text>
    </View>
  )
}

export default UsersPost