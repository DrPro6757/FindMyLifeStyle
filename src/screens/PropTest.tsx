import { View, Text, Button, Alert } from 'react-native'
import React from 'react'
import MyEventList from './MyEventList';

const PropTest = (props) => {
  return (
    <View>
      <Button title='Dont know' onPress={()=>props.sendTest()}
       />
      
      {/* <Button title='Dont know this' />
      
      <Button title='Dont know that' /> */}
      {/* <MyEventList showMe={TestFunction()}/> */}
    </View>
  )
}

export default PropTest