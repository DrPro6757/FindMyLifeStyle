import { View, Text, Modal, PermissionsAndroid } from 'react-native'
import React,{useEffect, useRef, useState} from 'react'
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geocoder from 'react-native-geocoding'
import GetLocation from 'react-native-get-location';

const Maps = () => {
    const mapRef = useRef();
    const [marker, setMarker] = useState();
    const [address, setAddress] = useState();
    const [permissionGranted, setPermissionGranted] = useState(false)

    Geocoder.init('AIzaSyB5YFSQZi0QWAaDz0xtrcNvG_wD49ODxgk');
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
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('You can use the Location');
              getCurrentLocation();
            } else {
              console.log('Location permission denied');
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
            console.log('My Current Location ::'+location.longitude+','+location.latitude);
        })
        .catch(error => {
            const { code, message } = error;
            console.warn(code, message);
        })
    }
  return (
    <Modal
    visible={true}
    >
        <View
style={{
    padding:15,
    backgroundColor:'white',
    marginVertical:10,
    marginHorizontal:10,
}}
>
    <Text>
        Put Your Location Marker on Map{address}
    </Text>
</View>
    <View>
      <MapView ref={mapRef} 
      zoomControlEnabled={true}
      showsMyLocationButton={true}
      provider={PROVIDER_GOOGLE}
      style={{width:'100%', height:'100%', marginBottom:-70}}
  initialRegion={{
    latitude: 51.50663665777039,
    longitude: -0.13593092524952155,
    latitudeDelta: 0.015,
    longitudeDelta: 0.012,
    // 51.50663665777039, -0.13593092524952155
  }}
  onPress={e=>setMarker(e.nativeEvent.coordinate)}
  >
    {
        marker !== undefined ? <Marker coordinate={marker}/>: null
    }
</MapView>

    </View>
    </Modal>
  )
}

export default Maps
