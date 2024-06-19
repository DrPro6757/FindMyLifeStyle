import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import Geocoder from 'react-native-geocoding'

// AIzaSyB5YFSQZi0QWAaDz0xtrcNvG_wD49ODxgk
const Address = () => {
    const getLocationData=()=>{
        Geocoder.init("AIzaSyB5YFSQZi0QWAaDz0xtrcNvG_wD49ODxgk");

        Geocoder.from(41.89, 12.49)
		.then(json => {
        		var addressComponent = json.results[0].address_components[0];
			console.log(addressComponent);
            Alert.alert('Address: '+addressComponent.long_name)
		})
		.catch(error => console.warn(error));
    }
   
  return (
    <View style={{justifyContent:'center', flex:1, alignItems:'center'}}>
        <TouchableOpacity onPress={()=>getLocationData()}
        style={{height:100, width:200, borderWidth:2, borderColor:'black', justifyContent:'center',
    alignItems:'center'}}>
        <Text>Address</Text>
        </TouchableOpacity>
      
    </View>
  )
}

export default Address