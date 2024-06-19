import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const MyDataScreen = () => {
  const [myUserData, setMyUserData] = useState([])
  useEffect(() => {
    getMyData()
  }, [])
  const getMyData=()=>{
    axios.get('http://10.0.2.2:8000/api/users/6639fcc4e42506e0b5c65f0e')
    .then((res)=>{
      console.log('My User Data :: ', res.data)
      setMyUserData(res.data);
    })
    .catch((error)=>{
      console.log('Please check your email id or password ', error)
    })
  }
  return (
    <View>
      <Text>MyDataScreen</Text>
      <Text>{myUserData.name}</Text>
    </View>
  )
}

export default MyDataScreen