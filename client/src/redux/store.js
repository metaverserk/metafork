import {combineReducers, legacy_createStore} from 'redux';
import profileReducer from './reducers/profileReducer';
import dialogsReducer from './reducers/dialogsReducer';
import dialogReducer from './reducers/dialogReducer';
import feedReducer from './reducers/feedReducer';
import usersReducer from './reducers/usersReducer';
import authReducer from './reducers/authReducer';
import postReducer from './reducers/postReducer';
import notificationReducer from './reducers/notificationReducer';



let reducers = combineReducers({
    profile:profileReducer,
    dialogs:dialogsReducer,
    dialog:dialogReducer,
    feed:feedReducer,
    users:usersReducer,
    auth:authReducer,
    post:postReducer,
    notification:notificationReducer,
})

let store = legacy_createStore(
    reducers,   
);

window.store = store;

export default store





