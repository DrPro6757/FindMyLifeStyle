// import { View, Text } from 'react-native'
// import React from 'react'
// import messaging from '@react-native-firebase/messaging';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// //  async function requestUserPermission() {
// //     const authStatus = await messaging().requestPermission();
// //     const enabled =
// //         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
// //         authStatus === messaging.AuthorizationStatus.PROVISIONAL;

// //     if (enabled) {
// //         console.log('Authorization status:', authStatus);
// //     }
// // }
// const Notifications = async () => {
//     // let fcmToken = await messaging().getToken();
//     let fcmToken = await AsyncStorage.getItem('fcmToken');
//     console.log(fcmToken, "the old token")
//     if (!fcmToken) {
//         try {
//             let fcmToken = await messaging().getToken();

//             if (fcmToken) {
//                 console.log(fcmToken, "new generated token");
//                 await AsyncStorage.setItem('fcmToken', fcmToken);
//             }

//         } catch (error) {
//             console.log(error, 'error raised in fcmToken');
//         }
//     }
// }

// export default Notifications