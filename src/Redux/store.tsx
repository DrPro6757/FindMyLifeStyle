import {createStore, applyMiddleware} from "redux";
import { thunk } from "redux-thunk";
import rootReducer from "./rootReducer";
import logger from "redux-logger";
const middleware = [thunk];

if(process.env.NODE_ENV === "development"){
    middleware.push(logger);
}
devTools : false

const store = createStore(rootReducer, applyMiddleware(...middleware));
export default store;