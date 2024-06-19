import * as types from "../Redux/actionTypes";
const initialState = {
    allevents:[],
    myRequests:[],
}

const eventReducer = (state = initialState, action)=>{
    switch(action.type){
      
        case types.GET_ALLEVENTS:
            return{
                ...state,
                allevents: action.payload,
            }
        case types.Event_JoinRequest:
            return{
                ...state,
                allevents: action.payload,
            }
            case types.MYEvent_JoinRequest:
                return{
                    ...state,
                    myRequests: action.payload,
                }
        default:
            return state;
    }
};

export default eventReducer;
