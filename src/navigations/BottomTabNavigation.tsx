import { View, Text, Image, Button, TouchableOpacity } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MapScreen from '../ScreensCustom/MapScreen';
import UsersProfile from '../ScreensCustom/UsersProfile';
import AddPostCustom from '../ScreensCustom/AddPostCustom';
import AllUserData from '../ScreensCustom/AllUserData';
import LiveScreen from '../ScreensCustom/LiveScreen';
import UsersFeed from '../ScreensCustom/UsersFeed';
import PostScreen from '../ScreensCustom/PostScreen';
import MapScreenTest from '../ScreensCustom/MapScreenTest';
import ReelScreen from '../ScreensCustom/ReelScreen';

const BottomTabNavigation = ({navigation}) => {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
    // initialRouteName='MapScreen'
    // screenOptions={{headerShown: false}}
    screenOptions={{
      // headerShown: false,
      // gestureEnabled: true,
      // gestureDirection: 'horizontal',
    
      tabBarStyle: {
        backgroundColor: '#202A55',//#202A55 3E48A0
      },
    }}
    >
   

        <Tab.Screen
        name = "MapScreen"
        component={MapScreen}
        options={{
            headerShown: true,
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: '#202A55'
            },
            title:'EVENTS',
            headerTitleAlign: 'center',

        tabBarIcon: ({ focused, color, size }) => {
            // let iconName;
            // if (route.name === 'Home') {
            //   iconName = focused
            //     ? 'ios-information-circle'
            //     : 'ios-information-circle-outline';
            // } else if (route.name === 'Settings') {
            //   iconName = focused ? 'ios-list' : 'ios-list-outline';
            // }

            // You can return any component that you like here!
            return  <Image source={require('../Images/globe.png')}
            style={{height:32, width:32}}
            //tintColor:focused?'blue':'green'
           />;
          },

          headerLeft: (props) =>
          <TouchableOpacity onPress={()=>navigation.openDrawer()}>
            <Image source={require('../Images/list.png')} style={{height:35, width:35, margin:10
            ,tintColor:'orange'}}/>
          </TouchableOpacity>,
           headerRight: (props) =>
           <TouchableOpacity onPress={()=>navigation.openDrawer()}>
             <Image source={require('../Images/logoFml.png')} style={{height:45, width:45, margin:10
             }}/>
           </TouchableOpacity>
        }}

        />
        <Tab.Screen
        name = "Live"
        component={LiveScreen}
        options={{
          headerShown: true,
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: '#202A55'
            },
            title:'LIVE',
            headerTitleAlign: 'center',

      tabBarIcon: ({ focused, color, size }) => {
          // You can return any component that you like here!
          return  <Image source={require('../Images/live.png')}
          style={{height:32, width:32}}
         />;
        },
        headerLeft: (props) =>
          <TouchableOpacity onPress={()=>navigation.openDrawer()}>
            <Image source={require('../Images/list.png')} style={{height:35, width:35, margin:10
            ,tintColor:'orange'}}/>
          </TouchableOpacity>,
           headerRight: (props) =>
           <TouchableOpacity onPress={()=>navigation.openDrawer()}>
             <Image source={require('../Images/logoFml.png')} style={{height:45, width:45, margin:10
             }}/>
           </TouchableOpacity>
      }}
        />
        
          <Tab.Screen
        name = "Post"
        component={PostScreen}
        options={{
          headerShown: true,
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: '#202A55'
            },
            title:'POST',
            headerTitleAlign: 'center',

            tabBarIcon: ({ focused, color, size }) => {
              // You can return any component that you like here!
              return  <Image source={require('../Images/post.png')}
              style={{height:32, width:32}}
             />;
            },
            headerLeft: (props) =>
            <TouchableOpacity onPress={()=>navigation.openDrawer()}>
              <Image source={require('../Images/list.png')} style={{height:35, width:35, margin:10
              ,tintColor:'orange'}}/>
            </TouchableOpacity>,
             headerRight: (props) =>
             <TouchableOpacity onPress={()=>navigation.openDrawer()}>
               <Image source={require('../Images/logoFml.png')} style={{height:45, width:45, margin:10
               }}/>
             </TouchableOpacity>
          
        }}
        />
         <Tab.Screen
        name = "Folks"
        component={UsersFeed}
        options={{
          headerShown: true,
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: '#202A55'
            },
            title:'FOLKS',
            headerTitleAlign: 'center',

      tabBarIcon: ({ focused, color, size }) => {
          // You can return any component that you like here!
          return  <Image source={require('../Images/usersIcon.png')}
          style={{height:32, width:32}}
         />;
        },
        headerLeft: (props) =>
          <TouchableOpacity onPress={()=>navigation.openDrawer()}>
            <Image source={require('../Images/list.png')} style={{height:35, width:35, margin:10
            ,tintColor:'orange'}}/>
          </TouchableOpacity>,
           headerRight: (props) =>
           <TouchableOpacity onPress={()=>navigation.openDrawer()}>
             <Image source={require('../Images/logoFml.png')} style={{height:45, width:45, margin:10
             }}/>
           </TouchableOpacity>
      }}
        />
        <Tab.Screen
        name = "Profile"
        component={UsersProfile}
        options={{
          headerShown: true,
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: '#202A55'
            },
            title:'PROFILE',
            headerTitleAlign: 'center',

      tabBarIcon: ({ focused, color, size }) => {
          // You can return any component that you like here!
          return  <Image source={require('../Images/user.png')}
          style={{height:32, width:32, tintColor:'orange'}}
         />;
        },
        headerLeft: (props) =>
          <TouchableOpacity onPress={()=>navigation.openDrawer()}>
            <Image source={require('../Images/list.png')} style={{height:35, width:35, margin:10
            ,tintColor:'orange'}}/>
          </TouchableOpacity>,
           headerRight: (props) =>
           <TouchableOpacity onPress={()=>navigation.openDrawer()}>
             <Image source={require('../Images/logoFml.png')} style={{height:45, width:45, margin:10
             }}/>
           </TouchableOpacity>
      }}
        />
         {/* <Tab.Screen
        name = "Post Event"
        component={AddPostCustom}
        options={{
          headerShown: true,
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: '#202A55'
            },
            title:'PROFILE',
      tabBarIcon: ({ focused, color, size }) => {
          // You can return any component that you like here!
          return  <Image source={require('../Images/user.png')}
          style={{height:32, width:32, tintColor:'orange'}}
         />;
        },
        headerLeft: (props) =>
          <TouchableOpacity onPress={()=>navigation.openDrawer()}>
            <Image source={require('../Images/list.png')} style={{height:20, width:20, margin:10
            ,tintColor:'white'}}/>
          </TouchableOpacity>
      }}
        /> */}
    </Tab.Navigator>

  )
}

export default BottomTabNavigation