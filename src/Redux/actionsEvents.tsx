import * as types from "./actionTypes";
import firestore, { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert } from "react-native";

const getAllEvents = (allevents) =>({
    type : types.GET_ALLEVENTS,
    payload: allevents,
});


export const getAllEventsInitiate =()=>{
    return function(dispatch){
       let tempAllEvents = []
       firestore()
       .collection('events')
       .get()
       .then(querySnapshot => {
         // console.log('Total posts: ', querySnapshot.size);
 
         querySnapshot.forEach(documentSnapshot => {
            tempAllEvents.push(documentSnapshot.data());
        //    console.log('all users with redux: ', documentSnapshot.id, documentSnapshot.data());
         });
         dispatch(getAllEvents(tempAllEvents));
        });
    }
}

const getEventJoinRequest = (allevents) =>({
    type : types.Event_JoinRequest,
    payload: allevents,
});
const getMyEventJoinRequest = (myRequests) =>({
  type : types.MYEvent_JoinRequest,
  payload: myRequests,
});
// const getEventLikes= (myRequests) =>({
//   type : types.MYEvent_JoinRequest,
//   payload: myRequests,
// });
export const getEventJoinRequestOperation =(myID, posterId, postId)=>{
    return function(dispatch){
        let tempMembers = [];
        let membersNumbers;
        let tempMyEventMembers = [];
    
        // if (tempFollowing.length >= 1) {
        myMembers = firestore().collection('events').doc(postId)//EventPostId
          .get()
          .then(snapshot => {
            tempMembers = snapshot._data.eventJoinRequests;
            membersNumbers = snapshot._data.members;
    
            console.log("My Event Memebrs list :: " + tempMembers);
    
          })
          .catch(error => {
            console.log(error)
          });
        // if (tempMembers.length < membersNumbers) {
    
    
          if (tempMembers.length > 0) {
            tempMembers.map(item3 => {
    
              if (item3 !== myID) {
                firestore()
                  .collection('events')
                  .doc(postId)
                  .update({
                    // eventMembersList: firestore.FieldValue.arrayUnion(myUserId),
                    eventJoinRequests: firestore.FieldValue.arrayUnion(myID),
                  }).then(res => {
                    console.log("Another member requested to Join event :: " + myID);
                 //   statusJoinReq = true;
                    // return statusJoinReq;
                  }
    
                  ).catch(error => {
                    console.log(error);
                  })
                console.log('UUUUUUUUUUUUUUion 2nd array for likes::' + myID.toString());
                Alert.alert("Your Join Request Has Been Sent, Wait For Admin Permission");
              }
              else if (item3 === myID) {
                Alert.alert("Your Join Request Has Already Been Sent");
              }
    
            });
    
          } else {
            firestore()
              .collection('events')
              .doc(postId)
              .update({
                // eventMembersList: firestore.FieldValue.arrayUnion(myUserId),
                eventJoinRequests: firestore.FieldValue.arrayUnion(myID),
              }).then(res => {
                console.log("Another member Joined your event :: " + myID);
               // statusJoinReq = true;
                    // return statusJoinReq;
              }
    
              ).catch(error => {
                console.log(error);
              })
          }
        // } else {
        //   Alert.alert("Memeber List Is Full Please Contact Admin");
        // }
        let tempAllEvents = []
       firestore()
       .collection('events')
       .get()
       .then(querySnapshot => {
         // console.log('Total posts: ', querySnapshot.size);
 
         querySnapshot.forEach(documentSnapshot => {
            tempAllEvents.push(documentSnapshot.data());
        //    console.log('all users with redux: ', documentSnapshot.id, documentSnapshot.data());
         });
         dispatch(getEventJoinRequest(tempAllEvents));
        });
    }
}
export const getEventJoinRequestOperationTemp =(myID, posterId, postId)=>{
  let tempMembers = [];
  return function(dispatch){
    firestore().collection('events').doc(postId)//EventPostId
    .get()
    .then(snapshot => {
      tempMembers = snapshot._data.eventJoinRequests;

      console.log("My Event Memebrs list :: " + tempMembers);
      
      dispatch(getMyEventJoinRequest(tempAllEvents));

    })
    .catch(error => {
      console.log(error)
    });
  }
}




