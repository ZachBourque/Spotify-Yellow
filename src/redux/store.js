import {createStore, combineReducers, applyMiddleware, compose} from "redux"
import thunk from "redux-thunk"

import authReducer from "./reducers/authReducer"
import userReducer from "./reducers/userReducer"
import dataReducer from "./reducers/dataReducer"
import UIReducer from "./reducers/UIReducer"

const initialState = {}

const middleware = [thunk]

const reducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  data: dataReducer,
  ui: UIReducer
})

const store = createStore(reducers, initialState, compose(applyMiddleware(...middleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()))

export default store
