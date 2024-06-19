import * as types from "./actionTypes";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const getUsers = (users) =>({
  type : types.GET_USERS,
  payload: users,
});

export const getUsersInitiate =()=>{
  return function(dispatch){
     let tempUsers = []
     firestore()
     .collection('users')
     .get()
     .then(querySnapshot => {
       // console.log('Total posts: ', querySnapshot.size);

       querySnapshot.forEach(documentSnapshot => {
          tempUsers.push(documentSnapshot.data());
        //  console.log('all users with redux: ', documentSnapshot.id, documentSnapshot.data());
       });
       dispatch(getUsers(tempUsers));
      });
  }
}

const getMyUserData = (mydata) =>({
    type : types.GET_MYUSERDATA,
    payload: mydata,
});

export const getMyUserDataAction =(myDataFromAPI)=>{
  //last later
    // return function(dispatch){
    //    let tempMyData = []
    //   firestore()
    //   .collection('users')
    //   .doc(auth().currentUser?.uid)
    //   .get()
    //   .then(documentSnapshot => {

    //     if (documentSnapshot.exists) {
    //       tempMyData.push(documentSnapshot.data())
    //     }
    //     dispatch(getMyUserData(tempMyData));
    //   });
    // }
    return function(dispatch){
      dispatch(getMyUserData(myDataFromAPI));
    }
    
}

const getMyFollowing = (following) =>({
  type : types.GET_MYFollowing,
  payload: following,
});

export const getMyFollowingAction =()=>{
  return function(dispatch){
     let tempMyFollowing = []
    firestore()
    .collection('users')
    .doc(auth().currentUser?.uid)
    .get()
    .then(snapshot => {
      tempMyFollowing = snapshot._data.following;

      console.log("My Following list (((((((((((((()))))))))))))):: " + tempMyFollowing);
      
      dispatch(getMyFollowing(tempMyFollowing));

    })
  }
}



