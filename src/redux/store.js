import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import userReducer from './reducers/userReducer'
import profileReducer from './reducers/profileReducer'

const initialState = {}

const middleware = [thunk]

const reducers = combineReducers({
    user: userReducer,
    profile: profileReducer 
})

const store = createStore(reducers, initialState, compose(applyMiddleware(...middleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()))

export default store
