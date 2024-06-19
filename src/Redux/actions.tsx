import * as types from "./actionTypes";
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const addContact =()=>({
    type: types.ADD_CONTACT,
});

const deleteContact =()=>({
    type: types.DELETE_CONTACT,
});



// const getAllEvents = (allevents) =>({
//     type : types.GET_ALLEVENTS,
//     payload: allevents,
// });

// export const getAllEventsInitiate =()=>{
//     return function(dispatch){
//        let tempAllEvents = []
//        firestore()
//        .collection('events')
//        .get()
//        .then(querySnapshot => {
//          // console.log('Total posts: ', querySnapshot.size);
 
//          querySnapshot.forEach(documentSnapshot => {
//             tempAllEvents.push(documentSnapshot.data());
//            console.log('all users with redux: ', documentSnapshot.id, documentSnapshot.data());
//          });
//          dispatch(getAllEvents(tempAllEvents));
//         });
//     }
// }

const getContacts = (contacts) =>({
    type : types.GET_CONTACTS,
    payload: contacts,
});

export const getContactsInitiate =()=>{
    return function(dispatch){
       let tempContacts = []
       firestore()
       .collection('contacts')
       .get()
       .then(querySnapshot => {
         // console.log('Total posts: ', querySnapshot.size);
 
         querySnapshot.forEach(documentSnapshot => {
            tempContacts.push(documentSnapshot.data());
        //    console.log('contact id and data: ', documentSnapshot.id, documentSnapshot.data());
         });
         dispatch(getContacts(tempContacts));
        });
    }
}

export const addContactInitiate = (contact) =>{
    return function(dispatch){
         firestore().collection("contacts").doc('2').set(contact);
        dispatch(addContact());
    }
}

export const deleteContactInitiate = (id) =>{
    return function(dispatch){
         firestore().collection("contacts").doc(id).delete();
        dispatch(deleteContact());
    }
}

