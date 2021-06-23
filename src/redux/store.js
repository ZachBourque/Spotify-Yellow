import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import authReducer from './reducers/authReducer'
import profileReducer from './reducers/profileReducer'
import userReducer from './reducers/userReducer'
import dataReducer from './reducers/dataReducer'

const initialState = {}

const middleware = [thunk]

const reducers = combineReducers({
    auth: authReducer,
    user: userReducer,
    data: dataReducer,
    profile: profileReducer 
})

const store = createStore(reducers, initialState, compose(applyMiddleware(...middleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()))

export default store
