import { View, Alert, StyleSheet, Text, TouchableOpacity, Image, ScrollView, FlatList, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation, StackActions } from '@react-navigation/native';
import Auth from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

import { firebase } from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventsScreen from './EventsScreen';
import Notifications from './Notifications';
import notifee, { AndroidStyle } from '@notifee/react-native';
import axios from 'axios';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
messaging().getInitialNotification();

let userId = '';
const Main = () => {
    const [userList, setUserslist] = useState();
    const [imageData, setImageData] = useState('');
    const [onFollowClick, setOnFollowClick] = useState(false); 
    useEffect(() => {
        getDatabase();
        getUserId();
        getUserData();
        Notifications();
    }, [onFollowClick])
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
        //   Alert.alert('A new FCM message arrived! in foreground mode', JSON.stringify(remoteMessage));
        displayNotification(remoteMessage);
        });
    
        return unsubscribe;
      }, []);
      const getUserId = async()=>{
        userId =await AsyncStorage.getItem("USERID");
        console.log("my user id stored in event screen:: "+userId);
      }
      const displayNotification = async(data)=>{
        // Request permissions (required for iOS)
        await notifee.requestPermission()
    
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });
    
        // Display a notification
        await notifee.displayNotification({
          title: data.notification.title,
          body: data.notification.body,
          android: {
            channelId,
            //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
              id: 'default',
            },
            // style: 
            // { type: 
            //     AndroidStyle.BIGPICTURE, picture: 'https://cdn.cdnparenting.com/articles/2018/03/407263582-H-1024x700.webp' 
            // },
          },
        });
    }
    const getDatabase = async () => {
        try {
            const data = await firestore().collection('users').doc(auth().currentUser?.uid).
                get();
            // setMyData(data._data);
            const name = data._data.name;
            const email = data._data.email;
            const id = data._data.id;
            const profileImage = data._data.profileImage;
            setImageData(profileImage);
            goToNext(name, email, id, profileImage);
            console.warn("My User ID Stored :" + id);
            // console.warn("My User ID Stored :" +AsyncStorage.getItem("USERID"));

            // console.log('profileName =' + name);
            // console.log('user Image =' + profileImage);
        } catch (error) {
            // console.log(error);
        }
    }
    const goToNext = async (name, email, id, profileImage) => {
        name = await AsyncStorage.setItem("NAME", name);
        email = await AsyncStorage.setItem("EMAIL", email);
        id = await AsyncStorage.setItem("USERID", id);
        profileImage = await AsyncStorage.setItem("profileImage", profileImage);
    }
    const getUserData = async () => {
        let tempUsers = [];
       
        // console.log("set my user id : " + userId);

        // firestore().collection('users').where('id', '!=', userId).get()
        // .then(res => {
        //     if (res.docs != []) {
        //         res.docs.map(item=>{
        //             tempUsers.push(item.data());
        //         });
        //     }
        //     setUserslist(tempUsers);
        // });

        firestore().
            collection("users").get()
            .then(
                querySnapshot => {
                    querySnapshot._docs.map(item => {
                        if (item._data.id !== userId) {
                            tempUsers.push(item);
                            console.log("temp users profile iMage :" + item._data.profileImage);
                        }
                    }

                    );
                    setUserslist(tempUsers);

                }
            );
    }
    // follow or friend add in db
    const followUser = async (item) => {
        let tempFollowers = item._data.followers;

        let tempFollowing = [];
        // firestore().collection('users').doc(userId).get()
        //     .then(snapchot => {
        //         // console.log("following in my db"+snapchot.data().follwoing);

        //         tempFollowing = snapchot.data().follwoing;
        //     });
        // if (tempFollowing.length > 0) {
        //     console.log("following in my db more than 1 " + tempFollowing.length);
        //     tempFollowing.map(item2 => {
        //         // if (item2 === item._data.id) {
        //             let index2 = tempFollowing.indexOf(item._data.id);
        //             if (index2 > -1) {
        //                 tempFollowing.splice(index2, 1)

        //             }
        //             // else {
        //             //     tempFollowing.push(item._data.id);
        //             //     console.log("following in my db added " + item._data.id);
        //             // }
        //             console.log("following in my db deleted " + item._data.id);
  
        //         // } 
        //         // else {
        //         //     tempFollowing.push(item._data.id);
        //         //     console.log("following in my db added " + item._data.id);
        //         // }
        //     })
        // } 
        // if (tempFollowing.length > 0) {
        //     tempFollowing.map(item2 => {
        //         if (item2 === item._data.id) {
        //             let index2 = tempFollowing.indexOf(item2);
        //             if (index2 > -1) {
        //                 tempFollowers.splice(index2, 1);
        //             }
        //             console.log("following deleted " + tempFollowing);
        //         } 
        //         // else {
        //         //     tempFollowers.push(userId);
        //         //     console.log("follower added " + tempFollowers);
        //         // }
        //     });
        // }
        // else
        // // if (tempFollowing.length == 0) 
        // {
        //     tempFollowing.push(item._data.id);
        //     console.log("following in my db added " + item._data.id);
        // }
        // firestore()
        //     .collection('users')
        //     .doc(auth().currentUser?.uid)
        //     .update({
        //         following: tempFollowing,
        //     }).then(res => {

        //     }

        //     ).catch(error => {
        //         console.log(error);
        //     })







        if (tempFollowers.length > 0) {
            tempFollowers.map(item1 => {
                if (item1 === userId) {
                    let index = tempFollowers.indexOf(item);
                    if (index > -1) {
                        tempFollowers.splice(index, 1);
                    }
                    console.log("follower deleted " + tempFollowers);
                } 
                // else {
                //     tempFollowers.push(userId);
                //     console.log("follower added " + tempFollowers);
                // }
            });
        }
        else {
            if(tempFollowers!== userId){
                tempFollowers.push(userId);
                console.log("follower 2 added " + tempFollowers[2]);
            }
           
        }
        firestore()
            .collection('users')
            .doc(item._data.id)
            .update({
                followers: tempFollowers,
            }).then(res => {

            }

            ).catch(error => {
                console.log(error);
            })

            setOnFollowClick(!onFollowClick);
            // getUserData();
    }
    // const {email, uid} = route.params; 
  
    const token = 'eI9vN72OTKWvzatIuQwh33:APA91bHDAzyZatlNxH69H9E4P_NgSbLhOZ4g8vDZL38YSgt95I7LW6M6LpX9pdb0-DiVFo7SOFGelzs8tmh6DeJf6A98v3uTaEDdCqSK4N1z8s3sSuuHOa3uEaN18LA9D4PoahZX17du'
    const sendNotification=async(token)=>{
        // var axios = require('axios');
        var data = JSON.stringify({
            data:{},
            notification:{
            body:'click to opent post by ash',
            title:'new post added by ash',
        },
        to:token,
        });
        var config ={
            method: 'post',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers:{
                Authorization:
                'key=AAAAZflHU5c:APA91bGirnbXx_FqDR8OoT4-MZPBSYJxn794pqiwZDhi7dUkYAfsxPUd3bQMY0z5Q7KG52PvmYguWRAEGGe94cZvzu32vjMst8g7cuL3triz2mMf9d0oT2U3QhuSeH5bobmuSVBKYdne',
                'Content-Type':'application/json',
            },
            data:data,
        };
        axios(config)
        .then(function(response){
            console.log(JSON.stringify(response.data));
        })
        .catch(function (error){
            console.log(error)
        });
    };
    const getFollowStatus = (followers) => {
        let status = false;
        // if (followers.length > 0) {
        followers.map(item => {
            if (item == userId) {
                status = true;
                console.log('followed by user id '+userId);
            } else {
                status = false;
                
            }
        });
        // }

        return status;
    };
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
            <View style={styles.topBar}>
                <Text style={styles.heading}>Explore</Text>
                {/* <Text style={[styles.heading,{justifyContent:'flex-end'}]}>Search</Text> */}
            </View>
            <View style={styles.list}>
                <FlatList
                    style={{ height: '100%' }}
                    data={userList}
                    numColumns={1}
                    renderItem={({ item, index }) => {
                        return (
                            <View style={styles.userContainer}>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                {/* <Image source={{uri: item._data.profileImage}}
                      style={styles.user_Image} /> */}
                    {/* {
                      imageData === '' ?
                      (<Image source={(require('../Images/user.png'))}
                      style={styles.user_Image} />)
                      
                      
                      : item._data.profileImage !== '' ?
                    //   <Image src={item.img}

                    (<Image source={{item._data.profileImage ==""?(require('../Images/user.png')) : uri: item._data.profileImage}}
                      style={styles.user_Image} />)
                    //   :
                    //   (<Image source={(require('../Images/user.png'))}
                    //   style={styles.user_Image} />)
                    } */}
                    <Image 
                    source={item._data.profileImage ==""?(require('../Images/user.png')) : {uri: item._data.profileImage}}
                      style={styles.user_Image} 
                      />
                
                                <View style={{ marginBottom: 20, flexDirection: 'row' }}>
                                    <Text style={styles.userText}>
                                        {item._data.name},</Text>
                                </View>
                                </View>
                                <View>
                                    <View style={styles.userButtonView}>
                                        <TouchableOpacity style={styles.userButton}
                                            onPress={() => followUser(item)}
                                        >
                                            <Text
                                                style={{ color: '#fff', fontSize: 14, margin: 10, fontWeight: '700' }}
                                            >
                                                {/* Follow */}
                                                {
                                                    getFollowStatus(item._data.followers) == true
                                                        ? 'unFriend'
                                                        :'Add Friends'
                                                }
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.userButton}
                                        onPress={()=>sendNotification(token)}
                                        >
                                            <Text
                                                style={{ color: '#fff', fontSize: 12, margin: 10, fontWeight: '700' }}>
                                                Send Notification
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>



                            </View>
                        )
                    }}

                />
            </View>
        </View>

    )
}
const styles = StyleSheet.create({
    addButton: {
        backgroundColor: 'red',
        alignItems: 'center',
        padding: 10,
        marginVertical: 10,
        borderRadius: 50,
    },
    userContainer: {
        justifyContent: 'center',
        backgroundColor: '#30313A',
        // backgroundColor:'white',
        width: 400,
        height: 115,
        borderWidth: .5,
        borderColor: '#ff8501',
        borderRadius: 25,
        marginVertical: 5,
    },
    userMapping: {
        marginLeft: 10,
    },
    userText: {
        fontSize: 30,
        fontWeight: '700',
        marginLeft: 20,
        color: 'white'
    },
    userButtonView: {
        flexDirection: 'row',
        marginLeft: 100,
        marginBottom: 20,
    },
    userButton: {
        backgroundColor: '#4867A9',
        borderRadius: 10,
        height: 35,
        width: 110,
        marginLeft: 10
    },
    user_Image: {
        width: 82,
        height: 82,
        borderRadius: 41,
        margin: 8,
        borderWidth: .2,
        borderColor: '#ff8501',
        justifyContent: 'center'
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
    topBar: {
        height: 110,
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        flexDirection: 'row',
    },
    heading: {
        fontSize: 30,
        fontWeight: '800',
        color: 'white',
        marginLeft: 20,
        marginTop: 50,
    },
    list: {
        marginTop: 5,
        height: 500,
        marginBottom: 110
    }
});
export default Main
//new permission
//allow read, write: if request.time #timestamp.date(2020, 9, 10);
//previous
//allow read, write: if true;