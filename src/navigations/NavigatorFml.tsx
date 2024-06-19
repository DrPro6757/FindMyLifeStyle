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
import { createDrawerNavigator } from '@react-navigation/drawer';
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
import BottomTabNavigation from './BottomTabNavigation';
import DrawerTabNavigation from './DrawerTabNavigation';
import CommentsUsersPosts from '../ScreensCustom/CommentsUsersPosts';
import HomePage from '../ScreensCustom/StreamingLive/HomePage';
import HostPage from '../ScreensCustom/StreamingLive/HostPage';
import AudiencePage from '../ScreensCustom/StreamingLive/AudiencePage';
import LiveScreen from '../ScreensCustom/LiveScreen';
import UsersProfilesData from '../ScreensCustom/UsersProfilesData';
import YourPosts from '../ScreensCustom/YourPosts';
import YourEvents from '../ScreensCustom/EditEvents';
import MapRoute from '../ScreensCustom/MapRoute';
import ReelScreen from '../ScreensCustom/ReelScreen';
import StoriesScreen from '../ScreensCustom/StoriesScreen';
import ReelsComments from '../ScreensCustom/ReelsComments';
// import 'react-native-gesture-handler';
const Stack = createNativeStackNavigator();

function NavigatorFml() {
  const Drawer = createDrawerNavigator()
  //   const Drawer = createDrawerNavigator();

  const [IsUserLogin, setIsUserLogin] = useState(false);

  Auth().onAuthStateChanged((user) => {
    if (user !== null) {
      setIsUserLogin(true);
    }
  });
  const StackNav = () => {
    return (<Stack.Navigator>
      <Stack.Screen name="SplashScreen" component={SplashScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="LoginScreen" component={LoginScreen}
        options={{ headerShown: false }}
      />

      {/* <Stack.Screen name="SingnUpScreenCustom" component={SingnUpScreenCustom}
         options={{headerTitle:'Sign Up'}}
        /> */}
      <Stack.Screen name="SignUpScreen" component={SignUpScreen}
        //  options={{headerTitle:'Sign Up'}}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="DrawerTabNavigation" component={DrawerTabNavigation}
        //  options={{headerTitle:'Sign Up'}}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Route" component={MapRoute}
         options={{
          headerShown: true,
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#202A55'
          },
          title:'Route',
          headerTitleAlign: 'center',
      }}
      />
      <Stack.Screen name="Profile" component={UsersProfile}
        options={{ headerShown: true }}
      />
      <Stack.Screen name="UsersProfiles" component={UsersProfilesData}
        options={{ headerShown: true }}
      />
       <Stack.Screen name="Stories" component={StoriesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Reels" component={ReelScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Reel Comments" component={ReelsComments}
        options={{ headerShown: true }}
      />
      <Stack.Screen name="Your Posts" component={YourPosts}
        options={{ headerShown: true }}
      />
      <Stack.Screen name="Edit Event" component={YourEvents}
        options={{ headerShown: true }}
      />
      <Stack.Screen name="Comments" component={CommentsEvents}
        options={{ headerShown: true }}
      />
      <Stack.Screen name="Post Event" component={AddPostCustom}
        options={{ headerShown: true }}
      />
      <Stack.Screen name="Comments Posts" component={CommentsUsersPosts}
        options={{ headerShown: true }}
      />
      <Stack.Screen name="Profile Edit" component={EditProfile}
        options={{ headerShown: true }}
      />
      <Stack.Screen options={{ headerShown: false }} //headerMode="none" 
        name="HomePage" component={HomePage} 
        />
      <Stack.Screen name="HostPage" component={HostPage}
      options={{ headerShown: false }}  
      />
      <Stack.Screen name="AudiencePage" component={AudiencePage}
      options={{ headerShown: false }}  
      />
      <Stack.Screen name="Live" component={LiveScreen}
      options={{ headerShown: false }}  
      />

    </Stack.Navigator>
    )
  }
  //   const DrawerNav = () => {
  //     return (
  //       <Drawer.Navigator>
  //         <Drawer.Screen name='MapScreen' component={MapScreen} />
  //         <Drawer.Screen name='Profile' component={UsersProfile} />
  //       </Drawer.Navigator>
  //     )
  //   }

  return (
    <NavigationContainer>
      <StackNav />
    </NavigationContainer>
  );
}

export default NavigatorFml;