import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
// import Auth from '@react-native-firebase/auth'
import { StackActions, useNavigation } from '@react-navigation/native';
import TabNavigationCustom from '../navigations/TabNavigationCustom';
import Video from 'react-native-video';
import Lottie from 'lottie-react-native';


const StartScreen = (props) => {
  // const navigation = useNavigation();

  useEffect(() => {
  //   setTimeout( async() => {
  //     // const unsubscribe =await Auth().onAuthStateChanged((user)=>{
  //     //      console.log(user);
  //     //  const routeName = user == null ? 'LoginScreen' : 'TabNavigationCustom'
  //     //  navigation.dispatch(StackActions.replace(routeName));
  //     //    });
  //     //    unsubscribe();
  //     props.numberFtn()
  //  }, 7000);
   
  //  return () => {
     
  //  }
  }, [])
    return(
        <View style={{height:'80%', width:'95%', justifyContent:'center', alignItems:'center', //backgroundColor:'black'
        }}>
            {/* <Video source={require('../Images/video.mp4')}
        paused={false}
        style={styles.backgroundVideo}
        autoplay={true}
        repeat={true}
        muted={false}
        volume={1.0}

        resizeMode={'cover'}
      /> */}
            <View style={{flex:1, height:'100%', width:'95%', backgroundColor:'black', borderRadius:30, justifyContent:'center',
        alignSelf:'center',alignItems:'center', marginVertical:100}}>
                <Text style={{fontSize:24, marginTop:5, fontWeight:'600', width:'90%', color:'white'}}>
                Welcome aboard, to our online community! We're thrilled to have you here....
                </Text>
                <Lottie source={require('../Images/Animation - 1706352088115.json')} autoPlay loop />

                
                <TouchableOpacity style={{width:100, height:60, backgroundColor:'blue', borderRadius:20, justifyContent:'center',
            alignItems:'center', marginTop:270}}
            onPress={()=>props.numberFtn()}
            >
                <Text style={{fontSize:20, color:'white'}}>Let's Go </Text>
                </TouchableOpacity>
                
        </View>
        </View>
    )
  
}
const styles = StyleSheet.create({
    backgroundVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      height: '100%',
      width: '100%',
    },
  });

export default StartScreen