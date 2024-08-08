import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Modal, Alert, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import MapView, { Callout, CalloutSubview, MapCalloutSubview, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import GestureRecognizer from 'react-native-swipe-gestures';
import QRCode from 'react-native-qrcode-svg';
import { BASE_URL, Get_EVENT_POST_COMMENTS, LIKE_EVENT_POST } from '../Utils/Strings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDistance } from 'geolib';
import MapViewDirections from 'react-native-maps-directions';
import LottieView from 'lottie-react-native';
import Share from 'react-native-share';
import VideoPlayer from 'react-native-video-controls';
import Carousel from 'react-native-reanimated-carousel';

const MapScreen = ({ navigation }) => {
  // const navigation = useNavigation();
  const isFocused = useIsFocused();
  const GOOGLE_MAPS_APIKEY = 'AIzaSyASO9jB5BCFaUigIr7PPhyvW13-fhYhEsU'

  const [eventRoute, setEventRoute] = useState(false)

  const [bottomSheet, setBottomSheet] = useState(false)
  const [eventTypeBottom, setEventTypeBottom] = useState('Public')

  //  {"latitude": 51.55078113655277, "longitude": -0.09886354207992554}
  const [myLatitudes, setMyLatitudes] = useState(51.55078113655277)
  const [myLongitudes, setMyLongitudes] = useState(-0.09886354207992554)
  const [allEventPostData, setAllEventPostData] = useState([]);
  const [PermissionEventPostData, setPermissionEventPostData] = useState([]);
  const [eventInfoModal, setEventInfoModal] = useState(false)
  const [fullScreen, setFullScreen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [eventStatus, setEventStatus] = useState('');
  const [myDistance, setMyDistance] = useState();

  const [myUserData, setMyUserData] = useState('')
  const [myUserID, setMyUserID] = useState([])
  const [myWishlist, setMyWishlist] = useState([])
  const [updateState, setUpdateState] = useState(false)
  const [commentList, setCommentList] = useState([])

  const [tab, setTab] = useState('1')

  const [eventOptionsModal, setEventOptionsModal] = useState(false)
  const [selectedEventCategory, setSelectedEventCategory] = useState('Friends and Family')
  const [selectedEventType, setSelectedEventType] = useState('events')

  const mapNightStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#263c3f"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6b9a76"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#38414e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#212a37"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9ca5b3"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#1f2835"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#f3d19c"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2f3948"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#515c6d"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    }
  ]
  const mapDarkStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#181818"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1b1b1b"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#2c2c2c"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8a8a8a"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#373737"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3c3c3c"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#4e4e4e"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3d3d3d"
        }
      ]
    }
  ]
  const mapAubergineStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8ec3b9"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1a3646"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#64779e"
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#334e87"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6f9ba5"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3C7680"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#304a7d"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2c6675"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#255763"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#b0d5ce"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3a4762"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#0e1626"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#4e6d70"
        }
      ]
    }
  ]
  const mapRetroStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8ec3b9"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1a3646"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#64779e"
        }
      ]
    },
    {
      "featureType": "administrative.province",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#4b6878"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#334e87"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6f9ba5"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3C7680"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#304a7d"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2c6675"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#255763"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#b0d5ce"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#023e58"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#98a5be"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1d2c4d"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#283d6a"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3a4762"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#0e1626"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#4e6d70"
        }
      ]
    }
  ]
  const mapSilverStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ]

  const originLoc = {
    latitude: myLatitudes,
    longitude: myLongitudes,
  }
  // {
  //   latitude: 28.450627,
  //   longitude: -16.263045,
  // }
  // event longi -0.1043396070599556
  // event latitude 51.565497352241934
  const origin = {latitude: 51.55078113655277, longitude: -0.09886354207992554};
const destination = {latitude: 51.565497352241934, longitude: -0.1043396070599556};
  const destinationLoc = {
    latitude: -0.1043396070599556,
    longitude: 51.565497352241934,
  }
  const weatherLat = 51.5072 // 51.5072 // 53.90962   33.6995
  const weatherLong = 0.1276 //0.1276   //-8.750016   73.0363
  const time = 'night'
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${weatherLat}&lon=${weatherLong}&appid=75c3536f603dda21068c3dbcd7619477&units=metric`
  type Weather = {
    name:string,
    main: {
      "temp": number,
      "feels_like": number,
      "temp_min": number,
      "temp_max": number,
      "pressure": number,
      "humidity": number
    },
    weather:[
      {
        id: string;
        main: string;
        description: string;
        icon: string;
    }
  ]
  }
  // Weather.weather[0].main === 'Rain'
  const [weatherData, setWeatherData] = useState<Weather>()

  const fetchWeatherData=async()=>{
    const results = await fetch(weatherUrl);
    const data = await results.json();
    // console.log(JSON.stringify(data, null, 2));
    setWeatherData(data);
    // console.log('weather location name = ',weatherData)

  }
  // AsyncStorage.setItem('USER_DATA_ID', res.data.data._id)
  // console.log('data from async here in login ', AsyncStorage.getItem('USER_DATA_ID'))
  // AsyncStorage.setItem('isLoggedIn', '')
  useEffect(() => {
    fetchWeatherData()
    // getMyData()
    SingedInUserData()
    getAllEventData()
    // getAllEventsWithPermission()
  }, [updateState, eventTypeBottom])
  if(!weatherData){
    console.log('Loading Screen')
  }

  async function SingedInUserData(){
    const token = await AsyncStorage.getItem('token')
    axios.post(BASE_URL+'users/data',{token:token})
    .then((res)=>{
      console.log('My Acutal data', res.data)
      setMyUserData(res.data.data)
    })

  }

  const getMyData = () => {
    //http://10.0.2.2:8000/api/
    axios.get(BASE_URL+'users/6639fcc4e42506e0b5c65f0e')
      .then((res) => {
        console.log('My User Data :: ', res.data._id)
        setMyUserID(res.data._id)
        setMyUserData(res.data);
        setMyWishlist(res.data.EventsWishList);
      })
      .catch((error) => {
        console.log('Please check your email id or password ', error)
      })
  }
  const getAllEventsWithPermission=()=>{
    // /api/eventpostsget/viewpermission/:id
    const userId = myUserData._id;

    axios.get(BASE_URL+'eventpostsget/viewpermission'+ userId)//6638887d3fcacb60081317c5
    .then((res) => {
      //6639fcc4e42506e0b5c65f0e
      console.log('my permission id == ', userId)
      console.log('event which are permitted == ',res)
      // console.log('event data for all events ', res.data)
    })
    .catch((error) => {
      console.log('Please check your email id or password ', error)
    })
  }
  const getAllEventData = () => {
    // send a post request to the backend API for Login
    // http://10.0.2.2:8000/api/
    axios.get(BASE_URL+'eventposts')
      .then((res) => {
        // console.log('event data for all events ', res.data)
        let tempEventData = []
          res.data.map(item=>{
            console.log('Permission = ',item.viewPermission)
            console.log('Permission and my id = ',myUserData._id)
            if(eventTypeBottom == 'Friends'){
            if(item.viewPermission == myUserData._id)
            {
              tempEventData.push(item);

           console.log('Permission to view ',item.eventName)
            }
          }
            else if('Public'){
              if(item.viewPermission != myUserData._id)
            {
              tempEventData.push(item)
              // setAllEventPostData(item);
              console.log('Permission to view without permission',item.eventName)
              console.log('image path ',item.imageUrl[0].imageUrl[0])

            }
            }
          })
          // console.log('temp event data  = ',tempEventData)
       setAllEventPostData(tempEventData)

        // setAllEventPostData(res.data);
          // console.log('Permission to view for all the events',res.data.eventName)

      })
      .catch((error) => {
        console.log('Please check your email id or password ', error)
      })

    setUpdateState(true)
    isFocused
  }

  const timeDiffernce = (previous) => {
    const current = new Date();
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerWeek = msPerDay * 7;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;
    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + ' seconds ago';
    }
    else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }
    else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + ' hours ago';
    }
    //later
    else if (elapsed < msPerWeek) {
      return Math.round(elapsed / msPerDay) + ' week ago';
    }
    //
    else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + ' months ago';
    }
    else {
      return Math.round(elapsed / msPerYear) + ' years ago';
    }
  }
 
  /// like api
  const onEventPostLike = (id) => {
    console.log('event id : ', id)
    const postEventData = {
      userId: "6639fcc4e42506e0b5c65f0e",
    }
    axios.put(BASE_URL+'eventposts/like/' + id, postEventData)
      .then((res) => {
        Alert.alert("You have successfully Liked Event Post")
        console.log(res);
        getAllEventData()
      })
      .catch((error) => {
        console.log('Event Like Failed ', error)
      })
  }
  const getLikeStatus = (likes) => {
    let isLiked = false
    likes.map(item => {
      if (item == myUserID) {
        isLiked = true
      }
    })
    return isLiked
  }
  const onEventPostJoin = (id) => {
    console.log('event id : ', id)
    const postEventData = {
      userId: "6639fcc4e42506e0b5c65f0e",
    }
    axios.put(BASE_URL+'eventposts/join/' + id, postEventData)
      .then((res) => {
        Alert.alert("You have successfully Joined Event")
        console.log(res);
        getAllEventData()
      })
      .catch((error) => {
        console.log('Event Joining Failed ', error)
      })
  }
  const getJoinStatus = (eventMembersList) => {
    let isJoined = false
    eventMembersList.map(item => {
      if (item == myUserID) {
        isJoined = true
      }
    })
    return isJoined
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
  const FindMyRoute = (props) => {
    setEventRoute(true)
    const originLoc = {
      latitude: myLatitudes,
      longitude: myLongitudes,
    }
    // {
    //   latitude: 28.450627,
    //   longitude: -16.263045,
    // }
    const destinationLoc = {
      latitude: props.selectedEvent.location.coordinates[1],
      longitude: props.selectedEvent.location.coordinates[0],
    }
  }
  const GetAllComments = (props) => {
    axios.get(BASE_URL + Get_EVENT_POST_COMMENTS + selectedEvent._id)
        .then((res) => {
            console.log('All Comments ', res.data);
            setCommentList(res.data)
        })
        .catch((error) => {
            console.log('Event Post Comment Failed ', error)
        })
}
const sharePostFtn=async(item)=>{
  // convert file into base64 format
  const shareoptioins = {
    message:item.imageUrl,
}
try {
  const ShareResponse = await Share.open(shareoptioins);
  console.log(JSON.stringify(ShareResponse));
} catch (error) {
  console.log('error message sharing :', error)
}
}
const AddToWishListFtn=(id)=>{
  console.log('event id : ', id)
  const postEventData = {
    eventId: id,
  }
  axios.put(BASE_URL+'users/wishlist/' + '6639fcc4e42506e0b5c65f0e', postEventData)
    .then((res) => {
      Alert.alert("You have successfully Added Event To Wishlist")
      console.log(res);
      getAllEventData()
      getMyData()
    })
    .catch((error) => {
      console.log('Event Addition to wishlist Failed ', error)
    })
}
const getWishlistStatus=(id)=>{

  let isAdded = false
  myWishlist.map(item => {
    if (item == id) {
      isAdded = true
    }
  })
  return isAdded
}

  const SelectedEventInModal = (props) => {
    console.log('Event lat and long ', props.selectedEvent.location.coordinates[0])
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

    var myDistanceFromEvent = getDistance(
      { latitude: props.selectedEvent.location.coordinates[1], longitude: props.selectedEvent.location.coordinates[0] },
      { latitude: myLatitudes, longitude: myLongitudes }
    );

    myDistanceFromEvent = myDistanceFromEvent / 1000;

    setMyDistance(myDistanceFromEvent);
    return (
      <View style={{
        flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%',
      }}>
        {/* <ScrollView> */}
        <View style={{
          height: '100%', width: '100%', backgroundColor: '#1e1e1e', borderRadius: 20,
          //    borderWidth: 1, borderColor: 'orange'
        }}>

          <View style={{ flex: 1 }} >
          <View 
          style={[styles.postImage, { width: '100%', height: 580,//backgroundColor:'#0e0e0e'
         }]}
          >
        {
                    //  props.selectedEvent.imageUrl[0].imageUrl.lenght > 0  ? // && imageState == false ?
                      // <Image source={{ uri: imagesMultiple[0].filename }} //imageData.assets[0].uri
                      //   style={{ width: '100%', height: 200, borderRadius: 10, borderWidth: 1, borderColor: 'black', alignSelf: 'center', marginLeft: 20, marginTop: 10 }} />
                    <View style={{alignSelf:'center'}}>
                      <Carousel
                      // loop
                      width={width/1.3}
                      height={width / 1}
                      autoPlay={false}
                      
                      // data={[...new Array(6).keys()]}
                      data={ props.selectedEvent.imageUrl[0].imageUrl}
                      scrollAnimationDuration={1000}
                      // onSnapToItem={(index) => [console.log('current index:', index),setStopAutoScroll(false),
                    //   index == 0 ? setPostType('post') : index == 1 ? setPostType('live') : index == 2
                    // ? setPostType('event') : index == 3 ? setPostType('story') : 
                    // [setPostType('reel'),{openCameraReel}]]}
                      renderItem={({ item,index }) => (
                          <View 
                           style={{flex:1, width:'100%',borderWidth:5,borderColor:'green', height:400,
                           backgroundColor:'white'// marginLeft:80
                          }}
                          >
                           
                              
                              <Image source={{ uri: item.imageUrl }} //imageData.assets[0].uri
                         style={{ width: '100%', height: 350, borderWidth:1, borderColor:'red'
                         // borderRadius: 10, borderWidth: 1, 
                      //   borderColor: 'black', alignSelf: 'center', marginLeft: 20, marginTop: 10 
                        }}/>
                        {/* {item.imageUrl?item.iamgUrl : null} */}
                        {/* <Text style={{color:'white', height:100, width:200}}>url 
                        </Text> */}
                              
                          </View>
                      )}
                  /> 
                  </View>
                      // :
                      // <Text style={{color:'#707070', width: '100%', height: 200}}> 
                      //   Image will appear hear</Text>
                        //  <Image source={require('../Images/user.png')} //imageData.assets[0].uri
                        //  style={{ width: '100%', height: 330, tintColor:'white',//borderRadius: 10, //borderWidth: 1, 
                        // // borderColor: 'black', 
                        //  //alignSelf: 'center', marginLeft: 20, marginTop: 10
                        //  }}/>
                              
                      
                  }
          </View>
           
            <TouchableOpacity style={{ width: 40, height: 40, top: 10, position: 'absolute', right: 10 }}
            >
              <Image source={require('../Images/list.png')}
                style={{ width: 40, height: 40, tintColor: 'red' }}
              />

            </TouchableOpacity>

          </View>
          {/* like comment share wishlist functions  */}
          <View style={{
            height: 120, width: '100%', backgroundColor: 'black',
            justifyContent: 'space-between', flexDirection: 'row'
          }}>
            <View style={{ flexDirection: 'row'}}>
              <View>
                <TouchableOpacity onPress={() => onEventPostLike(props.selectedEvent._id)}>

                  {
                    getLikeStatus(props.selectedEvent.postLikes)
                      ?
                      <Image source={(require('../Images/heartOn.png'))}
                        style={{ height: 35, width: 35, tintColor: 'red', margin: 10 }}
                      />
                      :
                      <Image source={(require('../Images/heart.png'))}
                        style={{ height: 35, width: 35, tintColor: 'white', margin: 10 }}
                      />
                  }
                </TouchableOpacity>
                {
                  props.selectedEvent.postLikes.length > 0
                    ?
                    props.selectedEvent.postLikes.length == 1
                    ?
                    <Text style={{ color: 'white', fontSize: 14, margin: 10 }}>{props.selectedEvent.postLikes.length} like</Text>
                    :
                    <Text style={{ color: 'white', fontSize: 14, margin: 10 }}>{props.selectedEvent.postLikes.length} likes</Text>
                    :
                    // <Text style={{color:'white', fontSize:14, margin:10}}>0 likes</Text>
                    null

                }

            <Text style={{ color: 'white' }}>
                  {
                 commentList.length > 0
                 ?
                 commentList.length == 1
                 ?
                 <Text style={{ color: 'white', fontSize: 14, margin: 10 }}>{commentList.length} comment</Text>
                 :
                 <Text style={{ color: 'white', fontSize: 14, margin: 10 }}>{commentList.length} comments</Text>
                 :
                 // <Text style={{color:'white', fontSize:14, margin:10}}>0 likes</Text>
                 null
                
                }
            </Text>

              </View>

              <TouchableOpacity
                onPress={() => [setEventInfoModal(false), navigation.navigate('Comments', { id: props.selectedEvent._id })]}
              >

                <Image source={(require('../Images/comment.png'))}
                  style={{ height: 35, width: 35, tintColor: 'white', margin: 10 }}
                />
                
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>sharePostFtn(props.selectedEvent)}>
                <Image source={(require('../Images/send.png'))}
                  style={{ height: 35, width: 35, tintColor: 'white', margin: 10 }}
                />
              </TouchableOpacity>
            </View>
            

            <View>
              <TouchableOpacity onPress={() => AddToWishListFtn(props.selectedEvent._id)}>
                {
                  getWishlistStatus(props.selectedEvent._id)?
                  <Image source={(require('../Images/wishlistAdded.png'))}
                    style={{ height: 35, width: 35, margin: 10 }}
                  />
                  :
                  <Image source={(require('../Images/wishList.png'))}
                  style={{height:35, width:35, tintColor:'white',margin:10}}
                  />
                }


              </TouchableOpacity>
              <Text style={{ color: 'white' }}>Wishlist</Text>
            </View>

          </View>

        

          {/* </View> */}
          <TouchableOpacity onPress={() => [setEventInfoModal(false), setFullScreen(false)]}
            style={[
              { alignSelf: 'flex-end', marginRight: 20, marginTop: 20 },
            ]}>
            <Image
              source={require('../Images/close.png')}
              style={[
                { height: 40, width: 40, borderRadius: 20, tintColor: 'red' },
              ]}
            />
          </TouchableOpacity>
          <Text style={{ marginLeft: 10, color: '#fff', fontSize: 35, fontWeight: '700' }}>
            {props.selectedEvent.eventName ? props.selectedEvent.eventName : ''}
          </Text>
          <Text style={{ color: 'white', fontSize: 15, marginLeft: 10, margin: 10 }}>
            {timeDiffernce(new Date(props.selectedEvent.createdAt))}
          </Text>
          <View style={styles.mainContainer}>
            <Text style={{ marginLeft: 10, margin: 10, color: '#fff', fontSize: 16, fontWeight: '400' }}>
              Posted By
            </Text>
            <TouchableOpacity style={{ flexDirection: 'row' }}
              onPress={() => [setEventInfoModal(false),navigation.navigate('UsersProfiles', { data: props.selectedEvent.userId })]}
            >

              {
                // this.state.ImageURI !== '' ? <Image source={this.state.ImageURI} /> :null
                props.selectedEvent.profilePic === undefined || props.selectedEvent.profilePic === "" ?
                  <Image
                    source={(require('../Images/user.png'))}
                    style={[styles.userImage, { width: 30, height: 30, borderRadius: 15 }]}
                  />
                  :
                  <Image
                    source={{ uri: props.selectedEvent.profilePic }}
                    style={[styles.userImage, { width: 30, height: 30, borderRadius: 15 }]}
                  />

              }
              <Text numberOfLines={1} style={[styles.userName, { color: '#fff', fontSize: 22 }]}>{props.selectedEvent.username}</Text>


            </TouchableOpacity>

          </View>
       
           {/* Navigate to Route Screen */}

           <View style={{width:'100%', height:70, justifyContent:'center', alignItems:'center'}}>
          <TouchableOpacity onPress={() => [ setEventInfoModal(false),
          //navigation.navigate('Route'),
          navigation.navigate('Route',{data:props.selectedEvent, userLat:myLatitudes, userLong:myLongitudes})

          // {
            // data:props.selectedEvent,
          //   originDataLat:51.55078113655277,
          //  originDataLong:-0.09886354207992554,
          //   destinationDataLat: props.selectedEvent.location.coordinates[1],
          //   destinationDataLong: props.selectedEvent.location.coordinates[0],
          // }
        ] 
          }
           style={{
            width: '100%', height: 60, borderRadius: 10, borderWidth: 1,
            borderColor: 'black', backgroundColor: 'hotpink', justifyContent:'center', alignItems:'center'
          }}
          >
                <Text style={{ fontSize:28, fontWeight:'700', color: 'white' }}>Take me there</Text>
            </TouchableOpacity>
            </View>

            {/* QR CODE STUFF */}

          <View style={{ flexDirection: 'row', padding: 20, height: 200, width: '100%', alignSelf: 'center', backgroundColor: eventStatus == 'Active' ? 'green' : 'orange', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: 'blue', fontWeight: '600', fontSize: 20, width: 100 }}>Scan QR Code To View
              More On Web</Text>
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

          {/* Tab Options */}
          
      <View style={{flexDirection:'row', marginVertical:20}}>
        <TouchableOpacity style={{width:'50%', height:50, backgroundColor: tab == '1' ?'red' : 'white', justifyContent:'center',
      alignItems:'center', borderWidth:1, borderColor:'green'}}
      onPress={()=>setTab('1')}
      >
          <Text style={{color:tab == '1' ?'white' : 'black', fontSize:22, fontWeight:'500'}}>Event Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{width:'50%', height:50, backgroundColor: tab == '2' ?'red' : 'white', justifyContent:'center',
      alignItems:'center', borderWidth:1, borderColor:'green'}}
      onPress={()=>setTab('2')}
      >
          <Text style={{color:tab == '2' ?'white' : 'black', fontSize:22, fontWeight:'500'}}>Join Event</Text>
        </TouchableOpacity>
      </View>
         
           
          {
            tab == '1'
            ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 140 }}>
            
             {/* Event Description */}
          <View>
            <Text style={{ color: '#fff', marginLeft: 15, fontSize: 20, fontWeight: 'bold' }}>
              Description</Text>
            <Text numberOfLines={3} ellipsizeMode='tail'
              style={{ fontSize: 20, color: '#fff', marginLeft: 25, marginVertical: 10 }}>
              {props.selectedEvent.eventDescription}</Text>
          </View>

             {/* Event Caption */}
          <View>
            <Text style={{ color: '#fff', marginLeft: 15, fontSize: 20 }}>
              {props.selectedEvent.caption}</Text>
          </View>

            {/* Event Distance */}
            <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
              {
                myDistance !== null ? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
                  Event Distance : {myDistance} miles away
                </Text> :
                  <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                    Event Distance : Not Mentioned
                  </Text>
              }
            </View>

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

             
            {/* Event Member joined */}
            <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
              {
                props.selectedEvent.eventMembersList.length !== 0 || props.selectedEvent.eventMembersList.length !== undefined ? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
                  Participants Joined : {props.selectedEvent.eventMembersList.length}
                </Text> :
                  <Text style={{ marginRight: 20, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                    Participants Joined : 0
                  </Text>
              }
            </View>
            
            {/* Event Total Members */}
            <View style={[styles.detailBox, { backgroundColor: 'black' }]}>

              <TouchableOpacity style={{ flexDirection: 'row' }}
                onPress={() => console.log('total members ', props.selectedEvent.members)}
              // onPress={() => item.likes == UserId ? onPostDislike(item) : onPostLiked(item)}
              >
                {
                  props.selectedEvent.members != null ? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
                    Total Members : {props.selectedEvent.members}
                  </Text> :
                    <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                      Total Members : Not Mentioned
                    </Text>
                }

              </TouchableOpacity>

            </View>

            {/* Event Data */}
            <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
              {
                props.selectedEvent.eventDate != null ? <Text style={{ marginLeft: 10, color: '#fff', fontSize: 16, fontWeight: '500' }}>
                  Event Date : {props.selectedEvent.eventDate}
                </Text> :
                  <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: '#fff' }}>
                    Event Date : Not Mentioned
                  </Text>
              }
            </View>

            {/* Event Time */}
            <View style={[styles.detailBox, { backgroundColor: 'black' }]}>
              {
                props.selectedEvent.eventTime != null ? <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: '500', color: '#fff' }}>
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
          :


            // { 
            //   props.selectedEvent.ticketFreeAmenities ? 
              <View style={[styles.detailBox, {
                marginLeft: 20, borderWidth: 0, height: 180,
                marginVertical: 20, justifyContent: 'space-evenly', backgroundColor: 'black'
              }]}>
                <TouchableOpacity style={{ width: '65%', height: '95%', backgroundColor: '#1e1e1e', }}
                  onPress={() => { setEventInfoModal(false); } }>

                  <Text style={{ marginTop: 3, alignSelf: 'center', color: 'white', fontSize: 20, fontWeight: '600' }}>
                    {props.selectedEvent.ticketFreeAmenities ? props.selectedEvent.ticketFreeAmenities : ''}
                    Anna's Jokes+ Home Made Lunch + Anna's Home Made Snacks
                    + Lol=Lot's of Love</Text>
                  <Text style={{ marginVertical: 10, alignSelf: 'center', color: '#3373C4', fontSize: 20, fontWeight: '600' }}>
                    Free</Text>

                </TouchableOpacity>

                <View
                  style={{ width: '30%' }}
                >
                  {/* #3373C4 */}
                  <TouchableOpacity
                    onPress={() => [Alert.alert('Event Joined Successfully'), onEventPostJoin(props.selectedEvent._id)]}
                    style={{
                      height: 50, backgroundColor: '#3373C4', borderRadius: 10, justifyContent: 'center', marginVertical: 5,
                      alignItems: 'center'
                    }}
                  >

                    {getJoinStatus(props.selectedEvent.eventMembersList) ?
                      <Text
                        style={{ alignSelf: 'center', color: 'white', fontSize: 20, fontWeight: '700' }}>
                        Joined
                      </Text>
                      :
                      <Text
                        style={{ alignSelf: 'center', color: 'white', fontSize: 20, fontWeight: '700' }}>
                        Join
                      </Text>}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      height: 50, backgroundColor: '#3373C4', borderRadius: 10, justifyContent: 'center',
                      alignItems: 'center', flexDirection: 'row'
                    }}
                  >

                    <TouchableOpacity>
                      <Text
                        style={{ alignSelf: 'center', color: 'white', fontSize: 20, fontWeight: '700' }}>
                        -
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{ alignSelf: 'center', color: 'white', fontSize: 20, fontWeight: '700' }}>
                      0
                    </Text>
                    <TouchableOpacity>
                      <Text
                        style={{ alignSelf: 'center', color: 'white', fontSize: 20, fontWeight: '700' }}>
                        +
                      </Text>
                    </TouchableOpacity>

                  </TouchableOpacity>
                </View>
              </View>
              // :
              // null
              // }
              
   
          
          }

        </View>
  
        {/* </ScrollView> */}
      </View>
    )
  }

  return (
    <View style={{ flex: 1, height: '100%', width: '100%' }}>
  
      <MapView
      
        style=//{StyleSheet.absoluteFill}
        {{ width: '100%', height: '100%' }}
        mapType= {time == 'day'? 'hybrid':'standard'}
        userInterfaceStyle='dark'
        customMapStyle={time == 'day' ? mapSilverStyle : mapRetroStyle}//
        initialRegion={{
          latitude: 51.50746, // 33.51995346211034, 73.08200449215008// 51.50746, -0.1277,
          longitude: -0.1277,
          latitudeDelta: 0.0922,//2
          longitudeDelta: 0.0421,//2
        }}
        onRegionChange={x => {
          // console.log(x);
        }}>

        {
          allEventPostData.length > 0 ?
            allEventPostData && 
            allEventPostData.map((marker, index) => {
              return (
                //  <Marker coordinate={marker.eventLocation}  longitude: marker.eventLocation.longitude 
                <Marker coordinate={{ latitude: marker.location.coordinates[1], longitude: marker.location.coordinates[0] }}
                  title='Test Map marker'
                  description='Test map marker with custom image'
                  // icon={require('../Images/user.png')}
                  key={index}
                  onPress={() => [selectedEventModal(marker), GetAllComments(marker)]}
                
                >
                  <View style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }}>


                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                      <TouchableOpacity onPress={() =>  [selectedEventModal(marker), GetAllComments(marker)]}
                      //onPress={() => { console.log('button clicked'); setFilterModal(true) }}
                      >


                        <Image source={require('../Images/map-marker.png')}
                          style={{ height: 75, width: 75 }} />
                        <View style={{
                          position: "absolute",
                        }}>
                          {
                            //later
                            marker.imageUrl[0].imageUrl[0] === ''
                              ?
                              null
                              :
                              <Image source={{ uri: marker.imageUrl[0].imageUrl[0] }}
                                style={{ height: 50, width: 50, borderRadius: 25, marginLeft: 13, marginTop: 5 }} />
                          }
                        </View>
                      </TouchableOpacity>
                    </View>

                  </View>

                  <Callout tooltip>
                    <View>

                      <View style={styles.bubble}>


                        <Text //style={{height:44, width: 44, borderWidth:1, borderColor:'red'}}
                        >

                          {
                            //later
                            marker.imageUrl[0].path === undefined || marker.imageUrl[0].path === ""
                              ?
                              null
                              :
                              <Image source={{ uri: marker.imageUrl[0].path }} resizeMode='cover'
                                style={{
                                  width: 30, height: 30, borderRadius: 15
                                }}
                              />
                          }
                        </Text>
                        <View style={{
                          flex: 1, height: '100%', width: '80%',
                          flexDirection: 'column', marginLeft: 2,
                          borderWidth: 1, borderColor: 'white',
                          flexWrap: 'wrap'
                        }}>
                          <View style={{ height: '70%', width: '100%', margin: 3 }}>
                            <Text style={{ fontSize: 15, fontWeight: '600', color: 'white' }}>{marker.eventName}</Text>



                            <View style={{ height: 30, width: 100 }}>

                            </View>
                          </View>

                        </View>
                      </View>
                    </View>
                  </Callout>
                </Marker>
              )
            })
            :
            null

        }
      </MapView>

      <View 
      style={{height:100, width:'100%', //backgroundColor:'orange',
       justifyContent:'center',alignItems:'center', borderRadius:10,
      position:'absolute', top:30, right:-100}}>
        <LottieView
        source={
          weatherData?.weather[0].main === 'Rain'
          ?
          require('../Animations/Rain.json')
          :
          weatherData?.weather[0].main === 'Clouds'
          ?
          require('../Animations/Clouds2.json')
          :
          weatherData?.weather[0].main === 'Sun' || 'Sunny' || 'Clear'
          ?
          require('../Animations/Sunny.json')
          :
          require('../Animations/Thunder.json')
          

        }
        style={{
          width:150,
          aspectRatio:1,
        }}
        loop
        autoPlay
        />
     
      </View>



      <View 
      style={{height:50, width:'95%', //backgroundColor:'orange',
      flexDirection:'row',
       justifyContent:'space-between',alignItems:'center', borderRadius:10,
      position:'absolute', bottom:60, right:10}}>
     
     <View>
      <Text style={{color:'white', fontWeight:'900',fontSize:22}}>
          {/* {weatherData?.weather[0].main == 'Rain' ? weatherData?.weather[0].main :'Sunny'} */}
          {weatherData?.weather[0].main}
        </Text>

        <Text style={{color:'white', fontWeight:'900',fontSize:25}}>{Math.round(weatherData?.main.temp)}°C</Text>
      </View>
     
      <TouchableOpacity onPress={()=>setBottomSheet(true)}
      >
      
        <Image source={require('../Images/list.png')}
        style={{width:40, height:40, tintColor:'orange'}}
        />

      </TouchableOpacity>
     
      </View>
     
     {/* Bottom Sheet */}
     <GestureRecognizer>
     <Modal transparent
     visible={bottomSheet}
     onRequestClose={()=>setBottomSheet(false)}
     >
      <View style={styles.bottomSheetView}>
        
        
        <View style={styles.bottomSheetHeading}>
          </View>

          <TouchableOpacity onPress={()=>[setEventTypeBottom('Public'), setBottomSheet(false)]}
          style={styles.bottomSheetHeadingButton}
          >
            <Text style={styles.bottomSheetHeadingButtonText}>Public</Text>
            <View style={{width:70, height:40, borderWidth:1, borderColor:"orange", borderRadius:20,
          justifyContent:'center'}}>
            {
              eventTypeBottom == 'Public'
              ?
              <View style={{width:60, height:30, borderWidth:1, borderColor:"red", borderRadius:20,
          backgroundColor:'white', alignSelf:'center'}}>

            </View>
            :
            null
            }
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>[setEventTypeBottom('Friends'), setBottomSheet(false)]}
          style={styles.bottomSheetHeadingButton}>
            <Text style={styles.bottomSheetHeadingButtonText}>Friends And Family</Text>
            <View style={{width:70, height:40, borderWidth:1, borderColor:"orange", borderRadius:20,
          justifyContent:'center'}}>
            {
              eventTypeBottom == 'Friends'
              ?
              <View style={{width:60, height:30, borderWidth:1, borderColor:"red", borderRadius:20,
          backgroundColor:'white', alignSelf:'center'}}>

            </View>
            :
            null
            }
            </View>
          </TouchableOpacity>
        
      </View>
     </Modal>
     </GestureRecognizer>
     
     {/* Event Info Modal */}
      <GestureRecognizer
        style={{ flex: 1 }}
        onSwipeUp={() => setFullScreen(true)}
        onSwipeRight={() => setFullScreen(true)}
        //  onSwipeUp={}

        onSwipeDown={() => { setEventInfoModal(false), setFullScreen(false) }}
      >

        <Modal visible={eventInfoModal}
          onRequestClose={() => { setEventInfoModal(false), setFullScreen(false) }}
          transparent={true}
        // style={{ justifyContent: 'flex-end', alignSelf:'flex-end', backgroundColor:'black',
        // alignItems: 'flex-end', alignContent: 'flex-end', height: fullScreen ? '100%':'30%',width: '100%' }}

        >
          {/* <View style={{flex:1}}> */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flex: 1, alignSelf: 'flex-end',
                justifyContent: 'flex-end', alignItems: 'flex-end', height: '99%', width: '100%'
              }}
            >
              <View
                style={{
                  backgroundColor: '#1e1e1e', alignSelf: 'flex-end', height: fullScreen ? '100%' : '99%', width: '100%', justifyContent: 'center', alignItems: 'center',
                  borderTopLeftRadius: 30, borderTopRightRadius: 30,// borderWidth: 1, borderColor: 'purple'
                }}
              >
                {/* <View style={{ flex: 1 }}> */}

                <SelectedEventInModal selectedEvent={selectedEvent}  />

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
const { height, width } = Dimensions.get('screen');

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
    // borderWidth: 1,
    // borderColor: 'black',
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
  bottomSheetView:{
    width:'100%',
    height:'60%',
    position:'absolute',
    bottom:0,
    backgroundColor:'orange'
  },
  bottomSheetHeading:{
    height:'20%',
    width:'100%',
    backgroundColor:'blue',
    justifyContent:'space-evenly',
    flexDirection:'row',
    alignItems:'center'
  },
  bottomSheetHeadingButton:{
    width:'100%',
    height:50,
    borderWidth:1,
    // borderRadius:10,
    flexDirection:'row',
    justifyContent:'space-between',
    padding:10,
    alignItems:'center',
    borderBlockColor:'white',
    backgroundColor:'black'
  },
  bottomSheetHeadingButtonText:{
    color:'white',
    fontWeight:'800',
    fontSize:20
  }
});
export default MapScreen
