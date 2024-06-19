import * as types from "../Redux/actionTypes";
const initialState = {
    mydata:[],
    users:[],
    following:[],
}

const userReducer = (state = initialState, action)=>{
    switch(action.type){
        case types.GET_USERS:
            return{
                ...state,
                users: action.payload,
            }
        case types.GET_MYUSERDATA:
            return{
                ...state,
                mydata: action.payload,
            }
        case types.GET_MYFollowing:
            return{
                ...state,
                following: action.payload,
            }
            
        default:
            return state;
    }
};

export default userReducer;
