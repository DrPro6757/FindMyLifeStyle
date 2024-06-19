import { View, Text, TouchableOpacity, Button, Alert } from 'react-native'
import React from 'react'
import EventsScreen from './EventsScreen'
import PropTest from './PropTest'

const MyEventList = (listProps) => {

   
    const TestFunction=()=>{
        Alert.alert('My Event List function');
    }
  return (
    <View>
        <Button  title='Get Data' onPress={()=>listProps.myprop()}/>
      <Text>My Event List Data Here</Text>
      <PropTest sendTest={TestFunction}/>
    </View>
  )
}

export default MyEventList