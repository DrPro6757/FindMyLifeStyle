import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Modal, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import MapView, { Callout, CalloutSubview, MapCalloutSubview, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import GestureRecognizer from 'react-native-swipe-gestures';
import QRCode from 'react-native-qrcode-svg';
import { BASE_URL, LIKE_EVENT_POST } from '../Utils/Strings';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MapScreenTest = ({navigation}) => {
    // const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [allEventPostData, setAllEventPostData] = useState([]);
    const [eventInfoModal, setEventInfoModal] = useState(false)
    const [fullScreen, setFullScreen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState([]);
    const [qrCodeValue, setQrCodeValue] = useState('');
    const [eventStatus, setEventStatus] = useState('');

    const [myUserData, setMyUserData] = useState([])
    const [myUserID, setMyUserID] = useState([])
    // AsyncStorage.setItem('USER_DATA_ID', res.data.data._id)
        // console.log('data from async here in login ', AsyncStorage.getItem('USER_DATA_ID'))
        // AsyncStorage.setItem('isLoggedIn', '')
    useEffect(() => {
        // getAllEventData()
        // getMyData()
    }, [])
    
    const myIdFtn = async()=>{
    
      try {
        let idValue = await AsyncStorage.getItem('USER_DATA_ID')
        setMyUserData(idValue)
        console.log('data from async here in login ', myId)
//          http://localhost:8000/api/users/6632c1fdebc22d5c7fcc5579
        // return myId;
        setUpdateState(true)

      } catch (error) {
        console.log('error',error)
      }
  
    }
    //6639fcc4e42506e0b5c65f0e
  const getMyData=()=>{
    try {
      axios.get('http://10.0.2.2:8000/api/users/'+myUserID)
      .then((res)=>{
        console.log('My User Data :: ', res.data.name)
        setMyUserData(res.data);
        //id
      })
      .catch((error)=>{
        console.log('Please check your email id or password ', error)
      })
    } catch (error) {
      console.log('Please check your connection ', error)
    }    
    }

    const getAllEventData = () => {
        // send a post request to the backend API for Login
        axios.get('http://10.0.2.2:8000/api/eventposts')
            .then((res) => {
                console.log('event data for all events ', res.data)
                setAllEventPostData(res.data);
            })
            .catch((error) => {
                console.log('Please check your email id or password ', error)
            })
    }

    const timeDiffernce=(previous)=>{
        const current = new Date();
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerWeek = msPerDay * 7;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;

        var elapsed  = current - previous;
         if(elapsed < msPerMinute){
            return Math.round(elapsed/1000) + ' seconds ago';
         }
         else if(elapsed < msPerHour){
            return Math.round(elapsed/msPerMinute) + ' minutes ago';
         }
         else if(elapsed < msPerDay){
            return Math.round(elapsed/msPerHour) + ' hours ago';
         } 
         //later
         else if(elapsed < msPerWeek){
          return Math.round(elapsed/msPerDay) + ' week ago';
       }
       //
         else if(elapsed < msPerYear){
            return Math.round(elapsed/msPerMonth) + ' months ago';
         }
         else {
            return Math.round(elapsed/msPerYear) + ' years ago';
         }
        }
      
/// like api
        const onEventPostLike=(id)=>{
          console.log('event id : ',id)
          const postEventData = {
            userId:"6639fcc4e42506e0b5c65f0e", 
          }
        axios.put('http://localhost:8000/api/eventposts/like/'+id,postEventData)
        .then((res)=>{
          Alert.alert("You have successfully Liked Event Post")
          console.log(res);
        })
        .catch((error)=>{
          console.log('Event Like Failed ', error)
        })
        }
        const getLikeStatus=(likes)=>{
          let isLiked = false
          likes.map(item=>{
            if(item == myUserID){
              isLiked = true
            }
          })
          return isLiked
        }

    const selectedEventModal = async (marker) => {
        let tempMembers = marker;
        // let tempMyEventMembers=[]
        setEventInfoModal(true)
   //later
        // setSelectedId(marker.postId)
        setSelectedEvent(marker);
        // getSelectEventMembers(marker);
        // setUpdateState(!updateState);
    }
    const SelectedEventInModal = (props) => {
//         const dateEventPosted = new Date((props.selectedEvent.postTimeDate.seconds + props.selectedEvent.postTimeDate.nanoseconds / 1000000000) * 1000);
  
//         const dt = new Date(dateEventPosted);
//         const x = dt.toISOString().split("T");
    
//         const x1 = x[0].split('-');
//         const x2 = props.selectedEvent.eventDate.split('/')
//       //   console.log('Event Date Time ===='+x1[0] + "/" + x1[1] + "/" + x1[2]);
//         seteventPostDateTime(x1[0] + "/" + x1[1] + "/" + x1[2]);
    
//         var today = new Date();
//         var dd = String(today.getDate()).padStart(2, '0');
//         var mm = String(today.getMonth() + 1).padStart(2, '0'); 
//         var yyyy = today.getFullYear();
    
//         const currentDate = yyyy + '/' + mm + '/' + dd;
//       //   console.log("both dates === Current Date: " + currentDate, "Event Date: "+x2[2] + "/" + x2[1] + "/" + x2[0])
//         if(x2[0] >= yyyy.toString() && x2[1] >= mm){
//         if (x2[1] > mm) {
//           setEventStatus('Active')
//         }
//         if (x2[1] == mm) {
//           if (x2[0] > dd) {
//             setEventStatus('Active')
//             // console.log('Active')
    
//           } else {
//             setEventStatus('Expired')
//           }
//           console.log('Active' + x2[1] + ' > ' + mm)
    
//         } else if (x2[1] < mm) {
//           setEventStatus('Expired')
//         }
//       }else{
//         setEventStatus('Expired')
//       }
  
//                   var myDistanceFromEvent = getDistance(
//                     { latitude: props.selectedEvent.eventLocation.latitude, longitude: props.selectedEvent.eventLocation.longitude },
//                     { latitude: myLat, longitude: myLong }
//                   );
              
//                   myDistanceFromEvent = myDistanceFromEvent / 10000;
              
//                   setMyDistance(myDistanceFromEvent);
            return (
              <View style={{
                flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%', width:'100%', 
              }}>
                {/* <ScrollView> */}
                <View style={{
                  height: '100%', width: '100%', backgroundColor: '#1e1e1e', borderRadius: 20,
              //    borderWidth: 1, borderColor: 'orange'
                }}>
         
                <View style={{flex:1}} >
                  {
                  props.selectedEvent.imageUrl  === undefined || props.selectedEvent.imageUrl  === ""?
                        <Image
                          source={(require('../Images/user.png'))}
                          style={[styles.postImage, { width: '100%', height: 600, }]}
                        />:
                    <Image source={{ uri: props.selectedEvent.imageUrl }}
                      style={[styles.postImage, { width: '100%', height: 600,resizeMode:'contain' }]}
                  />
                  }
                  </View>
                      {/* like comment share wishlist functions  */}
                      <View style={{height:100, width:'100%', backgroundColor:'black', 
                        justifyContent:'space-between',flexDirection:'row'}}>
                          <View style={{flexDirection:'row'}}>
                            <View>
                            <TouchableOpacity onPress={()=>onEventPostLike(props.selectedEvent._id)}>
                          
                          {
                            getLikeStatus(props.selectedEvent.postLikes)
                            ?
                            <Image source={(require('../Images/heartOn.png'))}
                          style={{height:35, width:35, tintColor:'red',margin:10}}
                          />
                          :
                          <Image source={(require('../Images/heart.png'))}
                          style={{height:35, width:35, tintColor:'white',margin:10}}
                          />
                          }
                        </TouchableOpacity>
                        {
                          props.selectedEvent.postLikes.length > 0
                          ?
                          <Text style={{color:'white', fontSize:14, margin:10}}>{props.selectedEvent.postLikes.length} likes</Text>
                          :
                          // <Text style={{color:'white', fontSize:14, margin:10}}>0 likes</Text>
                          null

                        }
                        
                            </View>
                          
                        <TouchableOpacity 
                        onPress={()=>[setEventInfoModal(false),navigation.navigate('Comments',{id:props.selectedEvent._id})]}
                        >
                          
                          <Image source={(require('../Images/comment.png'))}
                          style={{height:35, width:35, tintColor:'white',margin:10}}
                          />
                          <Text style={{color:'white'}}>{
                          props.selectedEvent.postLikes.length +'comments'
                          ?
                          props.selectedEvent.postLikes.length
                          :
                          null 
                          }</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                          
                          <Image source={(require('../Images/send.png'))}
                          style={{height:35, width:35, tintColor:'white',margin:10}}
                          />
                        </TouchableOpacity>
                          </View>
                          <View>
                          <TouchableOpacity onPress={()=>AddToWishListFtn(item)}>
                          {
                            // getWishListStatus(item)?
                            <Image source={(require('../Images/wishlistAdded.png'))}
                          style={{height:35, width:35,margin:10}}
                          />
                            // :
                            // <Image source={(require('../Images/wishList.png'))}
                            // style={{height:35, width:35, tintColor:'white',margin:10}}
                            // />
                          }
                          
                         
                        </TouchableOpacity>
                        <Text style={{color:'white'}}>Wishlist</Text>
                          </View>
                          
                       </View>

                      {/* </View> */}
                  <TouchableOpacity onPress={()=>[setEventInfoModal(false), setFullScreen(false)]}
                style={[
                  { alignSelf:'flex-end', marginRight:20, marginTop:20},
                ]}>
                <Image
                source={require('../Images/close.png')}
                style={[
                  { height: 40, width: 40, borderRadius: 20, tintColor:'red'},
                ]}
              />
                </TouchableOpacity>
                <Text style={{ marginLeft: 10, color: '#fff', fontSize: 35, fontWeight: '700' }}>
                         {props.selectedEvent.eventName ? props.selectedEvent.eventName : ''}
                        </Text>
                        <Text style={{ color: 'white', fontSize:15, marginLeft:10, margin:10 }}>
                    {timeDiffernce(new Date(props.selectedEvent.createdAt))}
                    </Text>
                  <View style={styles.mainContainer}>    
                  <Text style={{ marginLeft: 10, margin:10, color: '#fff', fontSize: 16, fontWeight: '400' }}>
                         Posted By
                        </Text>    
                   {
                      // this.state.ImageURI !== '' ? <Image source={this.state.ImageURI} /> :null
                      props.selectedEvent.imageUrl === undefined || props.selectedEvent.imageUrl === ""?
                        <Image
                          source={(require('../Images/user.png'))}
                          style={[styles.userImage, { width: 30, height: 30, borderRadius: 15 }]}
                        />
                        :
                        <Image
                          source={{ uri: props.selectedEvent.imageUrl }}
                          style={[styles.userImage, { width: 30, height: 30, borderRadius: 15 }]}
                        />
        
                    }
                    <Text numberOfLines={1} style={[styles.userName, { color: '#fff', fontSize: 22 }]}>{props.selectedEvent.username}</Text>
        
                  </View>
                  <View>
                  <Text style={{ color: '#fff', fontWeight:"700",marginLeft: 10, marginVertical: 10 }}>
                      Caption:</Text>
                    <Text style={{ color: '#fff', marginLeft: 15, fontSize:20 }}>
                      {props.selectedEvent.caption}</Text>
                  </View>
                    
                  <View>
                    <Text numberOfLines={2} ellipsizeMode='tail' style={{ color: '#fff', marginLeft: 25, marginVertical: 10 }}>
                      {props.selectedEvent.eventDescription}</Text>
                  </View>
                  
        
              
                  <View style={{flexDirection:'row', padding:20,height:200, width:'100%', alignSelf:'center', backgroundColor:eventStatus == 'Active' ? 'green' : 'orange', justifyContent:'space-between', alignItems:'center'}}>
                    <Text style={{color:'blue', fontWeight:'600',fontSize:20,width:100}}>Scan QR Code To Know
                     Your Status</Text>
                    <QRCode 
                    value={
                      `${props.selectedEvent.eventName} posted by ${props.selectedEvent.name} with status ${qrCodeValue}`
  }
                     size={150} 
                     color='black' 
                     backgroundColor='white' 
                     logo={require('../Images/logoFml.png')} 
                     logoSize={20} 
                     logoBorderRadius={10}
                     logoBackgroundColor='green'
                    />
                    </View>




                 

                  <View style={[styles.detailBox, {
                    marginLeft: 20, borderWidth: 0,
                    marginVertical: 5, justifyContent: 'space-evenly', backgroundColor: 'black'
                  }]}>
                    <TouchableOpacity onPress={() => { setEventInfoModal(false) }}>
                      <View
                        style={{
                          height: 35, borderRadius: 12, width: 120, borderWidth: 1,
                          borderColor: 'black', backgroundColor: 'blue'
                        }}
                      >
                        <Text style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>View Later</Text>
                      </View>
                    </TouchableOpacity>
                    
                    {/* { later
              props.selectedEvent.userId !== myID
               ?
              getJoinStatusConfirm()
              ?
                <TouchableOpacity style={{ flexDirection: 'row' }}
                onPress={() => Alert.alert('You Have Already Joined This Event')}
              >
                <View
                  style={{
                    height: 35, borderRadius: 12, width: 120, borderWidth: 1,
                    borderColor: 'black',  backgroundColor: '#3373C4',
                  }}
                >
                  <Text
                    style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>
                    Joined
                  </Text>
                </View>
              </TouchableOpacity>
                :
                <TouchableOpacity style={{ flexDirection: 'row' }}
                  onPress={() => getJoinStatus() ? Alert.alert('Request Has Already Been Sent'): [JoinEventFtn(selectedEvent),getFcmTokenFunction(selectedEvent)
                  ]}
                >
                  <View
                    style={{
                      height: 35, borderRadius: 12, width: 120, borderWidth: 1,
                      borderColor: 'black', backgroundColor: getJoinStatus() ? '#FF337B' : '#46D300',
                    }}
                  >
                    <Text
                      style={{ marginTop: 3, alignSelf: 'center', color: 'white' }}>
                      {
                       getJoinStatus()
                          ?
                          'Request Sent'
                          :
                          'Join'
                      }
                    </Text>
                  </View>
                </TouchableOpacity>
                :
                null
              } */}
            
                  </View>
                 
        
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 140 }}>
                    {/* <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
                      {
                        myDistance !== null ? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
                          Event Distance : {myDistance} km away
                        </Text> :
                          <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                            Event Distance : Not Mentioned
                          </Text>
                      }
                    </View> */}
                    {/* <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
                      {
                        props.selectedEvent.eventName !== null ? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
                          Event Name : {props.selectedEvent.eventName}
                        </Text> :
                          <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                            Members Joined : Not Mentioned
                          </Text>
                      }
                    </View> */}
                    <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
                {
                  props.selectedEvent.eventMembersList.length !== 0 || props.selectedEvent.eventMembersList.length !== undefined? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
                    Participants Joined : {props.selectedEvent.eventMembersList.length}
                  </Text> :
                    <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                      Participants Joined : 0
                    </Text>
                }
              </View>
        
                    <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
        
                      <TouchableOpacity style={{ flexDirection: 'row' }}
                      // onPress={() => item.likes == UserId ? onPostDislike(item) : onPostLiked(item)}
                      >
                        {
                          props.selectedEvent.members !== null ? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
                            Total Members : {props.selectedEvent.members}
                          </Text> :
                            <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                              Total Members : Not Mentioned
                            </Text>
                        }
        
                      </TouchableOpacity>
        
                    </View>
                    <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
                      {
                        props.selectedEvent.eventDate !== null ? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
                          Event Date : {props.selectedEvent.eventDate}
                        </Text> :
                          <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                            Event Date : Not Mentioned
                          </Text>
                      }
                    </View>
                    <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
                      {
                        props.selectedEvent.eventTime !== null ? <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                          Event Time : {props.selectedEvent.eventTime}
                        </Text> :
                          <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                            Event Time : Not Mentioned
                          </Text>
                      }
                    </View>
                    {/* <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
                      {
                        eventPostDateTime !== '' ? <Text style={{ marginLeft: 10, fontSize: 16, color: '#fff', fontWeight: '500' }}>
                          Event Posted Date : {eventPostDateTime}
                        </Text> :
                          <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                            Event Posted Date : Not Mentioned
                          </Text>
                      }
                    </View> */}
        
                    <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
                      {
                        eventStatus !== null ? <Text
                          style={{
                            marginLeft: 10, fontSize: 20, color: '#fff', fontWeight: '500', padding: 10,
                            borderWidth: 2, borderColor: 'black', backgroundColor: eventStatus == 'Active' ? 'green' : 'red'
                          }}>
                          Event Status : {eventStatus == 'Active' ? 'Active' : 'Expired'}
                        </Text> :
                          <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                            Event Status : Not Mentioned
                          </Text>
                      }
                    </View>
                    
                  </View>
        
                </View>
                {/* </ScrollView> */}
              </View>
            )
      }

    return (
        <View style={{ flex:1, height: '100%', width: '100%' }}>
              {/* <View  
            style={{
            height: 60,
            width: '30%',
            backgroundColor: 'orange',
            // borderWidth: 1,
            // borderColor: 'white',
          }
          >
            <TouchableOpacity //onPress={() => setFilterModal(true)} 
            onPress={()=>navigation.openDrawer()}
          style={{
            height: 50,
            width: 90,
            margin:5,
            backgroundColor: '#202A44',
            flexDirection: 'row',
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'white',
          }}
          >
          <Image
                  source={require('../Images/filter.png')}
                  style={{height: 30, width: 30, tintColor: 'white'}}
                /><Text style={{color: 'white', fontSize: 18, fontWeight: '600'}}>
                Filter
              </Text>
          </TouchableOpacity>
            </View>   */}
          
            <MapView
                style={StyleSheet.absoluteFill}
                    
                    //{ width: '100%', height: '100%'}}
                mapType='hybrid'
                userInterfaceStyle='dark'
                // initialRegion={{
                //     latitude: 51.50746, // 33.51995346211034, 73.08200449215008// 51.50746, -0.1277,
                //     longitude: -0.1277,
                //     latitudeDelta: 0.0922,//2
                //     longitudeDelta: 0.0421,//2
                // }}
                // onRegionChange={x => {
                //     // console.log(x);
                // }}
                >
                  
                    
                {
                    // allEventPostData.length > 0 ?
                    //     allEventPostData && allEventPostData.map((marker, index) => {
                    //         return (

                    //             //  <Marker coordinate={marker.eventLocation}  longitude: marker.eventLocation.longitude 
                    //             <Marker coordinate={{ latitude: marker.location.coordinates[1], longitude: marker.location.coordinates[0] }}
                    //                 title='Test Map marker'
                    //                 description='Test map marker with custom image'
                    //                 // icon={require('../Images/user.png')}
                    //                 key={index}
                    //                 onPress={() => selectedEventModal(marker)}

                    //             >
                    //                 <View style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }}>


                    //                     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    //                         <TouchableOpacity onPress={() => selectedEventModal(marker)}
                    //                         //onPress={() => { console.log('button clicked'); setFilterModal(true) }}
                    //                         >


                    //                             <Image source={require('../Images/map-marker.png')}
                    //                                 style={{ height: 75, width: 75 }} />
                    //                             <View style={{ position: "absolute",
                    //                           }}>

                    //                                 {
                    //                                     marker.imageUrl === undefined || marker.imageUrl === ''
                    //                                         ?
                    //                                         null
                    //                                         :
                    //                                         <Image source={{ uri: marker.imageUrl }}
                    //                                             style={{ height: 50, width: 50, borderRadius: 25, marginLeft: 13, marginTop: 5 }} />
                    //                                 }
                    //                             </View>
                    //                         </TouchableOpacity>
                    //                     </View>

                    //                 </View>

                    //                 <Callout tooltip>
                    //                     <View>

                    //                         <View style={styles.bubble}>


                    //                             <Text //style={{height:44, width: 44, borderWidth:1, borderColor:'red'}}
                    //                             >

                    //                                 {
                    //                                     marker.imageUrl === undefined || marker.imageUrl === ""
                    //                                         ?
                    //                                         null
                    //                                         :
                    //                                         <Image source={{ uri: marker.imageUrl }} resizeMode='cover'
                    //                                             style={{
                    //                                                 width: 30, height: 30, borderRadius: 15
                    //                                             }}
                    //                                         />
                    //                                 }
                    //                             </Text>
                    //                             <View style={{
                    //                                 flex: 1, height: '100%', width: '80%',
                    //                                 flexDirection: 'column', marginLeft: 2,
                    //                                 borderWidth: 1, borderColor: 'white',
                    //                                 flexWrap: 'wrap'
                    //                             }}>
                    //                                 <View style={{ height: '70%', width: '100%', margin: 3 }}>
                    //                                     <Text style={{ fontSize: 15, fontWeight: '600', color: 'white' }}>{marker.eventName}</Text>



                    //                                     <View style={{ height: 30, width: 100 }}>

                    //                                     </View>
                    //                                 </View>

                    //                             </View>
                    //                         </View>
                    //                     </View>
                    //                 </Callout>
                    //             </Marker>
                    //         )
                    //     })
                    //     :
                    //     null

                } 
            </MapView>
         
            <GestureRecognizer
             style={{ flex: 1 }}
             onSwipeUp={() => setFullScreen(true)}
             onSwipeRight={() => setFullScreen(true)}
            //  onSwipeUp={}

             onSwipeDown={() =>{setEventInfoModal(false), setFullScreen(false)}}
            >
             
              <Modal visible={eventInfoModal}
                onRequestClose={() => {setEventInfoModal(false), setFullScreen(false)}}
                transparent={true}
                // style={{ justifyContent: 'flex-end', alignSelf:'flex-end', backgroundColor:'black',
                // alignItems: 'flex-end', alignContent: 'flex-end', height: fullScreen ? '100%':'30%',width: '100%' }}

            >
              {/* <View style={{flex:1}}> */}
              <ScrollView showsVerticalScrollIndicator={false}>
                 <View 
                 style={{ flex: 1, alignSelf: 'flex-end', 
                justifyContent: 'flex-end', alignItems: 'flex-end', height: '40%', width: '100%' }}
                >
                    <View 
                    style={{ 
                        backgroundColor: '#1e1e1e', alignSelf: 'flex-end', height: fullScreen ? '100%':'40%',width: '100%', justifyContent: 'center', alignItems: 'center',
                        borderTopLeftRadius: 30, borderTopRightRadius: 30,// borderWidth: 1, borderColor: 'purple'
                    }}
                    >
                       {/* <View style={{ flex: 1 }}> */}
                        
                          <SelectedEventInModal selectedEvent={selectedEvent} />
                        
                      {/* </View> */}
                    </View>
                </View>
              </ScrollView>
                {/* </View> */}
            </Modal>
           
            </GestureRecognizer>

            
        </View>
    )
}
const styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height: '100%',
        width: '100%',
    },
    bubble: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        backgroundColor: 'black',
        borderRadius: 6,
        // borderColor: 'white',
        // borderWidth: 0.5,
        padding: 15,
        width: 190,
        height: 80,
        marginBottom: 10
    },
    name: {
        fontSize: 16,
        marginBottom: 5,
    },
    arrow: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#fff',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -32,
    },
    arrowBorder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: 'black',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -0.5,
    },
    image: {
        width: 50,
        height: 50,
    },
    marker: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        backgroundColor: "#007bff",
        borderColor: "#eee",
        borderRadius: 5,
        elevation: 10,
    },
    text: {
        color: "#fff",
    },
    userButton: {
        backgroundColor: '#4867A9',
        borderRadius: 10,
        height: 35,
        width: 110,
        marginLeft: 10
    },
    mainContainer: {
        flexDirection: 'row',
        margin: 10,
    },
    userImage: {
        width: 35,
        height: 35,
        margin: 5,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'white',
        // tintColor: 'white'
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        margin: 3,
        color: 'white'

    },
    postImage: {
        width: '100%',
        height: '100%',
        // margin: 5,
        // alignSelf: 'center',
        // borderRadius: 30,
        borderWidth: 1,
        borderColor: 'black',
    },
    detailBox: {
        flexDirection: 'row',
        width: '90%',
        height: 70,
        // marginBottom: 10,
        // justifyContent: 'space-evenly',
        alignItems: "center",
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'black',
        marginVertical: 10,
        borderRadius: 10,
    },
});
export default MapScreenTest