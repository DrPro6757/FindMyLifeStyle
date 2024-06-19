import { View, Text, StyleSheet, FlatList, Dimensions, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation,StackActions} from '@react-navigation/native';
import Video from 'react-native-video';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import { ScrollView } from 'react-native-gesture-handler';
import TabNavigationCustom from '../navigations/TabNavigationCustom';
import {useDispatch, useSelector} from "react-redux";
import { getAllEventsInitiate } from '../Redux/actionsEvents';
import { getMyUserDataAction, getUsersInitiate } from '../Redux/actionsUser';

let id=''
let name=''
let myUserId = ''
let myProfileImage=''

//later
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  messaging().getInitialNotification();



const Users = (props) => {
    const navigation = useNavigation();

    const [allusersData, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [chatList, setChatList] = useState([]);
    const[updateState, setUpdateState] = useState(false);
    let myChatters = [];
    const dispatch = useDispatch();
    useEffect(() => {
        // myID();
        // getUsers();
        dispatch(getMyUserDataAction());
        dispatch(getUsersInitiate());

        
        // setUsers(props);
        // getMydata();
    }, [])
    let myIDs = "";
    let myName = "";
    let myImage = "";
    const {mydata} = useSelector(state => state.myUserData)
    const {users} = useSelector(state => state.myUserData)
    mydata && 
    mydata.map(item=>{
    id = item.id;
     myName = item.name;
     myProfileImage = item.profileImage;
    })
  
    useEffect(() => {
        let tempUsers = []
        users && users.map(item=>{
            if(item.id !== myUserId)
            {
                tempUsers.push(item)
            }
        })
        console.log('all user data == ',tempUsers)
        setUsers(tempUsers);
         myChattersListData();
    }, [updateState])

    const myID= async()=>{
        myProfileImage = await AsyncStorage.getItem('profileImage');
        myUserId = await AsyncStorage.getItem("USERID");
    }
    const myChattersListData = async()=>{
        let tempMyFollowerList = [];
        
        let myMessagesCount = [];
        await firestore().collection('users').doc(auth().currentUser?.uid).get()
            .then(
                querySnapshot => {
                    myChatters = querySnapshot.data().chatsBy;
                    console.log("my chatters data == " + myChatters);
                    myMessagesCount = querySnapshot.data().messageFrom;
                    if(myMessagesCount.length<=0){
                        // props.userUpdate = false;
                        // props.userUpdate();
                        // <TabNavigationCustom updateMessage = {false}/>
                    }
                })
                let tempUsers = [];
                let tempMessagers = [];
                var i;
                firestore().
                collection("users")
                .get()
                .then(
                    querySnapshot => {
                            querySnapshot._docs.map((item) => {
                                console.log("My  list :" + item._data.id);
                                myChatters.map(item1=>{
                                    if (item._data.id == item1) {
                                        tempUsers.push(item._data);
                                        console.log("My chatters name list :" + item._data.name);
                                    }
                                })
                                myMessagesCount.map(item2=>{
                                    if (item._data.id == item2) {
                                        tempMessagers.push(item._data);
                                        console.log("My Messages Count :" + item._data.id);
                                    }
                                })
                            }
        
                            );
                        
                            setAllUsers(tempUsers);
                            setChatList(tempMessagers);
                            // setChatList(myChatters)
                            console.log('adfkljskladjfklsaj lkjklfdjaljflsdka = '+chatList);
                            <TabNavigationCustom tempMessages = {chatList}/>
                        
                    }
                );
    
    // setUpdateState(!updateState);
    
    
    }
    const getUsers = async () => {
        let tempData=[]
        
        const email = await AsyncStorage.getItem('EMAIL');
         id = await AsyncStorage.getItem('USERID');
         name = await AsyncStorage.getItem('NAME');
        console.log('USER ID '+email);
        console.log('USER ID '+name);
        firestore().collection('users').where('email', '!=', email).get()
        .then(res => {
            if (res.docs != []) {
                res.docs.map(item=>{
                    
                    // if(item.data().id === item._data.chatsBy){
                        // console.log('chatter ids  '+item._data.chatsBy)
                    // }
                    // console.log('chatter ids '+item.data().id)
                    tempData.push(item.data());
                });
            }
            setUsers(tempData);
        });
        // users.data().sendBy.map(chatter =>{
            
        // })

        // firestore().collection('chats').doc("" + route.params.data.id + route.params.id).get();

    }
    const getMydata=async()=>{
      const data = await firestore().collection('users').doc(auth().currentUser?.uid).get();
      myProfileImage = data._data.profileImage;
      console.log('My profile image in Chat Users Screen :::'+ myProfileImage);
    }
    let tempData = []
    const NavigationFunction=(itemAll)=>{
       
        // users.map(item=>{
           console.log('check other chatter id '+itemAll.id);
           firestore()
           .collection('users')
           .doc(auth().currentUser?.uid)
           .update({
             // eventMembersList: firestore.FieldValue.arrayUnion(myUserId),
             messageFrom: firestore.FieldValue.arrayRemove(itemAll.id),
           }).then(res => {
             console.log("Message Sender Deleted  :: " + itemAll.id);
            //  setChatList(tempMessagers);
            myChattersListData();
            // props.userUpdate();
            // console.log('change state = '+props.userUpdate);
             // return
           }

           ).catch(error => {
             console.log(error);
           })
        //     tempData.push(item);
        console.log("Message Sender Data == " + itemAll);
        console.log('All info we are sending for other user ::' + itemAll.name, itemAll.age, itemAll.id);
        console.log('All info we are send for me::' + name, id, myProfileImage);


            navigation.navigate('Messages',{data:itemAll, id:id, name: name,myProfileImage:myProfileImage})

        // })
        // console.log('send data '+tempData)
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
      <Video source={require('../Images/video.mp4')}
        paused={false}
        style={styles.backgroundVideo}
        autoplay={true}
        repeat={true}
        muted={false}
        volume={1.0}
        resizeMode={'cover'}
      />
      {/* <ScrollView> */}
        <View style={styles.container}>
            {/* <View style={styles.header}>
                <Text style={styles.title}>Chats  </Text>
            </View> */}
            
            <View style={{height:'100%'}}>
            {
                allusersData.length > 0?
                allusersData.map((itemAll)=>{
                    return(
                        allUsers.map((itemList,index)=>{
                            return(
                                
                                itemAll.id === itemList.id ?
                                
                                <View>
                                <TouchableOpacity
                                onPress={()=> NavigationFunction(itemAll)
                                    // navigation.navigate('Messages',{data:item, id:id, name: name,myProfileImage:myProfileImage})
                                }// myProfileImage:myProfileImage})}
                                >
                                <View style={styles.userItem}>
                                {
                                    itemList.profileImage ===''?
                                    <Image source={require('../Images/user.png')}
                                style={styles.userImage}/>
                                    :
                                    <Image source={{uri: itemList.profileImage}}
                                style={styles.userImage}/>
                                }
                                
                                <View>
                                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={styles.userName}>{itemList.name}</Text>
                                { 
                                    chatList.map (item4=>{
                                        return(
                                          item4.id  == itemList.id
                                          //'xxPurLrhPyXIxbJcaB0kELhXSyH3'
                                         // 
                                          ? 
                                        //   <View>
                                        <View
                                        style={{backgroundColor: 'red', alignSelf: 'flex-end', height:15, width:15, borderRadius:7.5
                                    }} 
                                        >
                                             <Text style={{flex:1, fontSize:16, color:'white', fontWeight:'800', marginHorizontal:2}}>
                                        </Text> 
                                        </View>
                                        // </View>
                                           
                                        :
                                        null
                                      
                                        )
                                    })
                                    }
                                </View>
                                <View style={{width:'100%', height:25,flexDirection:'row'}}>
                                    <Text style={{fontSize:15, color:'white', marginLeft:20}}>
                                    {itemList.interest}</Text>
                                    {/* <Text style={{fontSize:15, color:'red', marginLeft:20, fontWeight:'600'}}>
                                    {itemList.age}</Text>  */}
                                  
                                    
                                    </View>
                                
                                </View>
                                
                            </View>
                            </TouchableOpacity>
                            </View>
                            :
                            null
                            )
                            
                        }))
                })
                
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: 'white' }}>No Chats To Show</Text>
              </View>
            }
            </View>
            
           
           {/* { 
           users.length > 0 ? 
           <FlatList data={users}
           showsVerticalScrollIndicator={false}
            renderItem={({item,index})=>{
                return(
                    <TouchableOpacity
                    onPress={()=> NavigationFunction()
                        // navigation.navigate('Messages',{data:item, id:id, name: name,myProfileImage:myProfileImage})
                    }// myProfileImage:myProfileImage})}
                    >
                   {
                    //  item.id == allUsers.id
                    //  == myChatters
                    //  ?
                   <View style={styles.userItem}>
                        {
                            item.profileImage ===''?
                            <Image source={require('../Images/user.png')}
                        style={styles.userImage}/>
                            :
                            <Image source={{uri: item.profileImage}}
                        style={styles.userImage}/>
                        }
                        
                        <View>
                        <Text style={styles.userName}>{item.name}</Text>
                        <View style={{width:'100%', height:25,flexDirection:'row'}}>
                            <Text style={{fontSize:15, color:'white', marginLeft:20}}>
                            {item.interest},</Text>
                            <Text style={{fontSize:15, color:'red', marginLeft:20, fontWeight:'600'}}>
                            {item.age}</Text> 
                            </View>
                        
                        </View>
                        
                    </View>
                    // :
                    // null
                    }
                    </TouchableOpacity>
                )
            }}
            />
            :
            <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 22, fontWeight: '600', color: 'red'}}>
             No Chats To Show
            </Text>
          </View>
            } */}
        </View>
        {/* </ScrollView> */}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        height:'100%',
        // backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:70
    },
    header: {
        width: '100%',
        height: 60,
        // backgroundColor: 'white',
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth:1,
        borderBottomColor:'black'
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600'
    },
    userItem:{
        width:Dimensions.get('window').width-50,
        alignSelf:'center',
        marginTop:20,
        flexDirection:'row',
        height:60,
        borderWidth:0.5,
        borderRadius:10,
        paddingLeft:20,
        alignItems:'center',
        backgroundColor:'#28305e',
    },
    userImage:{
        width:55,
        height:55,
        borderRadius:28,
        // backgroundColor:'white',
        borderWidth:1,
        borderColor:'orange'
    },
    userName:{
        color:'white',
        fontSize:20,
        marginLeft:20,
        fontWeight:'700',
    },
    backgroundVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      height: '100%',
      width: '100%',
    }
});
export default Users