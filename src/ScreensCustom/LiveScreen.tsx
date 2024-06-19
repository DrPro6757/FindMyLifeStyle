import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import { VirtualType } from 'mongoose'

const LiveScreen = () => {
  const navigation = useNavigation();
  const [usersData, setUsersData] = useState([])

  useEffect(() => {
    getAllUserData()
}, [])
  const getAllUserData=()=>{
    axios.get('http://10.0.2.2:8000/api/users')
    .then((res)=>{
      console.log('My User Data = :: ', res.data)
      setUsersData(res.data);
    })
    .catch((error)=>{
      console.log('Please check your email id or password ', error)
    })
}
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={()=>
       navigation.navigate('HostPage', {
        userID: "4321",
        userName: "userID",
        liveID: '1234',
    })
      }
      style={{alignSelf:'flex-end', margin:5, height:30, width:100,
       borderWidth:1, borderColor:'white', borderRadius:5, justifyContent:'center', alignItems:'center'}}>
      <Text style={{color:'white', fontSize:22, fontWeight:'700'}}>Go Live</Text>
      </TouchableOpacity> */}
      <View style = {{height:'10%', width:'100%', backgroundColor:'black', flexDirection:'row'}}>
        <TouchableOpacity style={{height:'100%', width:50, justifyContent:'center', alignItems:'center', margin:5, 
      marginRight:40}}>
          <Image style = {{height:35, width:35, tintColor:'white'}}
          source={require('../Images/filter.png')}
          />
        </TouchableOpacity>
        <ScrollView horizontal>
<View style={{flexDirection:'row', justifyContent:'center', margin:10, marginLeft:40}}>
      <TouchableOpacity style={{height:'100%', width:100, margin:5}}>
      <Text style={{color:'white', fontSize:22, fontWeight:'700'}}>Trending</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{height:'100%', width:100, margin:5}}>
      <Text style={{color:'white', fontSize:22, fontWeight:'700'}}>Favorites</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{height:'100%', width:100, margin:5}}>
      <Text style={{color:'white', fontSize:22, fontWeight:'700'}}>For You</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{height:'100%', width:100, margin:5}}>
      <Text style={{color:'white', fontSize:22, fontWeight:'700'}}>New</Text>
      </TouchableOpacity>

</View>
        </ScrollView>
      
      </View>
      
      
        <View style={styles.StreamsList}>
        {
        usersData ? (
          <FlatList
            style={{height: '100%'}}
            data={usersData}
            numColumns={2}
            renderItem={({item, index}) => {
              return (
                <View style={styles.userContainer}>
                  {/* <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center', //flexDirection: 'row'
                    }}> */}
                    <TouchableOpacity style={{height:'100%', width:'100%'}}
                    onPress={()=>navigation.navigate('AudiencePage', {
                      userID: userID,
                      userName: userID,
                      liveID: liveID,
                  }
                  )}
                    >
                      <Image
                        source={
                          item.profilePic == '' || item.profilePic == undefined
                            ? require('../Images/user.png')
                            : {uri: item.profilePic}
                        }
                        style={styles.userImage}
                      />
                      {/* <View style={{flexDirection: 'row'}}> */}
                      <Text style={styles.userName}>
                        {
                        item.name.substring().length <= 5
                          ? `${item.name}`
                          // ?item._data.name
                          : `${item.name.substring(0, 5)}...`
                          }
                        ,{item.age}
                      </Text>
                      {/* </View> */}

                    </TouchableOpacity>
                    
                  {/* </View> */}
                  <View>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 22, fontWeight: '600', color: 'red'}}>
              Expand Your Search
            </Text>
          </View>
        )}
      </View>
      {/* <View
         style={{flex:1,height:'50%', width:'100%', backgroundColor:'green', position:'absolute', bottom:0}}>
          <ScrollView>
      <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', margin:10}}>
        <Image source={require('../Images/user.png')} style={{height:50, width:50, tintColor:'white'}}/>
        <Image source={require('../Images/user.png')} style={{height:50, width:50, tintColor:'white'}}/>
        <Image source={require('../Images/user.png')} style={{height:50, width:50, tintColor:'white'}}/>
      </View>
      <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', margin:10}}>
        <Image source={require('../Images/user.png')} style={{height:50, width:50, tintColor:'white'}}/>
        <Image source={require('../Images/user.png')} style={{height:50, width:50, tintColor:'white'}}/>
        <Image source={require('../Images/user.png')} style={{height:50, width:50, tintColor:'white'}}/>
      </View>
      <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', margin:10}}>
        <Image source={require('../Images/user.png')} style={{height:50, width:50, tintColor:'white'}}/>
        <Image source={require('../Images/user.png')} style={{height:50, width:50, tintColor:'white'}}/>
        <Image source={require('../Images/user.png')} style={{height:50, width:50, tintColor:'white'}}/>
      </View>
      <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', margin:10}}>
        <Image source={require('../Images/user.png')} style={{height:50, width:50, tintColor:'white'}}/>
        <Image source={require('../Images/user.png')} style={{height:50, width:50, tintColor:'white'}}/>
        <Image source={require('../Images/user.png')} style={{height:50, width:50, tintColor:'white'}}/>
      </View>
      <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', margin:10}}>
        <Image source={require('../Images/user.png')} style={{height:50, width:50, tintColor:'white'}}/>
        <Image source={require('../Images/user.png')} style={{height:50, width:50, tintColor:'white'}}/>
        <Image source={require('../Images/user.png')} style={{height:50, width:50, tintColor:'white'}}/>
      </View>
      </ScrollView>
     </View> */}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'black'
  },
  userName:{
    color:'red',
    fontSize:23,
    fontWeight:'600',
    bottom:40,
    left:10
  },
  StreamsList: {
    height:'100%',
    alignSelf: 'center',
    marginTop: 1,
    
    // marginBottom: 10,
  },
  userImage:{
    // flex:1,
    height:'100%',
    width:'100%',
    borderRadius:25,
    resizeMode:'contain'
    // tintColor:'black',
    // borderRadius:40,
    // borderWidth:1,
    // borderColor:'white'
  },
  userContainer: {
    justifyContent: 'center',
    backgroundColor: 'black',
    alignItems: 'center',
    // backgroundColor:'#202A44',#30313A
    width: '45%',
    height: 220,
    borderWidth: 0.5,
    borderColor: '#ff8501',
    borderRadius: 25,
    marginVertical: 5,
    marginHorizontal: 10,
  }
})

export default LiveScreen