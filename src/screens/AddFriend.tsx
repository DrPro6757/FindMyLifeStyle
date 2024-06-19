import { View, Alert, StyleSheet, Text, TouchableOpacity, Image, ScrollView, FlatList, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation, StackActions } from '@react-navigation/native';
import Auth from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';

import AsyncStorage from '@react-native-async-storage/async-storage';
import EventsScreen from './EventsScreen';
import Notifications from './Notifications';
import notifee, { AndroidStyle } from '@notifee/react-native';
import axios from 'axios';
import Loader from './Loader';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
});
messaging().getInitialNotification();

let userId = '';
let friendId = '';
let friendName = '';
const AddFriend = () => {
    const [userList, setUserslist] = useState(null);
    const [imageData, setImageData] = useState('');
    const [following, setFollowing] = useState('');
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
    const getUserId = async () => {
        userId = await AsyncStorage.getItem("USERID");
        console.log("my user id stored in event screen:: " + userId);
    }
    const displayNotification = async (data) => {
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
            // goToNext(name, email, id, profileImage);
            console.warn("My User ID Stored And Set Asynchronysly:" + id);
        } catch (error) {
            console.log(error);
        }
    }
    // const goToNext = async (name, email, id, profileImage) => {
    //     name = await AsyncStorage.setItem("NAME", name);
    //     email = await AsyncStorage.setItem("EMAIL", email);
    //     id = await AsyncStorage.setItem("USERID", id);
    //     profileImage = await AsyncStorage.setItem("profileImage", profileImage);
    // }
    const getUserData = async () => {
        let tempUsers = [];

        firestore().
            collection("users").get()
            .then(
                querySnapshot => {
                    querySnapshot._docs.map(item => {
                        if (item._data.id !== userId) {
                            tempUsers.push(item);
                            // console.log("temp users profile iMage :" + item._data.profileImage);
                        }
                    }

                    );
                    setUserslist(tempUsers);
                }
            );
    }
    const Follow = async () => {
        let tempFollowing = [];
        if (tempFollowing.length >= 1) {
            tempFollowing.map(item2 => {
                if (item2 === item._data.id) {

                    let index2 = tempFollowing.indexOf(item2);
                    if (index2 > -1) {
                        tempFollowing.splice(index2, 1);
                        console.log("following deleted ////////////" + tempFollowing);
                    }
                    // else {
                    //     tempFollowing.push(item._data.id);
                    //     console.log("following added 2nd time" + tempFollowing[item._data.id]);
                    // }

                }
                else {
                    tempFollowing.push({ item2 });
                    console.log("following added 2nd time" + tempFollowing[item._data.id]);
                }
            });
        }
        else {
            tempFollowing.push({ friendId });
            // tempFollowing.push()
            console.log("Following added ////////////////////" + tempFollowing[item._data.id]);
        }

        firestore()
            .collection('users')
            .doc(auth().currentUser?.uid)
            .update({
                following: [tempFollowing],
            }).then(res => {

            }

            ).catch(error => {
                console.log(error);
            })
        // firestore().collection('users').doc(userId)
        // .get()
        // .then(snapshot => {
        //     tempFollowing = snapshot._data.following;
        //     console.log("bring me following list :: "+tempFollowing);
        // })
        // .catch(error => {
        //     console.log(error)
        // });
        setOnFollowClick(!onFollowClick);
    }
    const token = 'eI9vN72OTKWvzatIuQwh33:APA91bHDAzyZatlNxH69H9E4P_NgSbLhOZ4g8vDZL38YSgt95I7LW6M6LpX9pdb0-DiVFo7SOFGelzs8tmh6DeJf6A98v3uTaEDdCqSK4N1z8s3sSuuHOa3uEaN18LA9D4PoahZX17du'
    const sendNotification = async (token) => {
        // var axios = require('axios');
        var data = JSON.stringify({
            data: {},
            notification: {
                body: 'click to opent post by ash',
                title: 'new post added by ash',
            },
            to: token,
        });
        var config = {
            method: 'post',
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {
                Authorization:
                    'key=AAAAZflHU5c:APA91bGirnbXx_FqDR8OoT4-MZPBSYJxn794pqiwZDhi7dUkYAfsxPUd3bQMY0z5Q7KG52PvmYguWRAEGGe94cZvzu32vjMst8g7cuL3triz2mMf9d0oT2U3QhuSeH5bobmuSVBKYdne',
                'Content-Type': 'application/json',
            },
            data: data,
        };
        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error)
            });
    };

    return (
        
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
            
            <View style={styles.topBar}>
                <Text style={styles.heading}>Explore</Text>
                {/* <Text style={[styles.heading,{justifyContent:'flex-end'}]}>Search</Text> */}
            </View>
            <View style={{ borderBottomWidth: 2, borderBottomColor: 'white', width: '100%' }}>

            </View>
            <View style={styles.list}>
                {
                    userList!==null ?
                        <FlatList
                            style={{ height: '100%' }}
                            data={userList}
                            numColumns={1}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={styles.userContainer}>
                                        <View style={{ flex: 1, flexDirection: 'row' }}>
                                            <Image
                                                source={
                                                    item._data.profileImage == '' ? (require('../Images/user.png')) 
                                                : 
                                                { uri: item._data.profileImage }
                                            }
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
                                                    onPress={() => Follow()}
                                                >
                                                    <Text
                                                        style={{ color: '#fff', fontSize: 14, margin: 10, fontWeight: '700' }}
                                                    >
                                                        Follow

                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.userButton}
                                                    onPress={() => sendNotification(token)}
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

                        /> :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, fontWeight: '600' }}>No People To Show</Text>
                        </View>
                }

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
        width: '100%',
        height: 130,
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
        marginTop: 20,
        color: 'white'
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
        marginLeft: 10
    },
    user_Image: {
        width: 82,
        height: 82,
        borderRadius: 41,
        margin: 8,
        borderWidth: .2,
        borderColor: '#ff8501',
        justifyContent: 'center',
        tintColor:'white'
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
export default AddFriend
//new permission
//allow read, write: if request.time #timestamp.date(2020, 9, 10);
//previous
//allow read, write: if true;