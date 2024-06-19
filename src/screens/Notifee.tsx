import { View, Text, Button } from 'react-native'
import React from 'react'
import notifee, { AndroidStyle } from '@notifee/react-native';

const Notifee = () => {
    const displayNotification = async()=>{
        // Request permissions (required for iOS)
        await notifee.requestPermission()
    
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });
    
        // Display a notification
        await notifee.displayNotification({
          title: 'Amazing Brithday Party',
          body: 'Please Join Us',
          android: {
            channelId,
            //smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
              id: 'default',
            },
            style: 
            { type: 
                AndroidStyle.BIGPICTURE, picture: 'https://cdn.cdnparenting.com/articles/2018/03/407263582-H-1024x700.webp' },
          },
        });
    }
  return (
    <View>
      <Text>Notifee</Text>
      <Button title='Send Notification' onPress={(displayNotification)}/>
    </View>
  )
}

export default Notifee