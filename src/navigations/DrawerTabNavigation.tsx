import { View, Text } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import BottomTabNavigation from './BottomTabNavigation'
import CustomDrawer from './CustomDrawer'
import UsersProfile from '../ScreensCustom/UsersProfile'
import YourEvents from '../ScreensCustom/EditEvents'

const DrawerTabNavigation = () => {
    const Drawer = createDrawerNavigator()
  return (
         <Drawer.Navigator 
         
         screenOptions={{
          drawerStyle: {
            backgroundColor: '#802A55',
            width: 270,
          },
          drawerActiveBackgroundColor: '#1e1e1e',//'#202A55',
        
        }}
         drawerContent={props => <CustomDrawer {...props}/>}
         
         >
        <Drawer.Screen name='Home' component={BottomTabNavigation} options={{ drawerLabel: 'Home',
      headerShown:false,
      drawerLabelStyle:{color:'white', fontSize:18}
       }}/>
        <Drawer.Screen name='Profile' component={UsersProfile} 
        options={{ drawerLabel: 'Profile',
        headerShown:true,
        drawerLabelStyle:{color:'white', fontSize:18}
         }}
        />

      </Drawer.Navigator>
  )
}

export default DrawerTabNavigation