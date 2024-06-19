import { View, Text, StyleSheet, TextInput, Dimensions, PermissionsAndroid,TouchableOpacity, StatusBar, Modal, FlatList, Alert, ScrollView, Image, KeyboardAvoidingView } from 'react-native'
import React, { isValidElement, useEffect, useState } from 'react'
import GetLocation from 'react-native-get-location';
import { useNavigation, StackActions } from '@react-navigation/native';
const LocationUser = () => {
    const navigation = useNavigation();
    const [marker, setMarker] = useState();
    const [permissionGranted, setPermissionGranted] = useState(false)
    const [getLongitutde, setGetLongitude] = useState(0);
    const [getLatitude, setGetLatitude] = useState(0);
    const [locationStatus, setLocationStatus] = useState('');
    const statusLoc = '';
    useEffect(() => {
        //  if(marker!==undefined){
        //     Geocoder.from(marker.latitude, marker.longitude).then(data=>{
        //         let fetchedAddress = data.results[0].formatted_address;
        //         setAddress(fetchedAddress);
        //         console.log('Address '+fetchedAddress);
        //     });
        //  }
        GetLocationPermissionFromUser();
        }, [marker])
    if(!permissionGranted){
        return
        <View>
            <Text>Please Allow Persmission</Text>
        </View>
    }
    async function GetLocationPermissionFromUser() {
        
    // }
    // const GetLocationPermissionFromUser=async()=>{
        try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                title: 'Location Permission',
                message:
                  'Location Permission.',
                // buttonNeutral: 'Ask Me Later',
                // buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('You can use the Location');
              getCurrentLocation();
              setLocationStatus('granted')
              
            } else {
              console.log('Location permission denied');
            //   Alert.alert('Please Give Access to your Location');
              navigation.navigate('SignUpScreen');
            }
          } catch (err) {
            console.warn(err);
          }
    }
    async function getCurrentLocation() {
        
    // }
    // const getCurrentLocation=()=>{
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
            
        })
        .then(location => {
            console.log('My Current Location In numbers::'+location.longitude+','+location.latitude);
            setGetLongitude(location.longitude);
            setGetLatitude(location.latitude);
            
            console.log('My Current Location ::'+getLongitutde+','+getLatitude);
            console.log('Status '+ locationStatus)
            
            navigation.navigate('SignUpScreen');

        })
        .catch(error => {
            const { code, message } = error;
            console.warn(code, message);
        })
    }
    
  return (
    <View>
      <Text>LocationUser</Text>
    </View>
  )
}

export default LocationUser