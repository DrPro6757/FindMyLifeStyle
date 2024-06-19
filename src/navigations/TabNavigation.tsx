import { View, Text, Settings } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import HomeScreen from '../screens/HomeScreen';
// import SettingScreen from '../screens/SettingScreen';
// import EventsScreen from '../screens/EventsScreen';
// import PostEvent from '../screens/PostEvent';
// import ChatScreen from '../screens/ChatScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import ImageUpload from '../screens/ImageUpload';


const Tab = createBottomTabNavigator();
const TabNavigation = () => {
    // const Stack = createNativeStackNavigator();
    
// const stackFeed =()=>{
//     return(
//         <Stack.Navigator>
//         <Stack.Screen
//         name = "HomeScreen"
//         component = {HomeScreen}
//         />
//         </Stack.Navigator>
//     )
// }
  return (
    // <View>
    //    <Text> Navigation Screen </Text>
    // </View>
    <View>
        <Text>No result</Text>
    </View>
    // <NavigationContainer independent={true}>
    //     <Tab.Navigator
        
    //     >
    //     <Tab.Screen name = 'Profile' component={ProfileScreen}
    //     options={{headerShown:false}}
       
    //     />

    //         <Tab.Screen name = 'Explore' component={HomeScreen}
    //         // options={{
    //         //             tabBarLabel:'Home',
    //         //             tabBarIcon:({color, size})=>(
    //         //             <Text>Home Screen</Text>
                           
    //         //              ),
    //         //           }}
    //         />
    //         <Tab.Screen name = 'Events' component={EventsScreen}/>
    //         <Tab.Screen name = 'Post Event' component={PostEvent}/>
    //         <Tab.Screen name = 'Chats' component={ImageUpload}/>
    //         <Tab.Screen name = 'Settings' component={SettingScreen}/>

            

    //     </Tab.Navigator>
    // </NavigationContainer>
//     <NavigationContainer>
        
        
//     <Tab.Navigator>
//       <Tab.Screen name="HomeScreen" component={stackFeed} 
//       options={{
//         tabBarLabel:'Home',
//         tabBarIcon:({color, size})=>(
//             <Text>Home Screen</Text>
           
//         ),
//       }}
//       />
//       <Tab.Screen name="SettingScreen" component={SettingScreen} />
//     </Tab.Navigator>
//   </NavigationContainer>
  )
}
const Home = ()=>{
    return<View>
        <Text>Home Screen</Text>
    </View>
}
const Setting = ()=>{
    return<View>
        <Text>setting Screen</Text>
    </View>
}
export default TabNavigation