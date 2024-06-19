import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, FlatList, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation, StackActions } from '@react-navigation/native';
import Auth from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';

import firestore from '@react-native-firebase/firestore';

import { firebase } from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventsScreen from './EventsScreen';
import Notifications from './Notifications';

const userId = AsyncStorage.getItem("USERID");
const HomeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [users, setUsers] = useState("");
  const [imageData, setImageData] = useState('');
  const usersRef = firebase.firestore().collection('users');
  useEffect(() => {
    GetData();
    // getDatabase();
    // exceptData();
  }, [])
  const GetData = async () => {
    const response = await usersRef.onSnapshot(
      querySnapshot => {
        const users = []
        querySnapshot.forEach((doc) => {
          const { name, age, img, email, id } = doc.data()
          users.push({
            id: doc.id,
            name,
            age,
            img,
          })
        })
        setUsers(users);
      }
    )
  }
  const exceptData = ()=>{
    firestore()
  .collection('users')
  // Filter results
  .where('id', '!=', userId)
  .get()
  
  .then(querySnapshot => {
    /* ... */
    console.log('user data : '+querySnapshot._docs[0]._data);
  });
  }
  const getDatabase = async () => {
    try {
      const data = await firestore().collection('users').doc(auth().currentUser?.uid).
      get();
      // setMyData(data._data);
      const name = data._data.name;
      const email = data._data.email;
      const id = data._data.id;
      const img = data._data.img;
      setImageData(img);
      goToNext(name, email, id);
      console.log('profileName =' + name);
      console.log('user Image ='+img);
    } catch (error) {
      console.log(error);
    }
  }
  const goToNext = async (name, email, id) => {
    name = await AsyncStorage.setItem("NAME", name);
    email = await AsyncStorage.setItem("EMAIL", email);
    id = await AsyncStorage.setItem("USERID", id);
    console.warn("Name :" + AsyncStorage.getItem("EMAIL"));
  }

  // const {email, uid} = route.params; 
  return (
    
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <View style={styles.topBar}>
        <Text style={styles.heading}>Explore</Text>
        <Text style={styles.heading}>Explore</Text>
      </View>
      <View style={styles.list}>
        <FlatList
          style={{ height: '100%' }}
          data={users}
          numColumns={1}
          renderItem={({ item }) => (
            <View >
              <View style={styles.userContainer}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View>
                    {
                      imageData === undefined ?
                      <Image source={(require('../Images/user.png'))}
                      style={styles.user_Image} />
                      
                      :
                      <Image src={item.img}
                      style={styles.user_Image} />
                    }
                    
                  </View>
                  <View style={{ marginBottom: 20, flexDirection: 'row' }}>
                    <Text style={styles.userText}>{item.name},</Text>
                    <Text style={styles.userText}>{item.age}</Text>
                  </View>

                </View>

                <View>
                  <View style={styles.userButtonView}>
                    <TouchableOpacity style={styles.userButton}
                    // onPress={()=>{navigation.dispatch(StackActions.replace('ImageUpload'));}}
                    >
                      <Text style={{ color: '#fff', fontSize: 14, margin:10, fontWeight:'700'}}>Add Friend</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.userButton}
                    // onPress={()=>{navigation.dispatch(StackActions.replace('ImageUpload'));}}
                    >
                      <Text style={{ color: '#fff', fontSize: 12, margin: 10, fontWeight:'700' }}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>

              </View>



            </View>
          )}
        />
      </View>
      {/*users Data
      List
      */}

      {/* Email:{Auth().currentUser?.email} */}
    </View>
    
  )
}
const styles = StyleSheet.create({
  addButton: {
    backgroundColor: 'red',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    borderRadius: 50,
  },
  userContainer: {
    justifyContent: 'center',
    backgroundColor: '#30313A',
    // backgroundColor:'white',
    width: 400,
    height: 115,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 25,
    marginVertical: 5,
  },
  userMapping: {
    marginLeft: 10,
  },
  userText: {
    fontSize: 30,
    fontWeight: '700',
    marginLeft: 20,
    color: 'white'
  },
  userButtonView: {
    flexDirection: 'row',
    marginLeft:100,
    marginBottom:20,
  },
  userButton: {
    backgroundColor: '#4867A9',
    borderRadius: 20,
    height: 35,
    width: 100,
    marginLeft:10
  },
  user_Image: {
    width: 82,
    height: 82,
    borderRadius: 41,
    margin: 8,
    borderWidth: 3,
    borderColor: '#ff8501',
    justifyContent: 'center'
  },
  customContainer: {
    backgroundColor: '#e5e5e5',
    padding: 15,
    borderRadius: 15,
    margin: 5,
    marginHorizontal: 10,
  },
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  topBar: {
    height: 110,
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    flexDirection:'row',
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: 'black',
    marginLeft: 20,
    marginTop: 50,
  },
  list: {
    marginTop: 5,
    height: 500,
    marginBottom: 110
  }
});
export default HomeScreen