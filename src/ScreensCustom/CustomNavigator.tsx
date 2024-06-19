import { View, Text, Alert, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from "react-redux";
import axios from 'axios';

const CustomNavigator = () => {
    const [allEventData, setAllEventData] = useState([]);
    let myID = "";
  let myName = "";
  let myImage = "";

    const {mydata} = useSelector(state => state.myUserData);
    console.log('my data ', mydata)
    useEffect(() => {
        getAllEventData()
    }, [])
    const getAllEventData=()=>{
        // send a post request to the backend API for Login
      axios.get('http://10.0.2.2:8000/api/eventposts')
      .then((res)=>{
        console.log('event data for all events ', res.data)
        setAllEventData(res.data);
      })
      .catch((error)=>{
        console.log('Please check your email id or password ', error)
      })
    }
    // mydata.map(item=>{
    //     myID = item.id;
    //     myName = item.name;
    //     // myImage = item.profileImage;
    //    })
  return (
    <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}}>
      {/* <Text style={{fontSize:30,fontWeight:'700'}}>CustomNavigator</Text> */}
      <FlatList
      data={allEventData}
      showsVerticalScrollIndicator = {false}
      renderItem={({item, index}) => {
        return (
<View 
style={{
    justifyContent: 'center',
    backgroundColor: '#202A44',
    alignItems: 'center',
    // backgroundColor:'#202A44',#30313A
    width: '95%',
    height: 220,//220
    borderWidth: 0.5,
    borderColor: '#ff8501',
    borderRadius: 25,
    marginVertical: 5,
    marginHorizontal: 10,}}
    >
        <Text style={{fontSize:30,fontWeight:'700', color:'white'}}>{item._id}</Text>

        <Text style={{fontSize:30,fontWeight:'700', color:'white'}}>{item.username}</Text>

        <Text style={{fontSize:30,fontWeight:'700', color:'white'}}>{item.caption}</Text>
</View>
            );
        }}
      
      />
    </View>
  )
}

export default CustomNavigator