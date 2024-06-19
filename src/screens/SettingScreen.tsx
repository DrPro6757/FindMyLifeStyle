import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react';
import {useRoute, useNavigation, StackActions} from '@react-navigation/native';
import Auth from '@react-native-firebase/auth';
const SettingScreen = () => {
    const navigation = useNavigation();
  return (
    <View>
      <Text>SettingScreen</Text>
      <TouchableOpacity style={styles.addButton} 
      onPress={async()=>{await Auth().signOut();
      navigation.dispatch(StackActions.push('LoginScreen'));
      // navigation.navigate('LoginScreen');
      }}
      >
          <Text style={{ color: '#fff', fontSize: 22 }}>Sign Out</Text>
        </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
    addButton: {
      backgroundColor: 'red',
      alignItems: 'center',
      padding: 10,
      marginVertical:10,
      borderRadius: 50,
    },
  });
export default SettingScreen