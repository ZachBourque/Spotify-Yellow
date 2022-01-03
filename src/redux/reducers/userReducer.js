import {USERLOADING, SETUSERDATA, LOGOUT, UPDATEBIO, UPDATEFAVORITES, UPDATEPFP, LIKEPOST, UNLIKEPOST, MARKNOTIFICATIONSREAD, UPDATEUSERNAME} from "../types"

const initialState = {
  profilepic: null,
  posts: null,
  likes: null,
  favAlbums: [],
  favSongs: [],
  favArtists: [],
  bio: null,
  username: null,
  id: null,
  loading: false,
  loaded: false,
  notifications: null
}

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGOUT:
      return initialState
    case USERLOADING:
      return {...initialState, loading: true}
    case SETUSERDATA:
      return {...action.payload, loading: false, loaded: true}
    case UPDATEBIO:
      return {...state, bio: action.payload.bio}
    case UPDATEUSERNAME:
      return {...state, username: action.payload.username}
    case UPDATEFAVORITES:
      return {...state, ...action.payload}
    case UPDATEPFP:
      return {...state, profilepic: action.payload.pfp}
    case LIKEPOST:
      return {...state, likes: [...state.likes, action.payload.like]}
    case UNLIKEPOST:
      return {...state, likes: [...state.likes.filter(like => like.postId !== action.payload.postId)]}
    case MARKNOTIFICATIONSREAD:
      state.notifications.forEach(notification => (notification.read = true))
      return {...state}
    default:
      return state
  }
}
