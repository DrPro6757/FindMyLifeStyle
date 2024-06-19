import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, StackActions } from '@react-navigation/native'
// import { TouchableOpacity } from 'react-native-gesture-handler';

const NotificationList = () => {
  const [myUserId, setMyUserId] = useState('');
  const [myNotifications, setMyNotifications] = useState('');

  const [updateNotification, setUpdateNotificaions] = useState(false);
  const [date, setDate] = useState('');
  let UserId = '';
  useEffect(() => {
    getUserId();
    getNotificationList();
  }, [updateNotification])

  const getUserId = async () => {
    UserId = await AsyncStorage.getItem("USERID");
    // myUserName = await AsyncStorage.getItem("NAME");
    // ProfileImage = await AsyncStorage.getItem('profileImage');
    // FcmToken = await AsyncStorage.getItem('MYFCMTOKEN');
    setMyUserId(UserId);
    // setMyUserName(myUserName);
    // setMyFcmToken(FcmToken);
    // setMyProfileImage(ProfileImage);
    console.log("my user id on Notification screen :: " + UserId);
    // console.log("my user fcm stored in event screen:: " + senderFcmToken);
  }
  const getNotificationList = async () => {
    let tempNotifications = []
    await firestore().collection('notifications').doc(myUserId)
      .get()
      .then(snapshot => {
        tempNotifications = snapshot._data;
        console.log("My Notification message content :: " + snapshot._data.messageTitle);
        setMyNotifications(snapshot._data)

        // const dt = snapshot._data.timeStamp
        // const x = dt.toISOString().split("T");
        // const x1 = x[0].split('-');
        // console.log(x1[2] + "/" + x1[1] + "/" + x1[0]);
        // setDate(x1[0] + "/" + x1[1] + "/" + x1[2]);

      })
      .catch(error => {
        console.log(error)
      });
    setUpdateNotificaions(true);
  }
  return (
    <View style={{flex:1, height: '100%', backgroundColor:'white' }}>    
    {/* <Text>Notification List For All Notifications {myNotifications.messageTitle}</Text> */}
    {/* '#1e1e1e' */}
    <View style={{flex:1, height:'90%', marginBottom:10}}>
      {
        myNotifications !== undefined ?
          <FlatList
            data={myNotifications.messageTitle}
            renderItem={({ item, index }) => {
              return (
                <View //key={index}
                  style={{
                    width: '95%', height: 70, borderWidth: 2, borderColor: 'orange', borderRadius: 15,
                    margin: 10, backgroundColor: 'white',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.8,
                    shadowRadius: 20,
                    elevation: 12,
                  }}
                >
                  <View style={{ flex: 1, width: '90%', height: 70, margin: 10, flexWrap:'nowrap' }}>
                  <TouchableOpacity>
                    <View style={{flexDirection:'row'}}>
                      {/*  */}
                    <Image source={require('../Images/logoFml.png')}
                      style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: 'blue', margin: 3 }}
                    />
                    <Text style={{ fontSize: 12, color: 'black', fontWeight: '600', margin: 5 }}>
                          {item}
                        </Text>
                    {/* {
                      item.length > 0 ?
                        <Text style={{ fontSize: 12, color: 'black', fontWeight: '600', margin: 5 }}>
                          {item.messageTitle}
                        </Text>
                        :
                        <Text style={{ fontSize: 15, color: 'black', fontWeight: '600', margin: 5 }}>
                          Thanks for being part of our Community
                        </Text>
                    } */}

                    {/* <Text style={{ fontSize: 15, color: 'black', fontWeight: '600', margin: 10 }}>
           {item.date}
         </Text> */}
</View>
</TouchableOpacity>
                  </View>
                </View>

              )
            }}
            
          />
          :
          <View style={{justifyContent:'center', alignItems:'center'}}>
            <Text style={{ fontSize: 15, color: 'white', fontWeight: '600', margin: 5 }}>
            No Notifications To Show
          </Text>
          </View>
          

      }
</View>
    </View>
  )
}

export default NotificationList