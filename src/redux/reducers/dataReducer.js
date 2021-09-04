import {DATALOADING, SETPOSTS, DELETEPOST, EDITPOST, SETCOMMENTLIST, LIKEPOST, UNLIKEPOST, DELETECOMMENT, SETUSERS} from "../types"
const initialState = {
  posts: [],
  users: [],
  loading: false,
  loaded: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SETUSERS:
      return {...state, users: action.payload}
    case DATALOADING:
      return {...state, loading: true, loaded: false}
    case SETPOSTS:
      return {...state, posts: action.payload, loading: false, loaded: true}
    case DELETEPOST:
      return {...state, feed: state.feed.filter(a => a.postId !== action.payload.id)}
    case EDITPOST:
      let idx = state.posts.findIndex(post => post.postId === action.payload.id)
      state.posts[idx] = {...state.posts[idx], ...action.payload.changes}
      return {...state}
    case SETCOMMENTLIST:
      state.posts[0].comments.push(action.payload.newComment)
      return {...state}
    case DELETECOMMENT:
      state.posts[0].comments = state.posts[0].comments.filter(a => a.id !== action.payload.id)
      return {...state}
    case LIKEPOST:
      let likeidx = state.posts.findIndex(post => post.postId === action.payload.postId)
      state.posts[likeidx] = {...state.posts[likeidx], likeCount: state.posts[likeidx].likeCount + 1}
      return {...state}
    case UNLIKEPOST:
      let unlikeidx = state.posts.findIndex(post => post.postId === action.payload.postId)
      state.posts[unlikeidx] = {...state.posts[unlikeidx], likeCount: state.posts[unlikeidx].likeCount - 1}
      return {...state}
    default:
      return state
  }
}
