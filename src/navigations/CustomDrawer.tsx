import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomDrawer = (props) => {
    const navigation = useNavigation();
    const Logout =()=>{
        try {
            AsyncStorage.setItem('USER_DATA_ID', '')
          } catch (error) {
            console.log('error',error)
          }
          navigation.navigate('LoginScreen')
    }
  return (
    <DrawerContentScrollView {...props}>
    <View style={{ backgroundColor: '#202A55', padding: 15 }}>
        {/* User Row */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#cacaca', width: 50, height: 50, borderRadius: 25, marginRight: 15 }}></View>
            <View>
                <Text style={{ color: 'white', fontSize: 22 }}>Alice</Text>
                <Text style={{ color: 'white', fontSize: 12 }}>5.00*</Text>
            </View>
        </View>
        {/* Messages Row */}
        <View style={{
            borderTopWidth: 1, borderBottomWidth: 1,
            borderTopColor: '#919191', borderBottomColor: '#919191', paddingVertical: 5, marginVertical: 10
        }}>
            <Pressable onPress={() => navigation.navigate('Profile')}>
                <Text style={{ color: 'white', paddingVertical: 5 }}>Messages</Text>
            </Pressable>
        </View>
        {/* Do More Row */}
        <Pressable onPress={() => console.warn('Make Money Button')}>
            <Text style={{ color: '#dddddd', paddingVertical: 5 }}>Do More With Your Account</Text>
        </Pressable>
        {/* Make Money Row */}
        <Pressable onPress={() => console.warn('Make Money Button')}>
            <Text style={{ color: 'white', paddingVertical: 5 }}>Make Money Driving</Text>
        </Pressable>
        <Pressable onPress={() => Logout()}>
            <Text style={{ color: 'white', paddingVertical: 5 }}>Logout</Text>
        </Pressable>
    </View>
    <DrawerItemList {...props} />
</DrawerContentScrollView>
  )
}

export default CustomDrawer