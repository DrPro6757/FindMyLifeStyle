import { View, Text, FlatList, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
const MyFollower = () => {

    const [myFollowingList, setMyFollowingList] = useState([]);
    const [myData, setMyData] = useState('');
    const [myPhotos, setMyPhotos] = useState('');
    const [imageClick, setImageClick] = useState(false);
    useEffect(() => {
        myFollowerListData()
   //    getMyFollowers()
        const myUserId = AsyncStorage.getItem("USERID");
        // console.log("My user id here :"+myUserId);
        //   getDataTest();
    }, [])
  

const myFollowerListData = async()=>{
    let tempMyFollowerList = [];
    let myFollowers = [];
    await firestore().collection('users').doc(auth().currentUser?.uid).get()
        .then(
            querySnapshot => {
                myFollowers = querySnapshot.data().following;
                console.log("my followers data == " + myFollowers);
            })



            let tempUsers = [];
            var i;
            firestore().
            collection("users")
     //      .where('id', 'array-contains', 'myFollowers')
            .get()
            .then(
                querySnapshot => {
                        querySnapshot._docs.map((item) => {
                            console.log("My  list :" + item._data.id);
                            myFollowers.map(item1=>{
                                if (item._data.id == item1) {
                                    tempUsers.push(item);
                                    console.log("My followers name list :" + item._data.name);
                                  //  console.log('other people fcm token == '+item._data.fcmToken);
                             
                                }
                            })
                            // if (item._data.id == myFollowers) {
                            //     tempUsers.push(item);
                            //     console.log("My followers name list :" + item._data.name);
                            //   //  console.log('other people fcm token == '+item._data.fcmToken);
                         
                            // }
                        }
    
                        );
                    
                        setMyFollowingList(tempUsers);
                    
                }
            );




}

    return (
        <View>
            {
                    myFollowingList !== null ?
                    myFollowingList.map((item)=>{
                        return(
                          <View style={styles.userContainer}>

                          <View style={{ flex: 1, flexDirection: 'row' }}>
                              <TouchableOpacity
                          //     onPress={() => onUserProfileClick(item)}
                               >
                                  <Image
                                      source={item._data.profileImage == "" ? (require('../Images/user.png')) : { uri: item._data.profileImage }}
                                      style={styles.user_Image}
                                  />
                              </TouchableOpacity>
                              <View style={{ marginBottom: 20, flexDirection: 'row' }}>
                                  <Text style={styles.userText}>
                                      {item._data.name},{item._data.age}</Text>
                              </View>
                          </View>
                          <View>
                              <View style={styles.userButtonView}>
                                  <TouchableOpacity style={[styles.userButton, { flexDirection: 'row' }]}
                     //                 onPress={() => getFollowStatus(item._data.followers) ? unfollowUser(item) : followFunction(item)}
                                  // onPress={() => item._data.followers === userId ? unfollowUser(item) : followFunction(item)}
                                  >
                                      {/* <Image source={require('../Images/add-friend.png')}
                                          style={{
                                              height: 15, width: 15, alignSelf: 'center', marginLeft: 10,
                                              marginTop: 2, tintColor: 'white'
                                          }}
                                      /> */}
                                      <Text
                                          style={{ color: '#fff', fontSize: 14, margin: 10, fontWeight: '700' }}
                                      >
                                          {
                                              // item._data.followers == userId
                                              // followFunction.bind(item)
                                              // item._data.followers === userId
                                              //     //  statusUpdate == false
                                              //     ?
                                              //     statusUpdate
                                              //     :
                                              //     statusUpdate
                                              'follow'
                                              // getFollowStatus(item._data.followers)
                                              //     ? 'Unfollow'
                                              //     : 'Follow'
                                          }


                                      </Text>
                                  </TouchableOpacity>
                                  <TouchableOpacity style={[styles.userButton, { flexDirection: 'row' }]}
                                      // onPress={() => sendNotification(token)}
                                      // onPress={() => unfollowUser(item)}
                                      // onPress=
                                      // {() => navigation.navigate('Messages', { data: item, id: userId, profileImage: profileImage })
                                      // }
                                  >
                                      <Image source={require('../Images/user-info.png')}
                                          style={{
                                              height: 15, width: 15, alignSelf: 'center', marginLeft: 10,
                                              marginTop: 2, tintColor: 'white'
                                          }}
                                      />
                                      <Text
                                          style={{ color: '#fff', fontSize: 12, margin: 10, fontWeight: '700' }}>
                                          Messages
                                      </Text>
                                  </TouchableOpacity>
                              </View>
                          </View>



                      </View>
                        )
                    })
                    :
                    <View  style={{height:400, width:'100%', backgroundColor:'grey'}}>

                    <Text>No followers to show</Text>
                </View>
                }
        </View>
    )
}
const styles = StyleSheet.create({
    headingSettings: {
      // borderBottomWidth: 1,
      // borderColor: 'black',
      width: '100%',
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      // flexDirection: 'row',
    },
    buttonViewSettings: {
      height: 70,
      width: '70%',
      borderBottomWidth: 0.3,
      borderColor: 'black',
      margin: 5,
      marginTop: 5,
      marginLeft: 30,
    },
    TopContainer: {
      height: 380,
      justifyContent: 'center',
      backgroundColor: '#202A44',
      borderWidth: 2,
      borderBottomRightRadius: 40,
      borderBottomLeftRadius: 40,
    },
    user_Image: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: '#ff8501',
      alignSelf: 'center',
      marginTop: 5
    },
    userName: {
      color: 'white',
      fontWeight: '700',
      fontSize: 30,
      alignSelf: 'center'
    },
    userBio: {
      color: 'white',
      fontWeight: '300',
      fontSize: 15,
      alignSelf: 'center'
    },
    headingStyle: {
      // marginLeft: 20,
      fontSize: 15,
      color: 'white',
      fontWeight: '700'
    },
    EventPhotosNo: {
      color: 'white',
      fontWeight: '400',
      fontSize: 20,
      alignSelf: 'center',
    },
    addPhotos: {
      backgroundColor: 'red',
      width: 200,
      alignItems: 'center',
      padding: 5,
      marginVertical: 10,
      borderRadius: 50,
      alignSelf: 'center',
    },
    photoContainer: {
      width: 110,
      height: 110,
      borderWidth: 2,
      borderColor: '#ff8501',
      borderRadius: 40,
      margin: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    uploadImageModal: {
      height: '96%',
      width: '98%',
      marginTop: 20,
      marginBottom: 20,
      alignSelf: 'center',
      // justifyContent: 'center',
      // alignContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: 30,
      borderRadius: 20,
      borderWidth: 5,
      borderColor: 'grey'
    }, uploadImageBox: {
      width: '100%',
      height: 400,
      borderWidth: 1,
      alignSelf: 'center',
      marginVertical: 20,
      borderColor: 'black',
      borderRadius: 5,
      // flexDirection: 'row'
    }, button: {
      width: '100%',
      height: 50,
      borderBottomWidth: 1,
      borderBottomColor: 'black',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
  
    }, UploadButton: {
      backgroundColor: 'blue',
      alignItems: 'center',
      padding: 5,
      marginVertical: 5,
      borderRadius: 50,
      width: 180,
      height: 60,
      margin: 5,
      justifyContent: 'center'
    },
    userContainer: {
        justifyContent: 'center',
        backgroundColor: '#202A44',
        // backgroundColor:'#202A44',#30313A
        width: '100%',
        height: 120,
        borderWidth: .5,
        borderColor: '#ff8501',
        borderRadius: 25,
        marginVertical: 5,
    },
    userText: {
        fontSize: 25,
        fontWeight: '500',
        marginLeft: 20,
        marginTop: 20,
        marginBottom: -5,
        color: 'white'
    },
    userButtonView: {
        flexDirection: 'row',
        marginLeft: 100,
        marginBottom: 20,
        marginRight: 10,
    },
    userButton: {
        backgroundColor: '#4867A9',
        borderRadius: 10,
        height: 35,
        width: 110,
        marginLeft: 10
    }
  });
  
export default MyFollower