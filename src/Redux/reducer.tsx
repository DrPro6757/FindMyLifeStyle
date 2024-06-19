import * as types from "../Redux/actionTypes";
const initialState = {
    contacts:[],
    contact:{}
}

const contactReducer = (state = initialState, action)=>{
    switch(action.type){
        case types.GET_CONTACTS:
            return{
                ...state,
                contacts: action.payload,
            }
       
       
      
        
        default:
            return state;
    }
};

export default contactReducer;
