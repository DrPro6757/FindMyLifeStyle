import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React,{useState} from 'react'
import Users from '../Tabs/Users';
import SettingsChat from '../Tabs/SettingsChat';

const ChatScreen = (props) => {
  const [selectedTab, setSelecetedTab] = useState(0);
  return (
    <View style={styles.container}>
      {selectedTab===0?<Users allUserData = {props.allUserData}/>:<SettingsChat/>}
      {/* <View style={styles.bottomTab}>
<TouchableOpacity style={styles.Tab}
onPress={()=>setSelecetedTab(0)}
>

<Image source={require('../Images/user.png')}
style={[styles.tabIcon,
{tintColor:selectedTab===0?'white':'gray'}]}
/>

</TouchableOpacity>
<TouchableOpacity style={styles.Tab}
onPress={()=>setSelecetedTab(1)}
>

<Image source={require('../Images/calendar.png')}
style={[styles.tabIcon,
  {tintColor:selectedTab===1?'white':'#000000'}]}
/>

</TouchableOpacity>
      </View> */}
    </View>
  )
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white'
  },
  bottomTab:{
    position:'absolute',
    bottom:0,
    width:'100%',
    height:70,
    backgroundColor:'purple',
    marginBottom:70,
    flexDirection:'row',
    justifyContent:'space-evenly',
    alignItems:'center'
  },
  Tab:{
    width:'50%',
    height:'100%',
    justifyContent:'center',
    alignItems:'center',
  },
  tabIcon:{
    width:30,
    height:30,
  }
});
export default ChatScreen