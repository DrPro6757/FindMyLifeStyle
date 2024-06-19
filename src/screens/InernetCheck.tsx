import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
const InernetCheck = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnectedCheck, setIsConnectedCheck] = useState(false);
const netInfo = useNetInfo();
    useEffect(() => {
//         const unsubscribe = NetInfo.addEventListener(state => {
//             console.log("Connection type", state.type);
//             console.log("Is connected?", state.isConnected);
//           });
          
// return()=>{
//     unsubscribe();
// }; 
      
    }, []);
    
  return (
    <View style = {{flex:1, backgroundColor:netInfo.isConnected ? 'green': 'red'}}>
      <Text>
        InernetCheck = {   netInfo.isConnected ? 'Connected'

            // setIsConnectedCheck(!isConnectedCheck) 
            :
            'Please Connect to Internet'
            
        }

      </Text>
    </View>
  )
}

export default InernetCheck