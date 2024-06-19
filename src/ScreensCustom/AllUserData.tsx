import { View, Text, FlatList, TouchableOpacity, ScrollView, Modal, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import GestureRecognizer from 'react-native-swipe-gestures'
import Slider from '@react-native-community/slider'
import {useSelector} from "react-redux";
const AllUserData = () => {
    const [usersData, setUsersData] = useState([])

    
  const [Loading, setLoading] = useState(false);
  const [userList, setUserslist] = useState([]);
  const [userProfileImage, setuserProfileImage] = useState('');

  const [imageData, setImageData] = useState('');
  const [onfollow, setOnFollow] = useState(false);
  const [onFollowClick, setOnFollowClick] = useState(false);

  const [statusUpdate, setStatusUpdate] = useState('');

  const [otherUserProfileImage, setOtherUserProfileImage] = useState('');
  const [otherUserName, setOtherUserName] = useState('');
  const [otherUserAge, setOtherUserAge] = useState('');
  const [otherUserPhotos, setOtherUserPhotos] = useState('');
  const [otherUserAbout, setOtherUserAbout] = useState('');

  const [otherUserInterests, setOtherUserInterests] = useState('');

  const [otherUserWork, setOtherUserWork] = useState('');
  const [otherUserEducation, setOtherUserEducation] = useState('');

  const [otherUserRelationshipStatus, setOtherUserRelationshipStatus] =
    useState('');
  const [otherUserFollowers, setOtherUserFollowers] = useState(0);
  const [otherUserFollowersList, setOtherUserFollowersList] = useState([]);
  const [otherUserFollowing, setOtherUserFollowing] = useState(0);
  const [otherUserEventsPosted, setOtherUserEventsPosted] = useState(0);
  const [otherUserUserId, setOtherUserUserId] = useState('');

  const [modalData, setModalData] = useState('');
  const [otherUserInfoModal, setShowOtherUserInfoModal] = useState(false);
  const [imageFullModal, setImageFullModal] = useState(false);
  const [fullImage, setFullImage] = useState(false);
  const [myfcmToken, setFcmToken] = useState();
  const [myFollowerName, setMyFollowerName] = useState('');

  const [filterModal, setFilterModal] = useState(false);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(100);
  const [maxDistance, setMaxDistance] = useState(10);
  const [filterGender, setFilterGender] = useState('');
  const [filterGenderAll, setFilterGenderAll] = useState('Both');
  const [selectedUser, setSelectedUser] = useState(undefined);

  const [expandSearch, setExpandSearch] = useState('Expand Your Search');

  const [updateUserDataState, setUpdateUserDataState] = useState(false); 

  const [myUserName, setMyUserName] = useState('');
  const [myProfileImage, setMyProfileImage] = useState('');
  const[myTotalFollowers, setMyTotalFollowers] = useState([]);

  let profileImage = '';
  let tempUserData = [];
  let myIndex;
  let indexOpen;

  const [selectedInterest, setSelectedInterest] = useState(null);
  const [selectedView, setSelectedView] = useState();
  const [interestModal, setInterestModal] = useState(false);
  const interests = [
    {
      interestName: 'Hobbies and Activities',
      index: 0,
    },
    {interestName: 'Professional Interests', index: 1},
    {interestName: 'Health and Lifestyle', index: 2},
    {interestName: 'Food and Dining', index: 3},
    {interestName: 'Technology and Gaming', index: 4},
    {interestName: 'Social Causes', index: 5},
    {interestName: 'Travel', index: 6},
    {interestName: 'Arts and Culture', index: 7},
    {interestName: 'Learning and Education', index: 8},
    {interestName: 'Regional and Cultural Interests', index: 9},
    {interestName: 'Entertainment', index: 10},
    {interestName: 'Dating And Party', index: 11},
  ];
  // const authData = useSelector(state=>state.myUserData);
  // console.log('my user data here ', authData.mydata.data._id)
    useEffect(() => {
        getAllUserData()
    }, [])
    const getAllUserData=()=>{
        axios.get('http://10.0.2.2:8000/api/users')
        .then((res)=>{
          console.log('My User Data :: ', res.data)
          setUsersData(res.data);
        })
        .catch((error)=>{
          console.log('Please check your email id or password ', error)
        })
    }
    
  return (
    <View style={{height: '100%', width: '100%', backgroundColor:'black'}}>
      {/* <Video
        source={require('../Images/video.mp4')}
        paused={false}
        style={styles.backgroundVideo}
        autoplay={true}
        repeat={true}
        muted={false}
        volume={1.0}
        resizeMode={'cover'}
      /> */}
      {/* <Loader visible={Loading} /> */}

      <View style={styles.topBar}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            padding: 10,
          }}>
          <View
            style={{
              // justifyContent: 'center', alignItems: 'center',
              borderRadius: 25,
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
              //  marginTop: 100, marginRight: 10,
            }}>
            <TouchableOpacity
              onPress={() => setFilterModal(true)}
              style={{flexDirection: 'row'}}>
              <View
                style={{
                  height: 50,
                  width: 90,
                  backgroundColor: '#202A44',
                  flexDirection: 'row',
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: 'white',
                }}>
                <Image
                  source={require('../Images/filter.png')}
                  style={{height: 30, width: 30, tintColor: 'white'}}
                />
                <Text style={{color: 'white', fontSize: 18, fontWeight: '600'}}>
                  Filter
                </Text>
              </View>
            </TouchableOpacity>
          
          </View>
      
        </View>
      </View>
      <View
        style={{
          borderBottomWidth: 2,
          borderBottomColor: '#707070',
          width: '100%',
          
        }}
      />
      <View style={styles.list}>
        {
        //userList !== null || userList == '' ?
        usersData ? (
          <FlatList
            style={{height: '100%'}}
            data={usersData}
            numColumns={2}
            renderItem={({item, index}) => {
              return (
                <View style={styles.userContainer}>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center', //flexDirection: 'row'
                    }}>
                    <TouchableOpacity onPress={() => selectedUserModal(item)}>
                      <Image
                        source={
                          item.profileImage == '' 
                            ? require('../Images/user.png')
                            : {uri: item.profileImage}
                        }
                        style={styles.user_Image}
                      />
                    </TouchableOpacity>
                    <View style={{marginBottom: 20, flexDirection: 'row'}}>
                      <Text style={styles.userText}>
                        {
                        item.name.substring().length <= 5
                          ? `${item.name}`
                          // ?item._data.name
                          : `${item.name.substring(0, 5)}...`
                          }
                        ,{item.age}
                      </Text>
                    </View>
                  </View>
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
              {expandSearch}
            </Text>
          </View>
        )}
      </View>

      <GestureRecognizer
        style={{flex: 1}}
        onSwipeDown={() => setShowOtherUserInfoModal(false)}
        onSwipeRight={() => setShowOtherUserInfoModal(false)}
        onSwipeLeft={() => setShowOtherUserInfoModal(false)}>
        <Modal
          visible={otherUserInfoModal}
          onRequestClose={() => {
            setShowOtherUserInfoModal(false);
          }}>
          <View
            style={{
              flex: 1,
              shadowColor: '#000',
              backgroundColor: '#1c1c1c',
              borderWidth: 0.3,
              borderColor: 'white',
              shadowOffset: {
                width: 12,
                height: 12,
              },
              shadowOpacity: 1,
              shadowRadius: 20.0,

              elevation: 24,
            }}>
            <ScrollView>
              {/* <FinalModal selectedUser={selectedUser} /> */}
            </ScrollView>
          </View>
        </Modal>
      </GestureRecognizer>
      <GestureRecognizer
        style={{flex: 1}}
        // onSwipeUp={() => setShowOtherUserInfoModal(true)}
        onSwipeDown={() => setShowOtherUserInfoModal(false)}>
        <Modal
          visible={false}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setShowOtherUserInfoModal(false);
          }}>
          <View
            style={{
              height: '95%',
              width: '90%',
              alignSelf: 'center',
              borderBottomRightRadius: 30,
              borderBottomLeftRadius: 30,
              marginTop: 15,
              borderRadius: 30,
              shadowColor: '#000',
              backgroundColor: 'white',
              borderWidth: 0.3,
              borderColor: 'black',
              shadowOffset: {
                width: 12,
                height: 12,
              },
              shadowOpacity: 1,
              shadowRadius: 20.0,

              elevation: 24,
              // shadowOffset:20,shadowColor:'black', shadowOpacity:1, shadowRadius:100, elevation:5
            }}>
            <ScrollView>
              <View
                style={{
                  height: '57%',
                  backgroundColor: 'white',
                  width: '100%',
                  alignSelf: 'center',
                  borderBottomRightRadius: 30,
                  borderBottomLeftRadius: 30,
                  borderRadius: 30,
                  // borderTopWidth: 30, borderColor: 'orange'
                }}>
                <View
                  style={[
                    styles.userProfileContainer,
                    {
                      height: 400,
                      width: '100%',
                      borderRadius: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      borderBottomRightRadius: 30,
                      borderBottomLeftRadius: 30,
                    },
                  ]}>
                  <Image
                    source={{uri: otherUserProfileImage}}
                    style={[
                      styles.user_Image,
                      {height: 100, width: 100, borderRadius: 50},
                    ]}
                  />
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{fontSize: 20, color: 'white', fontWeight: '600'}}>
                      {otherUserName},{' '}
                    </Text>
                    <Text
                      style={{fontSize: 20, color: 'white', fontWeight: '600'}}>
                      {otherUserAge}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 10,
                      marginTop: 40,
                      justifyContent: 'space-evenly',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 40,
                      }}>
                      <Text style={styles.EventPhotosNo}>
                        {otherUserEventsPosted <= 9
                          ? '0' + otherUserEventsPosted
                          : otherUserEventsPosted}
                      </Text>
                      <Text
                        style={[
                          styles.EventPhotosNo,
                          {color: '#999999', fontWeight: '500'},
                        ]}>
                        Events{' '}
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 40,
                      }}>
                      <Text style={styles.EventPhotosNo}>
                        {otherUserFollowers <= 9
                          ? '0' + otherUserFollowers
                          : otherUserFollowers}
                      </Text>
                      <Text
                        style={[
                          styles.EventPhotosNo,
                          {color: '#999999', fontWeight: '500'},
                        ]}>
                        Followers
                      </Text>
                    </View>
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={styles.EventPhotosNo}>
                        {otherUserFollowing <= 9
                          ? '0' + otherUserFollowing
                          : otherUserFollowing}
                      </Text>
                      <Text
                        style={[
                          styles.EventPhotosNo,
                          {color: '#999999', fontWeight: '500'},
                        ]}>
                        Following
                      </Text>
                    </View>
                  </View>
                  {/* message and follow button view */}
                  <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                    <TouchableOpacity
                      style={[styles.userButton, {marginTop: 30}]}
 //later                     // onPress={() =>
                      //   getFollowStatus(otherUserFollowersList)
                      //     ? unfollowUser(modalData)
                      //     : followFunction(modalData)
                      // }
                      >
                      <View style={{flexDirection: 'row'}}>
                        <Image
                          source={require('../Images/add-friend.png')}
                          style={{
                            height: 15,
                            width: 15,
                            alignSelf: 'center',
                            marginLeft: 10,
                            marginTop: 2,
                            tintColor: 'white',
                          }}
                        />
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 14,
                            margin: 10,
                            fontWeight: '700',
                          }}>
                          {/* later {getFollowStatus(otherUserFollowersList)
                            ? 'Unfollow'
                            : 'Follow'} */}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.userButton, {flexDirection: 'row'}]}
                      // onPress={() => sendNotification(token)}
                      onPress={() => navigateMessageScreen(modalData)}
                      // onPress=
                      // {() =>
                      //      navigation.navigate('Messages', { data: modalData, id: userId, myProfileImage: myProfileImage })
                      // }
                    >
                      {}
                      <Image
                        source={require('../Images/user-info.png')}
                        style={{
                          height: 15,
                          width: 15,
                          alignSelf: 'center',
                          marginLeft: 10,
                          marginTop: 2,
                          tintColor: 'white',
                        }}
                      />
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 12,
                          margin: 10,
                          fontWeight: '700',
                        }}>
                        Messages
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* message button view */}
                </View>
                <View style={{backgroundColor: 'white', borderRadius: 30}}>
                  <Text
                    style={{
                      fontSize: 23,
                      color: 'black',
                      margin: 15,
                      fontWeight: '700',
                    }}>
                    Photos
                  </Text>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      width: '100%',
                    }}>
                    {otherUserPhotos.length ? (
                      otherUserPhotos
                        .map((photos, myIndex) => {
                          return (
                            <View
                              key={myIndex}
                              style={{height: 100, width: '30%', margin: 5}}
                              //  style={{flexDirection:'row', height:150, width:'45%'}}
                            >
                              {/* <Text style={styles.item}>{person.name}</Text> */}
                              {/* <View style={{ height: 150, width: '45%' }}> */}
                              <TouchableOpacity
                                onPress={() => [
                                  setImageFullModal(!imageFullModal),
                                ]}>
                                {imageFullModal ? (
                                  <Image
                                    source={{uri: photos}}
                                    style={{
                                      height: 100,
                                      width: '100%',
                                      borderWidth: 1,
                                      borderColor: 'black',
                                      borderRadius: 10,
                                    }}
                                  />
                                ) : (
                                  <ScrollView
                                    horizontal={true}
                                    pagingEnabled
                                    decelerationRate={0.5}>
                                    {/* <TouchableOpacity onPress={() => setImageFullModal(false)}> */}
                                    <Image
                                      source={{uri: photos}}
                                      style={{
                                        height: Dimensions.get('window').height,
                                        width: Dimensions.get('window').width,
                                        resizeMode: 'contain',
                                        borderWidth: 1,
                                        borderColor: 'black',
                                        borderRadius: 10,
                                      }}
                                    />
                                    {/* </TouchableOpacity> */}
                                  </ScrollView>
                                )}
                                {/* Dimensions.get('window').height
Dimensions.get('window').width */}
                              </TouchableOpacity>
                              {/* </View> */}
                            </View>
                          );
                        })
                        .reverse()
                    ) : (
                      <Text
                        style={{
                          fontSize: 20,
                          alignSelf: 'center',
                          fontWeight: '500',
                          color: 'black',
                          marginBottom: 30,
                        }}>
                        No Photos to show{' '}
                      </Text>
                    )}
                  </View>
                  {/* <Image source={require('../Images/plus.png')}
                                        style={{ height: 100, width: 100, margin: 5, tintColor: 'black' }}
                                    />
                                    <Image source={require('../Images/plus.png')}
                                        style={{ height: 100, width: 100, margin: 5, tintColor: 'black' }}
                                    />
                                    <Image source={require('../Images/plus.png')}
                                        style={{ height: 100, width: 100, margin: 5, tintColor: 'black' }}
                                    />
                                    <Image source={require('../Images/plus.png')}
                                        style={{ height: 100, width: 100, margin: 5, tintColor: 'black' }}
                                    /> */}
                </View>
                <View style={{width: '100%', marginLeft: 10}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: 'black',
                      marginTop: 20,
                    }}>
                    About Me
                  </Text>
                  <Text
                    style={{fontSize: 22, fontWeight: '600', color: 'black'}}>
                    {otherUserAbout ? otherUserAbout : 'Not Available'}
                  </Text>
                </View>
                <View style={{width: '100%', marginLeft: 10}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: 'black',
                      marginTop: 20,
                    }}>
                    Interests
                  </Text>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: '600',
                      color: 'black',
                      marginBottom: 20,
                    }}>
                    {otherUserInterests ? otherUserInterests : 'Not Available'}
                  </Text>
                </View>
                <View style={{width: '100%', marginLeft: 10}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: 'black',
                      marginTop: 20,
                    }}>
                    Work
                  </Text>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: '600',
                      color: 'black',
                      marginBottom: 20,
                    }}>
                    {otherUserWork ? otherUserWork : 'Not Available'}
                  </Text>
                </View>
                <View style={{width: '100%', marginLeft: 10}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: 'black',
                      marginTop: 20,
                    }}>
                    Education
                  </Text>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: '600',
                      color: 'black',
                      marginBottom: 20,
                    }}>
                    {otherUserEducation ? otherUserEducation : 'Not Available'}
                  </Text>
                </View>
                <View style={{width: '100%', marginLeft: 10}}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: 'black',
                      marginTop: 20,
                    }}>
                    Location
                  </Text>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: '600',
                      color: 'black',
                      marginBottom: 20,
                    }}>
                    {otherUserInterests ? otherUserInterests : 'Not Available'}
                  </Text>
                </View>
              </View>
            </ScrollView>
            {/* <TouchableOpacity onPress={() => closeUserProfileModal()}>
                        <View style={{ height: 70, width: 150, borderRadius: 20, backgroundColor: 'black', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: '500', color: 'red' }}>close</Text>

                        </View>
                    </TouchableOpacity> */}
          </View>
        </Modal>
      </GestureRecognizer>
      <Modal
        visible={false}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setImageFullModal(false);
        }}>
        <View style={{backgroundColor: 'black', height: '100%', width: '100%'}}>
          <ScrollView
            horizontal={true}
            pagingEnabled
            decelerationRate={0.5}
            // style={{ width: '100%', height: '40%' }}
          >
            {otherUserPhotos.length ? (
              otherUserPhotos
                .map((photos, myIndex) => {
                  indexOpen = myIndex;
                  return (
                    <View key={indexOpen}>
                      <Text style={{fontSize: 20, color: 'white'}}>
                        {indexOpen}{' '}
                      </Text>
                      {/* <Image source={{ uri: photos }}
                                style={{ height: 300, width: '95%', margin: 5, borderWidth: 1, borderColor: 'black', borderRadius: 10 }}
                              /> */}
                      {/* <Text style={{color:'white', fontSize:18, margin: 10}}>{index1}</Text> */}
                      <Image
                        source={{uri: photos}}
                        style={{
                          height: Dimensions.get('window').height,
                          width: Dimensions.get('window').width,
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  );
                })
                .reverse()
            ) : (
              <Text
                style={{
                  fontSize: 20,
                  alignSelf: 'center',
                  fontWeight: '500',
                  color: 'black',
                  marginBottom: 30,
                }}>
                No Photos to show{' '}
              </Text>
            )}
          </ScrollView>
        </View>
      </Modal>
      {/* filter modal */}
      <Modal
        visible={filterModal}
        transparent={true}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          alignContent: 'flex-end',
        }}
        onRequestClose={() => {
          setFilterModal(false);
        }}>
        <View
          style={{
            flex: 1,
            alignSelf: 'flex-end',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            height: '50%',
            width: '100%',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              alignSelf: 'flex-end',
              height: '95%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              borderWidth: 4,
              borderColor: 'purple',
            }}>
            <View
              style={{
                width: '90%',
                height: '90%',
                backgroundColor: 'white',
                marginBottom: 110,
                marginTop: 40,
              }}>
             
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '700',
                  color: '#707070',
                  margin: 20,
                }}>
                Gender
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setFilterGender('Male');
                    setFilterGenderAll('');
                  }}
                  style={{
                    marginLeft: 10,
                    width: 100,
                    height: 50,
                    backgroundColor:
                      filterGender == 'Male' ? 'blue' : 'white',
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth:2,
                    borderColor:'black'
                  }}>
                  <Text
                    style={{color:  filterGender == 'Male' ?'white':'black', fontSize: 20, fontWeight: '500'}}>
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setFilterGender('Female');
                    setFilterGenderAll('');
                  }}
                  style={{
                    width: 100,
                    height: 50,
                    backgroundColor:
                      filterGender == 'Female' ? 'blue' : 'white',
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth:2,
                    borderColor:'black'
                  }}>
                  <Text
                    style={{color: filterGender == 'Female' ? 'white':'black', fontSize: 20, fontWeight: '500'}}>
                    Female
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setFilterGenderAll('Both');
                    setFilterGender('');
                  }}
                  style={{
                    marginRight: 5,
                    width: 100,
                    height: 50,
                    backgroundColor:
                      filterGenderAll == 'Both' ? 'blue' : 'white',
                    borderRadius: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth:2,
                    borderColor:'black'
                  }}>
                  <Text
                    style={{color: filterGenderAll?'white':'black', fontSize: 20, fontWeight: '500'}}>
                    Both
                  </Text>
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  fontSize: 20,
                  color: '#707070',
                  fontWeight: '700',
                  margin: 10,
                }}>
                Age Range : {Math.floor(minAge)} to {Math.floor(maxAge)}
              </Text>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#707070',
                    fontWeight: '700',
                    margin: 10,
                  }}>
                  Minimum Age {Math.floor(minAge)}
                </Text>

                <Slider
                  style={{width: 300, height: 50}}
                  minimumValue={18}
                  maximumValue={100}
                  minimumTrackTintColor="black" //"#FFFFFF"
                  maximumTrackTintColor="blue" //"#000000"
                  onValueChange={value => setMinAge(value)}
                />
                <Text
                  style={{
                    fontSize: 20,
                    color: '#707070',
                    fontWeight: '700',
                    margin: 10,
                  }}>
                  Maximum Age {Math.floor(maxAge)}
                </Text>

                <Slider
                  style={{width: 300, height: 50}}
                  minimumValue={minAge}
                  maximumValue={100}
                  minimumTrackTintColor="black" //"#FFFFFF"
                  maximumTrackTintColor="blue" //"#000000"
                  // inverted={true}
                  onValueChange={value => setMaxAge(value)}
                />
                {/* <Text
                  style={{
                    fontSize: 20,
                    color: '#707070',
                    fontWeight: '700',
                    margin: 10,
                  }}>
                  Maximum Distance {Math.floor(maxDistance)} kM
                </Text> */}

                {/* <Slider
                  style={{width: 300, height: 50}}
                  minimumValue={10}
                  maximumValue={1000}
                  minimumTrackTintColor="black" //"#FFFFFF"
                  maximumTrackTintColor="blue" //"#000000"
                  // inverted={true}
                  onValueChange={value => setMaxDistance(value)}
                /> */}
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 50,
                  }}>
                  <TouchableOpacity
                    onPress={() => showInterestModal()}
                    style={[
                      styles.userButton,
                      {
                        backgroundColor: 'white',
                        width: 250,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth:2,
                        borderColor:'black'
                      },
                    ]}>
                    <Text
                      style={{color: 'black', fontSize: 20, fontWeight: '400'}}>
                      Filter Interest
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 50,
                  }}>
                  <TouchableOpacity
                    onPress={() => userFilterData()}
                    style={[
                      styles.userButton,
                      {
                        backgroundColor: 'white',
                        width: 300,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth:2,
                        borderColor:'black'
                      },
                    ]}>
                    <Text
                      style={{color: 'black', fontSize: 20, fontWeight: '600'}}>
                      Apply Filters
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={interestModal}
        onRequestClose={() => {
          setInterestModal(false);
        }}>
        <View
          style={{
            height: '80%',
            width: '90%',
            padding: 10,
            borderRadius: 15,
            elevation: 100,
            shadowColor: 'indigo',
            shadowOffset: {
              width: 3,
              height: 3,
            },
            shadowRadius: 5,
            shadowOpacity: 1.0,
            backgroundColor: 'white',
            alignSelf: 'center',
            marginTop: 100,
            marginBottom: 50,
            flexWrap: 'wrap',
          }}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <View style={{margin: 5}}>
              {interests.map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      alignContent: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                        borderRadius: 40,
                        width: 300,
                        height: 50,
                        backgroundColor: '#E2DFD2',
                        marginVertical: 5,
                        justifyContent: 'flex-start',
                        marginLeft: 2,
                        flexDirection: 'row',
                      }}
                      onPress={() => selectInterest(item)}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        {selectedView === index ? (
                          <View
                            style={{
                              backgroundColor: 'red',
                              marginTop: 6,
                              marginLeft: 15,
                              borderWidth: 1,
                              height: 25,
                              width: 25,
                              borderRadius: 15,
                              borderColor: 'blue',
                            }}
                          />
                        ) : (
                          <View
                            style={{
                              borderWidth: 1,
                              height: 25,
                              width: 25,
                              marginLeft: 15,
                              borderRadius: 15,
                              borderColor: 'blue',
                              marginTop: 6,
                            }}
                          />
                        )}
                      </View>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{fontSize: 18, color: 'blue', marginLeft: 10}}>
                          {item.interestName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  userProfileContainer: {
    height: 400,
    justifyContent: 'center',
    backgroundColor: '#202A44',
    borderWidth: 2,
    borderBottomRightRadius: 40,
    borderBottomLeftRadius: 40,
  },
  EventPhotosNo: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
    alignSelf: 'center',
  },
  userContainer: {
    justifyContent: 'center',
    backgroundColor: '#202A44',
    alignItems: 'center',
    // backgroundColor:'#202A44',#30313A
    width: '45%',
    height: 220,
    borderWidth: 0.5,
    borderColor: '#ff8501',
    borderRadius: 25,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  userMapping: {
    marginLeft: 10,
  },
  userText: {
    fontSize: 25,
    fontWeight: '500',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: -5,
    color: 'white',
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
    marginLeft: 10,
  },
  user_Image: {
    width: 82,
    height: 82,
    borderRadius: 41,
    margin: 8,
    borderWidth: 0.2,
    borderColor: '#ff8501',
    justifyContent: 'center',
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
    height: '10%',
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    flexDirection: 'row',
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: '#707070',
    marginTop: 10,
  },
  list: {
    height:'90%',
    alignSelf: 'center',
    marginTop: 1,
    // height: '73%',
    // marginBottom: 10,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: '100%',
    width: '100%',
  },
});
export default AllUserData