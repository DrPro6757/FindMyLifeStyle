import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import Auth from '@react-native-firebase/auth'
import { StackActions, useNavigation } from '@react-navigation/native';
import {useDispatch, useSelector} from "react-redux";
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMyUserDataAction } from '../Redux/actionsUser';

const SplashScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    // const authData = useSelector(state=>state.myUserData)
  useEffect(() => {
    setTimeout( async() => {
      // console.log('auth data',authData)
      // console.log('auth data length',authData.length)

      //  const unsubscribe =await Auth().onAuthStateChanged((user)=>{
      //       console.log(user);
           getData();
            //last later
        // const routeName = user == null ? 'LoginScreen' : 'TabNavigationCustom'
        // navigation.dispatch(StackActions.replace(routeName));
        
          // });
          // unsubscribe();
    }, 5000);
    
    return () => {
      
    }
  }, [])
  const getData =async()=>{
    let id = AsyncStorage.getItem('USER_DATA')
    console.log('my user id from async ',)
    let data =await AsyncStorage.getItem('isLoggedIn')
    console.log('is Logged in value ',data)
    if(data == 'true' ){
      const myData = AsyncStorage.getItem('USER_DATA')

    dispatch(getMyUserDataAction(myData))

    navigation.dispatch(StackActions.replace('DrawerTabNavigation'));//CustomNavigator  AllUserData  UsersProfile
  //   if(authData.mydata.data == null //|| authData.mydata.data.length == 0 || authData.mydata.data.length == undefined
  //   ){
  //   // navigation.dispatch(StackActions.replace('LoginScreen'));

  }else{
    navigation.dispatch(StackActions.replace('LoginScreen'));

  }
  }
  
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
    {/* <View style={{flex:1 , height:'100%', width:'100%'}}> */}
      {/* backgroundColor:'#452c63' */}
 <Video source={require('../Images/TwinkleSky.mp4')}
        paused={false}
        style={styles.backgroundVideo}
        autoplay={true}
        repeat={true}
        muted={false}
        volume={1.0}

        resizeMode={'cover'}
      />
      {/* </View> */}
     <View style={{justifyContent:'center', alignItems:'center', alignSelf:'center', marginBottom:250}}> 
    <Image source={require('../Images/logoFml.png')}
    style={{height:140, width:140, marginTop:130, borderWidth:1, borderColor:'white', borderRadius:70, marginVertical:10}}
    />
    {/* <Text style={{fontSize:50,justifyContent:'center', alignItems:'center', color:'white', marginTop:50, fontWeight:'900',
  fontStyle:'italic'}}>
        FML</Text> */}
        <Text style={{fontSize:23,justifyContent:'center', alignItems:'center', color:'white', fontWeight:'900',
  fontStyle:'italic'}}>
      Find My Lifestyle</Text>
    {/* <View style={{flex:1 ,justifyContent:'center',alignItems:'center', height:'100%', width:'100%'}}>
      
    </View> */}
    </View>
    </View>
  )
}
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
export default SplashScreen