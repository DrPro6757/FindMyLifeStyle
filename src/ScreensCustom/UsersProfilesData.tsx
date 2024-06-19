import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {useSelector} from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BASE_URL, LIKE_USER_POST } from '../Utils/Strings';

const UsersProfilesData = () => {

    const navigation = useNavigation();
    const route = useRoute()

    const [myUserData, setMyUserData] = useState([])
    const [myAllEventPostData, setMyAllEventPostData] = useState([]);
    const [userPostsData, setUsersPostsData] = useState([])
    const [myId, setMyId] = useState('');

    // const authData = useSelector(state=>state.myUserData);
    // console.log('my user data here ', authData.mydata.data)
    const mydata = AsyncStorage.getItem('USER_DATA')
    console.log('my data from async ',mydata)
    console.log('my id from feed', route.params.data)
    // AsyncStorage.setItem('USER_DATA', '')
    // AsyncStorage.setItem('isLoggedIn', '')
    useEffect(() => {
        myIdFtn()
        getMyAllEventData()
        getMyData()
        getAllUserPostsData()
      }, [])
      const myIdFtn = async()=>{
    
        try {
          let idValue = await AsyncStorage.getItem('USER_DATA_ID')
          console.log('data from async here in login ', idValue)
        //   setMyId(idValue)
        setMyId(idValue)
    
        } catch (error) {
          console.log('error',error)
        }
    
      }
      //6639fcc4e42506e0b5c65f0e
    const getMyData=()=>{
        axios.get('http://10.0.2.2:8000/api/users/'+route.params.data)
        .then((res)=>{
          console.log('My User Data :: ', res.data.name)
          setMyUserData(res.data);
          //id
        })
        .catch((error)=>{
          console.log('Please check your email id or password ', error)
        })
      }
      const getAllUserPostsData=()=>{
        axios.get('http://10.0.2.2:8000/api/userpostsget/'+route.params.data)
        .then((res)=>{
          console.log('All User Posts Data :: ', res.data)
          setUsersPostsData(res.data);
        })
        .catch((error)=>{
          console.log('Please check your email id or password ', error)
        })
    }
      const getMyAllEventData = () => {
        // send a post request to the backend API for Login
        axios.get('http://10.0.2.2:8000/api/eventposts')
            .then((res) => {
                console.log('event data for all events ', res.data)
                setMyAllEventPostData(res.data);
            })
            .catch((error) => {
                console.log('Please check your email id or password ', error)
            })
    }
    
    /// like api
    const onUserPostLike=(id)=>{
      console.log('user post id : ',id)
  //     const myHeaders = new Headers()
  //   myHeaders.append('Content-type','application/json')
      // const userId = "6639fcc4e42506e0b5c65f0e"
      const UserPostData = {
        userId:"6639fcc4e42506e0b5c65f0e", 
      }
    axios.put(BASE_URL+LIKE_USER_POST+id,UserPostData)
    .then((res)=>{
      // Alert.alert("You have successfully Liked User Post")
      // console.log(res);
      getAllUserPostsData()
    })
    .catch((error)=>{
      console.log('Post Like Failed ', error)
    })
    }
    const getLikeStatus=(likes)=>{
      let isLiked = false
      likes.map(item=>{
        if(item == '6639fcc4e42506e0b5c65f0e'){
          isLiked = true
        }
      })
      return isLiked
    }

    const timeDiffernce = (previous) => {
      const current = new Date();
      var msPerMinute = 60 * 1000;
      var msPerHour = msPerMinute * 60;
      var msPerDay = msPerHour * 24;
      var msPerWeek = msPerDay * 7;
      var msPerMonth = msPerDay * 30;
      var msPerYear = msPerDay * 365;

      var elapsed = current - previous;
      if (elapsed < msPerMinute) {
          return Math.round(elapsed / 1000) + ' seconds ago';
      }
      else if (elapsed < msPerHour) {
          return Math.round(elapsed / msPerMinute) + ' minutes ago';
      }
      else if (elapsed < msPerDay) {
          return Math.round(elapsed / msPerHour) + ' hours ago';
      }
      //later
      else if (elapsed < msPerWeek) {
          return Math.round(elapsed / msPerDay) + ' week ago';
      }
      //
      else if (elapsed < msPerYear) {
          return Math.round(elapsed / msPerMonth) + ' months ago';
      }
      else {
          return Math.round(elapsed / msPerYear) + ' years ago';
      }
  }
    
    const EditProfileFtn=()=>{
        navigation.navigate('Profile Edit',{data:myUserData})
    }


  return (
    <ScrollView nestedScrollEnabled style={styles.container}>

       <View style={styles.coverPhoto}>
        {
          myUserData.coverPic == null ?
        <Text style={{color:'white', fontSize:30, fontWeight:'bold'}}>Cover Photo</Text>
        :
        <Image source={{uri : myUserData.coverPic}} style={styles.coverPic}/>
        }
       </View>
      <View style={styles.profileView}>
        
       {
        myUserData.profilePic == null ?
      <Image source={require('../Images/user.png')} style={[styles.profileImage,{tintColor:'white'}]}/>
      :
      <Image source={{uri : myUserData.profilePic}} style={styles.profileImage}/>

       }
      </View>
      <Text style={styles.username}>{myUserData ? myUserData.name:''}</Text>
      <Text style={styles.email}>{myUserData ? myUserData.about:''}</Text>
      <Text style={styles.email}>
        {myUserData ? myUserData.email +' is my email id to contact me officially.':''}
        </Text>
      <View style={styles.followersView}>
        <View style={styles.countView}>
            {/* <Text style={styles.countValues}>{myUserData ? myUserData.followers.length:'0'}</Text> */}
            <Text style={styles.countTitle}>Followers</Text>
        </View>
        <View style={styles.countView}>
            {/* <Text style={styles.countValues}>{myUserData ? myUserData.following.length:'0'}</Text> */}
            <Text style={styles.countTitle}>Following</Text>
        </View>
        <View style={styles.countView}>
            {/* <Text style={styles.countValues}>{myUserDaßta ? myUserData.followers.length:'0'}</Text> */}
            <Text style={styles.countTitle}>Posts</Text>
        </View>
      </View>
      <View //style={{flexDirection:'row', justifyContent:'space-between'}}
      >
     {
        myId == myUserData._id 
        ?
      <TouchableOpacity style={styles.editButton}
      onPress={()=>EditProfileFtn()}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
      :
      null
      }
      {/* <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Post Event</Text>
      </TouchableOpacity> */}
      </View>

      <View style={{backgroundColor:'black'}}>
<FlatList data = {userPostsData}
      renderItem={({item,index})=>{
        return(
            <View style={{flex:1, width:'100%', height:'55%', marginVertical:20}}>
            <View style={{flexDirection:'row', margin:10, justifyContent:'space-between'}} >
                <View style={{flexDirection:'row'}}>
                <TouchableOpacity>
                <Image source={require('../Images/user.png')} style={{height:35, width:35, borderRadius:17,borderWidth:1,
                    borderColor:'white',tintColor:'white'}}/>
                </TouchableOpacity>
                <Text style={{color:'white', fontSize:24, fontWeight:'600', marginLeft:5}}>{item.username}</Text>
                </View>
                <TouchableOpacity>
                <Image source={require('../Images/option.png')} style={{height:25, width:30,tintColor:'white'}}/>
                </TouchableOpacity>
            </View> 
             
            <View style={{marginVertical:10, height:400, width:'100%', backgroundColor:'#1e1e1e'}}>
                <Image source={{uri:item.imageUrl}} style={{resizeMode:'contain',height:400, width:'100%'
            }}/>
            </View>
            
            <View style={{height:70, width:'100%', backgroundColor:'black', 
                        justifyContent:'space-between',flexDirection:'row'}}>
            <View style={{flexDirection:'row'}}>
                            <View>
                            <TouchableOpacity onPress={()=>onUserPostLike(item._id)}>
                          
                          {
                            getLikeStatus(item.postLikes)
                            ?
                            <Image source={(require('../Images/heartOn.png'))}
                          style={{height:35, width:35, tintColor:'red', marginTop:10, marginLeft:5}}
                          />
                           :
                          <Image source={(require('../Images/heart.png'))}
                          style={{height:35, width:35, tintColor:'white', marginTop:10, marginLeft:5}}
                          />
                          } 
                        </TouchableOpacity>
                        {
                        //   props.selectedEvent.postLikes.length > 0
                        //   ?
                        //   <Text style={{color:'white', fontSize:14, margin:10}}>{props.selectedEvent.postLikes.length} likes</Text>
                        //   :
                        //   null

                        }
                             </View>
                            
                          
                        <TouchableOpacity 
                        onPress={()=>[navigation.navigate('Comments Posts',{id:item._id})]}
                        >
                          
                          <Image source={(require('../Images/comment.png'))}
                          style={{height:35, width:35, tintColor:'white', marginTop:10, marginLeft:10}}
                          />
                          <Text style={{color:'white'}}>
                       
                            {/* {
                          props.selectedEvent.postLikes.length +'comments'
                          ?
                          props.selectedEvent.postLikes.length
                          :
                          null 
                          } */}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                          
                          <Image source={(require('../Images/send.png'))}
                          style={{height:35, width:35, tintColor:'white', marginTop:10, marginLeft:10}}
                          />
                        </TouchableOpacity>
                          </View>
                          <View >
                          <TouchableOpacity onPress={()=>AddToWishListFtn(item)}>
                          {
                            // getWishListStatus(item)?
                            <Image source={(require('../Images/savedpost.png'))}
                          style={{height:35, width:35, marginTop:10, marginRight:5}}
                          />
                            // :
                            // <Image source={(require('../Images/wishList.png'))}
                            // style={{height:35, width:35, tintColor:'white',margin:10}}
                            // />
                          }
                        </TouchableOpacity>
                          </View>
            </View>
            {/* <Text style={{color:'white',fontWeight:'400', fontSize:18, marginBottom:15}}>
                        {item.postLikes.length > 0 ? item.postLikes.length+' like':null}</Text> */}
                       
            


             <Text style={{color:'white',fontWeight:'400', fontSize:18, marginVertical:10}}>{item.createdAt}</Text>


            <View style={{flexDirection:'row',margin:10 }} >
            <Text style={{color:'white',fontWeight:'500', fontSize:20, alignSelf:'center'}}>{item.username}</Text>
            <Text style={{color:'white',fontWeight:'400', fontSize:18, marginLeft:10, alignSelf:'center'}}>{item.caption}</Text>
            </View>   
            
            <Text style={{color:'white',fontWeight:'400', fontSize:18, marginVertical:10}}>No Comments</Text>
            <Text style={{color:'white',fontWeight:'400', fontSize:18, marginVertical:10}}>
            {timeDiffernce(new Date(item.createdAt))}
            </Text>


            <View style={{width:'100%', borderWidth:0.2, borderColor:'#2e2e2e', marginBottom:-40}}></View>


            </View>
        )
      }}
      />
</View>

      
    </ScrollView>
  )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'black'
    },
    coverPhoto:{
        height:180,
        width:'100%',
        backgroundColor:'blue',
        justifyContent:'center',
        alignItems:'center',
        // borderWidth:1,
        // borderColor:'white'
    },
    coverPic:{
      height:'100%',
      width:'100%',
      resizeMode:'cover',
      borderRadius:10
    },
    profileView:{
        width:120,
        height:120,
        borderRadius:60,
        backgroundColor:'black',
        borderWidth:1,
        borderColor:'white',
        justifyContent:'center',
        alignItems:'center',
        marginLeft:20,
        marginTop:-50,

    },
    profileImage:{
        width:120,
        height:120,
        borderRadius:60,
        resizeMode:'cover',
        borderWidth:1,
        borderColor:'white'
        // tintColor:'white'
    },
    username:{
        fontSize:30,
        marginTop:5,
        marginLeft:20,
        color:'white',
        fontWeight:'bold'
    },
    email:{
        fontSize:24,
        marginTop:20,
        color:'white',
        fontWeight:'500',
        marginLeft:20
    } ,
    editButton:{
        alignSelf:'center',
        justifyContent:'center',
        alignItems:'center',
        height:50,
        width:'80%',
        borderRadius:10,
        borderWidth:1,
        borderColor:'white',
        margin:20
    },
    editButtonText:{
        alignSelf:'center',
        fontSize:25,
        fontWeight:'400',
        color:'white'
        
    },
    followersView:{
        flexDirection:'row',
        justifyContent:'space-evenly',
        height:50,
        width:'100%',
        marginTop:30,
    },
    countView:{
        alignItems:'center',
    },
    countValues:{
        fontSize:30,
        fontWeight:'600',
        color:'white',
    },
    countTitle:{
        fontSize:20,
        marginTop:5,
        fontWeight:'500',
        color:'white'
    }
    
})

export default UsersProfilesData