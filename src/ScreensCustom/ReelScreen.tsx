import { View, Text, StyleSheet, SafeAreaView, StatusBar, Image, FlatList, Dimensions, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Video from 'react-native-video';
import { ReelsData } from '../Utils/ReelsData';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { useNavigation, useRoute } from '@react-navigation/native';
import VideoPlayer from 'react-native-video-controls';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNMediaMetadataRetriever from 'react-native-media-metadata-retriever' 
import { BASE_URL, LIKE_USER_REEL } from '../Utils/Strings';




const ReelScreen = () => {
    const navigation = useNavigation()
    const route = useRoute()
    console.log('flat list index = ',route.params.index)
    const videoRef = useRef(null)
    const [currentIndex, setCurrentIndex] = useState(0)

    const [onClickPause, setOncClickPause] = useState(false)
    const [allReelData, setAllReelData] = useState([])

    const [myId, setMyId] = useState('');
    const [updateState, setUpdateState] = useState(false)

    useEffect(() => {
    myIdFtn()
    getAllUserReels()

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

//    RNMediaMetadataRetriever.getPicture(state.active.url)
//   .then((response) => {
//       if(response.artcover){
//           let track = state.active;
//           track.artcover = response.artcover;
//           setState({
//               active: track
//           })

//           console.log('track url ', track.artcover)
//       }
//   })
//   .catch((error) => {
//       console.log(error);
//   })

    

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
    const onBuffer = (e) => {
        console.log('Buffering ... ', e)
    }
    const onError = (e) => {
        console.log('error ', e)
    }

    const onChangeIndex = ({ index }) => {
        setCurrentIndex(index)
    }

    const onReelLike=(id)=>{
        console.log('user post id : ',id)
        console.log('user id ', myId)
    //     const myHeaders = new Headers()
    //   myHeaders.append('Content-type','application/json')
        // const userId = "6639fcc4e42506e0b5c65f0e"
        const UserReelData = {
          userId:myId, 
        }
      axios.put('http://10.0.2.2:8000/api/userreels/like/'+id,UserReelData)
      .then((res)=>{
        Alert.alert("You have successfully Liked User Reeel")
        // console.log(res);
        getAllUserReels()
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

    useEffect(() => {
        if (!!videoRef.current) {
            videoRef.current.seek(0)
        }
    }, [currentIndex])


    // http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
    return (
        <View style={{ backgroundColor: 'black' }}
        >
            <Pressable onPress={()=>setOncClickPause(true)}>

            
            <StatusBar barStyle='light-content' />
            <SwiperFlatList
                vertical
                // autoplayLoop
                data={allReelData}
                index={route.params.index}
                initialScrollIndex={route.params.index}

                keyExtractor={(item, index) => index.toString()}
                onChangeIndex={onChangeIndex}
                
                renderItem={({ item, index }) => {
                    return (
                        <View //style={{height:'100%', width:'100%'}}
                        >
                            {/* <Text style={{color:'white', fontSize:20}}>
                               asd{item.videoUrl}</Text> */}

                            <VideoPlayer
                            source={{ uri: item.reelUrl }}
                            style={styles.backgroundVideo}
                                paused={currentIndex !== index || onClickPause == true}
                                tapAnywhereToPause
                                resizeMode='cover'
                                repeat
                                // navigator={this.props.navigator}
                            />
                            {/* <Video

                                // Can be a URL or a local file.
                                source={{ uri: item.videoUrl }}
                                poster={item.thumbnailUrl}
                                // Store reference  
                                ref={videoRef}
                                resizeMode='cover'
                                // Callback when remote video is buffering                                      
                                onBuffer={onBuffer}
                                // Callback when video cannot be loaded              
                                onError={onError}
                                style={styles.backgroundVideo}
                                repeat
                                // paused={currentIndex !== index}

                                paused={true}
                            /> */}
                            <View style={styles.heading}>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Image source={require('../Images/back.png')}
                                        style={{ height: 30, width: 30, tintColor: 'white', margin: 10 }} />
                                </TouchableOpacity>

                                <Text style={styles.headingText}>Reels</Text>

                                <Image source={require('../Images/camera.png')}
                                    style={{ height: 30, width: 30, tintColor: 'white', margin: 10 }} />
                            </View>
                            {/* bottom */}
                            <TouchableOpacity style={styles.giftsBtn}
                                onPress={() => navigation.goBack()}>
                                <Image source={require('../Images/giftbox.png')}
                                    style={{ height: 40, width: 40, margin: 10 }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.giftsBtn, { bottom: 320 }]}
                                onPress={() => onReelLike(item._id)}>
                            {
                                getLikeStatus(item.postLikes)
                                ?
                                <Image source={require('../Images/heartOn.png')}
                                    style={{ height: 40, width: 40, tintColor: 'red', margin: 10 }} />
                                    :
                                    <Image source={require('../Images/heart.png')}
                                    style={{ height: 40, width: 40, tintColor: 'white', margin: 10 }} />
                            }
                            {
                                item.postLikes.length > 0
                                ?
                                <Text style={{color:'white', alignSelf:'flex-end'}}>{item.postLikes.length }like</Text>
                                :
                                null
                            }
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.giftsBtn, { bottom: 240 }]}
                                onPress={() => navigation.navigate('Reel Comments',{id:item._id})}>
                                <Image source={require('../Images/comment.png')}
                                    style={{ height: 40, width: 40, tintColor: 'white', margin: 10 }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.giftsBtn, { bottom: 160 }]}
                                onPress={() => console.log('Share Button')}>
                                <Image source={require('../Images/send.png')}
                                    style={{ height: 40, width: 40, tintColor: 'white', margin: 10 }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.giftsBtn, { bottom: 80 }]}
                                onPress={() => navigation.goBack()}>
                                <Image source={require('../Images/info.png')}
                                    style={{ height: 40, width: 40, tintColor: 'white', margin: 10 }} />
                            </TouchableOpacity>
                            {/* bottom left */}
                            <View style={styles.userView}>
                                <TouchableOpacity
                                    onPress={() => navigation.goBack()}>
                                    <Image source={require('../Images/logoFml.png')}
                                        style={{ height: 60, width: 60, borderRadius: 10, margin: 10 }} />
                                </TouchableOpacity>
                                <Text style={styles.userName}>{item.username}</Text>
                            </View>
                            <Text style={styles.Description}>{item.caption ? item.caption : '.'}</Text>

                            <View style={styles.OriginalView}>
                                <Image source={require('../Images/music.png')}
                                    style={{ height: 30, width: 30, tintColor: 'white' }} />
                                <Text style={{ fontSize: 20, color: 'white', marginLeft: 10 }}>Original Audio</Text>
                            </View>
                        </View>
                    )
                }
                }

            />

            {/* <Video

// Can be a URL or a local file.
source={{ uri: ReelsData[0].videoUrl}}
poster={ReelsData[0].thumbnailUrl}
// Store reference  
ref={videoRef}
resizeMode='contain'
// Callback when remote video is buffering                                      
onBuffer={onBuffer}
// Callback when video cannot be loaded              
onError={onError}
style={styles.backgroundVideo}
repeat
paused={false}
/> */}

</Pressable>
        </View>

    )
}
const { height, width } = Dimensions.get('window')

const styles = StyleSheet.create({
    backgroundVideo: {
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // bottom: 0,
        // right: 0,
        height: height,
        width: width,
        resizeMode:'cover'
        // height:300,
        // width:300,
    },
    heading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 10,
        left: 10,
    },
    headingText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        paddingHorizontal: 16
    },
    giftsBtn: {
        position: 'absolute',
        bottom: 400,
        right: 10
    },
    userView: {
        position: 'absolute',
        left: 10,
        bottom: 220,
        flexDirection: 'row'
    },
    userName: {
        fontSize: 23,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 20
    },
    Description: {
        fontSize: 20,
        fontWeight: '500',
        color: 'white',
        position: 'absolute',
        left: 10,
        bottom: 150,
        marginLeft: 20,
        marginRight: 30
    },
    OriginalView: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 80,
        left: 10
    }
});

export default ReelScreen