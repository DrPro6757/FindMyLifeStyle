// In App.js in a new project

import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import Auth from '@react-native-firebase/auth'
import { useState } from 'react';
import SplashScreen from '../screens/SplashScreen';
import MobileVerifyScreen from '../screens/MobileVerifyScreen';
import ImageUpload from '../screens/ImageUpload';
import TabNavigation from './TabNavigation';
import TabNavigationCustom from './TabNavigationCustom';
import Messages from '../screens/Messages';
import NotificationList from '../screens/NotificationList';
import EventsScreen from '../screens/EventsScreen';
import PostEvent from '../screens/PostEvent';
import MyEvents from '../screens/MyEvents';
import LocationUser from '../screens/LocationUser';
import ProfileScreen from '../screens/ProfileScreen';
import SingupNew from '../screens/SingupNew';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ExploreEvents from '../screens/ExploreEvents';
import FriendsScreen from '../screens/FriendsScreen';
import ChatScreen from '../screens/ChatScreen';
import CustomNavigator from '../ScreensCustom/CustomNavigator';
import MyData from '../ScreensCustom/MyDataScreen';
import MyDataScreen from '../ScreensCustom/MyDataScreen';
import AllUserData from '../ScreensCustom/AllUserData';
import AddPost from '../ScreensCustom/AddPost';
import MapScreen from '../ScreensCustom/MapScreen';
import UsersProfile from '../ScreensCustom/UsersProfile';
import AddPostCustom from '../ScreensCustom/AddPostCustom';
import CommentsEvents from '../ScreensCustom/CommentsEvents';
import EditProfile from '../ScreensCustom/EditProfile';

const Stack = createNativeStackNavigator();

function MainNavigator() {

  const [IsUserLogin, setIsUserLogin] = useState(false);

  Auth().onAuthStateChanged((user) => {
    if (user !== null) {
      setIsUserLogin(true);
    }
  });
  // const Drawer = createDrawerNavigator();
  const StackNav = () => {
    return (  <Stack.Navigator>

      {/* <Stack.Screen name="MobileVerifyScreen" component={MobileVerifyScreen}
        options={{headerShown:false}}
        />  
      
        
         <Stack.Screen name="LocationUser" component={LocationUser}
        options={{headerShown:false}}
        /> 

       <Stack.Screen name="TabNavigation" component={TabNavigation}
        options={{headerShown:false}}
        />
        */}
           <Stack.Screen name="SplashScreen" component={SplashScreen}
        options={{headerShown:false}}
        /> 
         
          <Stack.Screen name="LoginScreen" component={LoginScreen}
        options={{headerShown:false}}
        /> 
        
        
        {/* <Stack.Screen name="SingnUpScreenCustom" component={SingnUpScreenCustom}
         options={{headerTitle:'Sign Up'}}
        /> */}
        <Stack.Screen name="SignUpScreen" component={SignUpScreen}
        //  options={{headerTitle:'Sign Up'}}
         options={{headerShown:false}}
        />
         <Stack.Screen name="AddPost" component={AddPost}
        options={{headerShown:false}}
        /> 
        <Stack.Screen name="MapScreen" component={MapScreen}
        options={{headerShown:false}}
        /> 
        <Stack.Screen name="Comments" component={CommentsEvents}
        options={{headerShown:true}}
        /> 
        <Stack.Screen name="UsersProfile" component={UsersProfile}
        options={{headerShown:false}}
        /> 
         <Stack.Screen name="Profile" component={EditProfile}
        options={{headerShown:true}}
        /> 
        <Stack.Screen name="AddPostCustom" component={AddPostCustom}
        options={{headerShown:false}}
        />
        <Stack.Screen name="CustomNavigator" component={CustomNavigator}
        options={{headerShown:false}}
        />  
        <Stack.Screen name="MyData" component={MyDataScreen}
        options={{headerShown:false}}
        /> 
        <Stack.Screen name="AllUserData" component={AllUserData}
        options={{headerShown:false}}
        /> 
       <Stack.Screen name="TabNavigationCustom" component={TabNavigationCustom}
        options={{headerShown:false}}
        />  

      <Stack.Screen name="Friends" component={FriendsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="EventsScreen" component={EventsScreen}
      // options={{headerShown:false}}
      />

      <Stack.Screen name="MyEvents" component={MyEvents}
      // options={{headerShown:false}}
      />
      <Stack.Screen name="PostEvent" component={PostEvent}
        options={{ headerTitle: 'Create Event' }}
      />
      <Stack.Screen name="NotificationList" component={NotificationList}
        options={{ headerTitle: 'Notifications' }}
      />
      <Stack.Screen name="HomeScreen" component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen}
        options={{ headerTitle: 'Profile' }}
      />
      <Stack.Screen name="Messages" component={Messages}
      // options={{headerShown:true}}
      />
      <Stack.Screen name="ImageUpload" component={ImageUpload}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
    )
  }
  const DrawerNav = () => {
    return (
      <Drawer.Navigator>
        <Drawer.Screen name='Home' component={TabNavigationCustom} />
        <Drawer.Screen name='Events' component={EventsScreen} />
        <Drawer.Screen name='MyEvents' component={MyEvents} />
        <Drawer.Screen name='Feed' component={ExploreEvents} />
        <Drawer.Screen name='Chats' component={ChatScreen} />

      </Drawer.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <StackNav />
    </NavigationContainer>
  );
}

export default MainNavigator;