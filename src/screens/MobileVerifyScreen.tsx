import { View, Text, TextInput, Button, Alert } from 'react-native'
import React,{useState} from 'react'
import { StackActions, useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
const MobileVerifyScreen = () => {

    const [mobileNo, setMobileno] = useState("");
    const [otpInput, setOtpInput] = useState("");
    const [confirmData, setConfirmData] = useState("");
    


    const sendOTP = async() =>{
        try {
            const mobile = '+92' + mobileNo;
            const response = await auth().signInWithPhoneNumber(mobile);
            setConfirmData(response); 
            console.log(response);
            Alert.alert("otp has been sent please verify");
        } catch (error) {
            console.log(error);
        }
    }
    const submitOTP = async() =>{
        try {
            const response = await confirmData.confirm(otpInput);
            console.log(response);
            Alert.alert('your number has been verified');
        } catch (error) {
            console.log(error);
        }
    }



  return (
    <View style = {{flex:1, justifyContent:'center', alignItems:'center'}}>
      <TextInput style={{borderWidth:2, width:'70%', marginVertical:10}}
       placeholder='Enter Your Mobile No'
       onChangeText={(value)=>setMobileno(value)}
      />
      <Button title='Send OTP' onPress={()=> sendOTP()}/>
      <TextInput style={{borderWidth:2, width:'70%', marginVertical:10}}
       placeholder='Enter Your OTP'
       onChangeText={(value)=>setOtpInput(value)}
      />
      <Button title='Submit' onPress={()=>submitOTP()}/>
    </View>
  )
}

export default MobileVerifyScreen