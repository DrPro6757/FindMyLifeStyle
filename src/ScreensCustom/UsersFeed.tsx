import { View, Text, FlatList, TouchableOpacity, ScrollView, Modal, Image, StyleSheet, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import GestureRecognizer from 'react-native-swipe-gestures'
import Slider from '@react-native-community/slider'
import {useSelector} from "react-redux";
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import { BASE_URL, LIKE_USER_POST, SAVE_USER_POST } from '../Utils/Strings';
import OptionsModal from './OptionsModal';
import Share from 'react-native-share';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import { ReelsData } from '../Utils/ReelsData';
import { StoriesData } from '../Utils/StoriesData';

const UsersFeed = () => {

  const navigation = useNavigation();

  const ref = React.useRef<FlatList>(null);

  const [index, setIndex] = useState(0)

  const [userPostsData, setUsersPostsData] = useState([])
  const [openOptionsModal, setOpenOptionsModal] = useState(false);

  const [myId, setMyId] = useState('');
  const [updateState, setUpdateState] = useState(false)

  const [myUserData, setMyUserData] = useState([])

  // reels
  
  const [allReelData, setAllReelData] = useState([])


  // const authData = useSelector(state=>state.myUserData);
  // console.log('my user data here ', authData.mydata.data._id)
    useEffect(() => {
      myIdFtn()
      getAllUserReels()
      getAllUserPostsData()
      getMyData()
    }, [updateState])
    
    const myIdFtn = async()=>{
    
      try {
        let idValue = await AsyncStorage.getItem('USER_DATA_ID')
        setMyId(idValue)
        console.log('data from async here in login ', myId)
//          http://localhost:8000/api/users/6632c1fdebc22d5c7fcc5579
        // return myId;
        setUpdateState(true)

      } catch (error) {
        console.log('error',error)
      }
  
    }
    const getAllUserReels=()=>{
      axios.get('http://10.0.2.2:8000/api/userreels')
      .then((res)=>{
        console.log('All User Posts Data :: ', res.data)
        setAllReelData(res.data.reverse())
        
      })
      .catch((error)=>{
        console.log('Please check your email id or password ', error)
      })
  }
    const getAllUserPostsData=()=>{
        axios.get('http://10.0.2.2:8000/api/userposts')
        .then((res)=>{
          console.log('All User Posts Data :: ', res.data)
          setUsersPostsData(res.data.reverse())
          
        })
        .catch((error)=>{
          console.log('Please check your email id or password ', error)
        })
    }
    const getMyData=()=>{
      try {
        axios.get('http://10.0.2.2:8000/api/users/'+myId)
        .then((res)=>{
          console.log('My User Data :: ', res.data.SavedPosts)
          res.data.SavedPosts.map(item=>{
            setMyUserData(item)
          })
          // setMyUserData(res.data.SavedPosts);
          //id
        })
        .catch((error)=>{
          console.log('Please check your email id or password ', error)
        })
      } catch (error) {
        console.log('Please check your connection ', error)
      }     
      }

      
    /// like api
    const onUserPostLike=(id)=>{
        console.log('user post id : ',id)
    //     const myHeaders = new Headers()
    //   myHeaders.append('Content-type','application/json')
        // const userId = "6639fcc4e42506e0b5c65f0e"
        const UserPostData = {
          userId:myId, 
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
          if(item == myId){
            isLiked = true
          }
        })
        return isLiked
      }
      /// Save User Post to 
      const onUserPostSave=(postId)=>{
        console.log('user post id : ',postId)
        console.log('my id : ',myId)

    //     const myHeaders = new Headers()
    //   myHeaders.append('Content-type','application/json')
        // const userId = "6639fcc4e42506e0b5c65f0e"
        const userPostSave = {
          postId:postId, 
        }
      axios.put(BASE_URL+SAVE_USER_POST+myId,userPostSave)
      .then((res)=>{
        Alert.alert("You have successfully Saved User Post")
        console.log(res);
        getMyData()
      })
      .catch((error)=>{
        console.log('Post Like Failed ', error)
      })
      }
      // const getPostSaveStatus=(id)=>{
      //   let isSaved = false
      //   myUserData.map(item=>{
      //     if(item == id){
      //       isSaved = true
      //     }
      //   })
      //   return isSaved
      // }

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

    const sharePostFtn=async(item)=>{
      // convert file into base64 format
      const shareoptioins = {
        message:item.imageUrl,
    }
    try {
      const ShareResponse = await Share.open(shareoptioins);
      console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      console.log('error message sharing :', error)
    }
    }
    
  return (
    <View style={{height: '100%', width: '100%', backgroundColor:'black'
    }}>

      {/* <Loader visible={Loading} /> */}
      <OptionsModal visible={openOptionsModal}
                onUpdate={() => {
                    // setOpenOptionsModal(false)
                    // setUpdateModal(true)
                }}
                onDelete={() => {
                    // deleteComment()
                }}
                onClose={() => { setOpenOptionsModal(false) }}
            />


      <View style={styles.topBar}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            padding: 10,
          }}>
          {/* <View
            style={{
              // justifyContent: 'center', alignItems: 'center',
              borderRadius: 25,
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
              //  marginTop: 100, marginRight: 10,
            }}>
            <TouchableOpacity
              onPress={() => setFilterModal(true)}
              style={{flexDirection: 'row'}}>
              <View
                style={{
                  height: 50,
                  width: 90,
                  backgroundColor: '#202A44',
                  flexDirection: 'row',
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'white',
                }}>
                <Image
                  source={require('../Images/filter.png')}
                  style={{height: 30, width: 30, tintColor: 'white'}}
                />
                <Text style={{color: 'white', fontSize: 18, fontWeight: '600'}}>
                  Filter
                </Text>
              </View>
            </TouchableOpacity>
          
          </View> */}
          {/* story Design */}
          <View style={styles.storyView}>
            <TouchableOpacity>
            <View style={{margin:10}}>
              <View style={[styles.storyImage,{backgroundColor:'black'}]}>
              <Image source={require('../Images/user.png')}
            style={styles.storyImage} />
             <Image source={require('../Images/plus.png')}
            style={styles.storyAdd} />
              </View>
           
            <Text style={styles.storyText}>Your Story</Text>
            </View>
            </TouchableOpacity>
            
            <FlatList 
      // ref = {ref}
      // initialScrollIndex={index}
      data = {StoriesData}
      horizontal
      // keyExtractor={(Item)=>Item.key}
      // contentContainerStyle={{margin: index == 3 ? 100 : 0}}
      renderItem={({item,index})=>{
        return(
              <View style={{width:80, height:80, marginVertical:5,justifyContent:'center', alignItems:'center'}}>
                <TouchableOpacity onPress={()=>navigation.navigate('Stories',{data:item})}>
                <Image source={{uri:item.thumbnailUrl}} style={styles.storyImageList}
                />
                </TouchableOpacity>
                
      </View>
        )
      }}
        />
            
          </View>
      

        </View>
      </View>

     <ScrollView nestedScrollEnabled>
      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
      <Text style={styles.reelHeading}>Reels</Text>
      <TouchableOpacity onPress={()=>navigation.navigate('Reels')}>
      <Text style={styles.reelHeading}>Watch All</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.reelView}>
      <FlatList 
      // ref = {ref}
      // initialScrollIndex={index}
      data = {allReelData}
      horizontal
      // keyExtractor={(Item)=>Item.key}
      // contentContainerStyle={{margin: index == 3 ? 100 : 0}}
      renderItem={({item,index})=>{
        return(
              <View style={{flex:1, width:'40%', height:'100%', margin:5,
               }}>
                <TouchableOpacity onPress={()=>navigation.navigate('Reels',{data:allReelData, index:index})}>
                <Image source={require('../Images/user.png')} style={{resizeMode:'cover',
                borderRadius:10,height:'100%', width:170, tintColor:'white'
            }}/>
                </TouchableOpacity>
                
      </View>
        )
      }}
        />
   </View>
      {/* <View style={styles.FeedScroll}> */}
      <FlatList 
      ref = {ref}
      initialScrollIndex={index}
      data = {userPostsData}
      keyExtractor={(Item)=>Item.key}
      // contentContainerStyle={{margin: index == 3 ? 70 : 0}}
      renderItem={({item,index})=>{
        return(
              <View style={{flex:1, width:'100%', height:'55%', marginTop: 10,
             marginBottom: index == userPostsData.length -1 ? 415 : 40,
              }}>
            <View style={{flexDirection:'row', margin:10, justifyContent:'space-between'}} >
                <View>
                {/*  */}
                <TouchableOpacity onPress={()=>[console.log('current index ', index),navigation.navigate('UsersProfiles',{data:item.userId})]} style={{flexDirection:'row'}}>
                {
                  item.profilePic ?
                  <Image source={{uri : item.profilePic}} style={{height:40, width:40, borderRadius:20,borderWidth:1,
                    borderColor:'white'}}/>
                  :

                  <Image source={require('../Images/user.png')} style={{height:40, width:40, borderRadius:20,borderWidth:1,
                    borderColor:'white',tintColor:'white'}}/>
                }
                <Text style={{color:'white', fontSize:24, fontWeight:'600', marginLeft:5}}>{item.username}</Text>
                </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={()=>setOpenOptionsModal(true)}>
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
                        <TouchableOpacity onPress={()=>sharePostFtn(item)}>
                          
                          <Image source={(require('../Images/send.png'))}
                          style={{height:35, width:35, tintColor:'white', marginTop:10, marginLeft:10}}
                          />
                        </TouchableOpacity>
                          </View>
                          <View >
                          <TouchableOpacity onPress={()=>onUserPostSave(item._id)}>
                          {
                            // getPostSaveStatus(item._id)
                            // ?
                            <Image source={(require('../Images/savedpost.png'))}
                          style={{height:35, width:35, tintColor:'red', marginTop:10, marginLeft:5}}
                          />
                          //  :
                          // <Image source={(require('../Images/heart.png'))}
                          // style={{height:35, width:35, tintColor:'white', marginTop:10, marginLeft:5}}
                          // />
                          }
                        </TouchableOpacity>
                          </View>
            </View>
            <Text style={{color:'white',fontWeight:'400', fontSize:18, marginBottom:15}}>
                        {item.postLikes.length > 0 ? item.postLikes.length+' like':null}</Text>
                       
            


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
     </ScrollView>
      
      
      
      {/* </View> */}

    </View>
  )
}
const styles = StyleSheet.create({
    
  topBar: {
    height: '18%',
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    flexDirection: 'row',
  },
  FeedScroll: {
    flex:1,
    width:'100%',
    height:'90%',
    alignSelf: 'center',
    marginTop: 1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'red'
    // height: '73%',
    // marginBottom: 10,
  },
  userPostContainer:{
    width:'100%',
    height:'80%',
    alignSelf: 'center',
    marginVertical: 10,
    justifyContent:'center',
    alignItems:'center',
  },
  addButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    borderRadius: 50,
  },
  userProfileContainer: {
    height: 400,
    justifyContent: 'center',
    backgroundColor: '#202A44',
    borderWidth: 2,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  EventPhotosNo: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
    alignSelf: 'center',
  },
  userContainer: {
    // justifyContent: 'center',
    backgroundColor: '#202A44',
    // alignItems: 'center',
    // backgroundColor:'#202A44',#30313A
    width: '100%',
    height: '92%',
    borderWidth: 0.5,
    borderColor: '#ff8501',
    borderRadius: 25,
    marginVertical: 5,
    // marginHorizontal: 10,
  },
  userMapping: {
    marginLeft: 10,
  },
  userText: {
    fontSize: 25,
    fontWeight: '500',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: -5,
    color: 'white',
  },
  userButtonView: {
    flexDirection: 'row',
    marginLeft: 100,
    marginBottom: 20,
    marginRight: 10,
  },
  userButton: {
    backgroundColor: '#4867A9',
    borderRadius: 10,
    height: 35,
    width: 110,
    marginLeft: 10,
  },
  user_Image: {
    width: 82,
    height: 82,
    borderRadius: 41,
    margin: 8,
    borderWidth: 0.2,
    borderColor: '#ff8501',
    justifyContent: 'center',
  },
  customContainer: {
    backgroundColor: '#e5e5e5',
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
  },
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: '#707070',
    marginTop: 10,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: '100%',
    width: '100%',
  },
  storyView:{
    width:'100%', height:'100%', backgroundColor:'#0e0e0e', justifyContent:'center'
    ,flexDirection:'row'
  },
  storyImage:{
    height:60, width:60, borderRadius:30, borderWidth:1, borderColor:'orange'
  },
  storyImageList:{
    height:70, width:70, borderRadius:35, borderWidth:1, borderColor:'orange'
  },
  storyAdd:{
    position:'absolute',
    bottom:0,
    right:0,
    width:20,
    height:20,
    tintColor:'white'

  },
  storyText:{
    color:'white',
    fontSize:14,
    fontWeight:'400',
    margin:5
  },
  reelHeading:{
    fontSize:22,
    fontWeight:'600',
    color:'white',
    margin:5
  },
  reelView:{
    height:'10%',
    width:'100%',
    backgroundColor:'#1e1e1e'
  }
});
export default UsersFeed