import {combineReducers} from 'redux';
import contactReducer from './reducer';
import eventReducer from './reducerEvents';
import userReducer from './reducerUser';

const rootReducer = combineReducers({
    data:contactReducer,
    eventData:eventReducer,
    myUserData:userReducer,
});

export default rootReducer;