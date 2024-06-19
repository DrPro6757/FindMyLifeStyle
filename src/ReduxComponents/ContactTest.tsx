import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, ActionSheetIOS, Button, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from "react-redux";
import { addContactInitiate, deleteContactInitiate, getContactsInitiate } from '../Redux/actions';
import { getAllEventsInitiate } from '../Redux/actionsEvents';
import { getMyUserDataAction, getUsersInitiate } from '../Redux/actionsUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { ScrollView } from 'react-native-gesture-handler';
const ContactTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [updateState, setUpdateState] = useState(false);
  const[myDataState, setMyDataState] = useState('');
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getContactsInitiate());
    dispatch(getUsersInitiate());
    dispatch(getAllEventsInitiate());
    dispatch(getMyUserDataAction());
  }, [updateState])
  const {contacts} = useSelector(state => state.data)
  const {users} = useSelector(state => state.data)
  const {allevents} = useSelector(state => state.eventData);
  const {mydata} = useSelector(state => state.myUserData);
  
  let myname = "";

  mydata && 
  mydata.map(item=>{
   myname = item.id;
  })

  // let myFinalName =  AsyncStorage.setItem('MYNAME', myname);
  // let myNameInHere = AsyncStorage.getItem('MYNAME');
  // console.log('all user data with redux from my reduce in contact test', myDataState)
  const handleSubmit=()=>{
    const userData = {
      id:'2',
      name: name,
      email: email,
      password: password,

    }
    // console.warn(userData);

    dispatch(addContactInitiate(userData));
  setUpdateState(!updateState);
  setName('');  
  setEmail('');
  setPassword('');
  }
  const handleDeleteContact=(id)=>{
    console.warn(id);
    dispatch(deleteContactInitiate(id));
    setUpdateState(!updateState);
  }
  return (
    <View>
      <ScrollView>
      <Text style={{color:'black', fontSize:22, fontWeight:'500'}}>  My Data With Redux</Text>
      <Text style={{color:'black', fontSize:22, fontWeight:'500'}}> {myname}</Text>
      {
        mydata && mydata.map((item, index)=>(
          <View>
                  <Text style={{color:'black', fontSize:22, fontWeight:'500'}}> {item.id}</Text>
                  <Text style={{color:'black', fontSize:22, fontWeight:'500'}}> {item.name}</Text>
                  {/* <Text style={{color:'black', fontSize:22, fontWeight:'500'}}> {item.email}</Text>
                  <Text style={{color:'black', fontSize:22, fontWeight:'500'}}> {item.password}</Text> */}

                <View style={{flexDirection:'row'}}>
                <View style={{margin:5}}>
                    <Button title='Delete' onPress={()=>handleDeleteContact(item.id)}/>
                </View>
                <View style={{margin:5}}>
                    <Button title='Update'/>
                </View>
                <View style={{margin:5}}>
                    <Button title='View'/>
                </View>
                </View>
                  

          </View>
          
        ))
      }
      <Text style={{color:'black', fontSize:22, fontWeight:'500'}}>  All Events With Redux</Text>
      {
        allevents && allevents.map((item, index)=>(
          <View>
                  {/* <Text style={{color:'black', fontSize:22, fontWeight:'500'}}> {item.id}</Text> */}
                  <Text style={{color:'black', fontSize:22, fontWeight:'500'}}> {item.eventName}</Text>
                  {/* <Text style={{color:'black', fontSize:22, fontWeight:'500'}}> {item.eventCaption}</Text>
                  <Text style={{color:'black', fontSize:22, fontWeight:'500'}}> {item.eventInterests}</Text> */}

                <View style={{flexDirection:'row'}}>
                <View style={{margin:5}}>
                    <Button title='Delete' onPress={()=>handleDeleteContact(item.id)}/>
                </View>
                <View style={{margin:5}}>
                    <Button title='Update'/>
                </View>
                <View style={{margin:5}}>
                    <Button title='View'/>
                </View>
                </View>
                  

          </View>
          
        ))
      }
      <Text style={{color:'black', fontSize:22, fontWeight:'500'}}>  All Users With Redux</Text>
      {
        users && users.map((item, index)=>(
          <View>
                  <Text style={{color:'black', fontSize:22, fontWeight:'500'}}> {item.id}</Text>
                  <Text style={{color:'black', fontSize:22, fontWeight:'500'}}> {item.name}</Text>
                  {/* <Text style={{color:'black', fontSize:22, fontWeight:'500'}}> {item.email}</Text>
                  <Text style={{color:'black', fontSize:22, fontWeight:'500'}}> {item.password}</Text> */}

                <View style={{flexDirection:'row'}}>
                <View style={{margin:5}}>
                    <Button title='Delete' onPress={()=>handleDeleteContact(item.id)}/>
                </View>
                <View style={{margin:5}}>
                    <Button title='Update'/>
                </View>
                <View style={{margin:5}}>
                    <Button title='View'/>
                </View>
                </View>
                  

          </View>
          
        ))
      }
      <Text style={{color:'black', fontSize:22, fontWeight:'500'}}>  Contact Form With Redux</Text>
      {
        contacts && contacts.map((item, index)=>(
          <View>
                  <Text style={{color:'black', fontSize:22, fontWeight:'500'}}> {item.id}</Text>
                  <Text style={{color:'black', fontSize:22, fontWeight:'500'}}> {item.name}</Text>
                  <Text style={{color:'black', fontSize:22, fontWeight:'500'}}> {item.email}</Text>
                  <Text style={{color:'black', fontSize:22, fontWeight:'500'}}> {item.password}</Text>

                <View style={{flexDirection:'row'}}>
                <View style={{margin:5}}>
                    <Button title='Delete' onPress={()=>handleDeleteContact(item.id)}/>
                </View>
                <View style={{margin:5}}>
                    <Button title='Update'/>
                </View>
                <View style={{margin:5}}>
                    <Button title='View'/>
                </View>
                </View>
                  

          </View>
          
        ))
      }

      <TextInput style={[styles.inputBox,{margin:10}]} placeholder='Enter Your Name' placeholderTextColor='black'
                value={name}
                onChangeText={(value) => setName(value)}
              />
      <TextInput style={[styles.inputBox,{margin:10}]} placeholder='Enter Your Email' placeholderTextColor='black'
                value={email}
                onChangeText={(value) => setEmail(value)}
              />
      <TextInput style={[styles.inputBox,{margin:10}]} placeholder='Enter Your Password' placeholderTextColor='black'
                value={password}
                onChangeText={(value) => setPassword(value)}
                secureTextEntry={true}

              />
      <TouchableOpacity style={[styles.addButton,{alignSelf:'center', width:'60%', marginLeft:20, borderWidth:3, borderColor:'red'}]} onPress={() => handleSubmit()}>
             
                
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '500', }}>Post</Text>
              </TouchableOpacity>
              </ScrollView>
    </View>
  )
}
const { height, width } = Dimensions.get('screen');
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#202A44',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginTop: 70,
  },
  radioButton: {
    justifyContent: 'flex-start',
    alignContent: 'center',
    alignItems: 'center',
    margin: 10,
    flexDirection: 'row',
  },
  circle: {
    height: 25,
    width: 25,
    borderRadius: 12,
    borderColor: 'black',
    borderWidth: 1
  },
  circleInside: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: 'orange',
    alignSelf: 'center',
    marginTop: 1.4,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    width: 300,
    height: 300,
    marginBottom: 180,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  table: {
    color: 'blue',
    fontSize: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
    height: '100%',
    width: '100%',

  },
  inputBox: {
    width: width - 30,
    borderRadius: 15,
    borderWidth: 2,
    marginVertical: 10,
    padding: 10,
    borderColor: 'black',
    color: 'black'
  },
  headingStyle: {
    marginLeft: 20,
    fontSize: 20,
    color: 'black',
    fontWeight: '700'
  },
  addButton: {
    backgroundColor: '#00A36C',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10
  },
  cardContainer: {
    marginVertical: 20,
  },
  card: {
    backgroundColor: 'green',
    width: width - 40,
    padding: 20,
    borderRadius: 30,
    marginVertical: 10,
  },
  backgroundVideo: {
    flex:1,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: '100%',
    width: '100%',
  }
});

export default ContactTest