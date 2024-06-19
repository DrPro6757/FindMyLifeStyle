import { View, Text, StyleSheet, SafeAreaView, StatusBar, Image, FlatList, Dimensions, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Video from 'react-native-video';
import { ReelsData } from '../Utils/ReelsData';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { useNavigation } from '@react-navigation/native';

const StoriesScreen = () => {
    const navigation = useNavigation()
    const videoRef = useRef(null)
    const [currentIndex, setCurrentIndex] = useState(0)

    const[reply, setReply] = useState('')
    const onBuffer = (e) => {
        console.log('Buffering ... ', e)
    }
    const onError = (e) => {
        console.log('error ', e)
    }

    const onChangeIndex=({index})=>{
        setCurrentIndex(index)
    }
    useEffect(() => {
      if(!!videoRef.current){
        videoRef.current.seek(0)
      }
    }, [currentIndex])
    

    // http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
    return (
        <View style={{  backgroundColor: 'black' }}
        >
            <StatusBar barStyle='light-content' />
            <SwiperFlatList
            horizontal
            // autoplayLoop
                data={ReelsData}
                keyExtractor={(item, index) => index.toString()}
                onChangeIndex={onChangeIndex}
                renderItem={({item,index}) => {
                    return (
                        <View //style={{height:'100%', width:'100%'}}
                        >
                            {/* <Text style={{color:'white', fontSize:20}}>
                               asd{item.videoUrl}</Text> */}
                                
                            <Video

                                // Can be a URL or a local file.
                                source={{ uri: item.videoUrl}}
                               poster={item.thumbnailUrl}
                                // Store reference  
                                ref={videoRef}
                                // resizeMode='cover'
                                // Callback when remote video is buffering                                      
                                onBuffer={onBuffer}
                                // Callback when video cannot be loaded              
                                onError={onError}
                                style={styles.backgroundVideo}
                                repeat
                                paused={currentIndex !== index}
                                // paused={true}
                            />
                               <View style={styles.heading}>

                                <View style={{flexDirection:'row'}}>
                                <TouchableOpacity onPress={()=>navigation.goBack()}>
                                <Image source={require('../Images/back.png')}
                                        style={{ height: 30, width: 30, tintColor: 'white', margin: 10 }} />
                                </TouchableOpacity>
                                <Image source={require('../Images/user.png')}
                                        style={{ height: 30, width: 30, tintColor: 'white', margin: 10 }} />
                                   <View>
                                   <Text style={styles.headingText}>User Name</Text>
                                   <Text style={{color:'white'}}>Time Posted</Text>
                                   </View>
                                </View>
                                
                                

                                <View>
                                <TouchableOpacity //style={{alignSelf:'flex-end'}}
                                 onPress={()=>navigation.goBack()}>
                                <Image source={require('../Images/option.png')}
                                        style={{ height: 30, width: 30, tintColor: 'white', margin: 10 }} />
                                </TouchableOpacity>
                                </View>

                                </View>

<View style={{position:'absolute', bottom:150}}>
<Text style={{color:'white', fontSize:20}}>Caption widjlkdsjljsdfklsjjdflsjfsdlfjslkj jfsdlkjflksklsdjlsjf
sdfjlskdjfkljkjdslkjfdlkjsfdkljdflksjflkj dksjflksjdflkjlkj</Text>

</View>


                                {/* bottom */}
                                <View style={styles.bottomView}>
                                    <TextInput placeholder='Reply'
                                    placeholderTextColor='white'

                                    value={reply}
                                    style={styles.replyInput}
                                    onChangeText={(txt)=>setReply(txt)}
                                    />
                                    <TouchableOpacity
                                    disabled={reply == ''?true:false}
                                onPress={()=>navigation.goBack()}
                                >
                                <Image source={require('../Images/send.png')}
                                        style={styles.sendBtn} />
                                </TouchableOpacity>

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
        height:height,
        width:width,
        // height:300,
        // width:300,
    },
    heading: {
        width:'100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position:'absolute',
        top:10,
        // left:10,
    },
    headingText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        paddingHorizontal: 16
    },
    bottomView:{
        flexDirection:'row',
        position:'absolute',
        bottom:0,
        height:80,
        width:'100%',
        backgroundColor:'black',
        alignItems:'center',
        justifyContent:'space-between'
    },
    userView:{
        position:'absolute',
        left:10,
        bottom:220,
        flexDirection:'row'
    },
    userName:{
        fontSize:23,
        fontWeight:'bold',
        color:'white',
        marginTop:20
    },
    sendBtn:{
        height:40,
        width:40,
        tintColor:'white',
        margin:15
    },
    replyInput:{
        borderWidth:1,
        borderColor:'white',
        width:'80%',
        borderRadius:10,
        margin:5,
        marginBottom:15,
    }
    
});

export default StoriesScreen