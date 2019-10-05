import {applyMiddleware, combineReducers, createStore} from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk"
import user from "./reducers/userReducer"

export default createStore(combineReducers({ user}) , {} , applyMiddleware(logger , thunk,)+  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());