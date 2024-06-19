import { View, Text } from 'react-native'
import React from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const Fast = () => {
  return (
    <View style={{height:'100%', backgroundColor:'blue'}}>
      <GooglePlacesAutocomplete 
      placeholder='Search'
      fetchDetails
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: 'AIzaSyB1gq6OAkoDnUzynbrjpbXKIdwYL5iX4z4',
        language: 'en',
      }}
    />
    </View>
  )
}

export default Fast