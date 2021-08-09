import { DATALOADING, SETCURRENT, SETSEARCHDATA, SETFEEDDATA, DELETEPOST, EDITPOST, SETCURRENTPOST, SETCOMMENTLIST, LIKEPOST, UNLIKEPOST, DELETECOMMENT } from '../types'
const initialState = {
	feed: [],
	current: [],
	loading: false,
	loaded: false
}

export default function(state = initialState, action){
    switch(action.type){
		case DATALOADING:
			return {...state, loading: true, loaded: false}
		case SETFEEDDATA:
			console.log("current")
			return {...state, feed: action.payload, loading: false, loaded: true, current: action.payload}
		case DELETEPOST:
			return {...state, feed: state.feed.filter(a => a.postId !== action.payload.id)}
		case EDITPOST:
			let idx = state.current.findIndex(post => post.postId === action.payload.id)
			state.current[idx] = {...state.current[idx], ...action.payload.changes}
			return {...state}
		case SETCOMMENTLIST:
			let newCommentList = [...state.currentPost.comments]
			newCommentList.push(action.payload.newComment)
			state.current[0].comments = newCommentList
			return {...state}
		case DELETECOMMENT:
			let newCurrent = state.current[0]
			newCurrent.comments = newCurrent.comments.filter(a => a.id !== action.payload.id)
			return {...state, current: state.current.comments.filter(a => {})}
		case LIKEPOST: 
			let likeidx = state.current.findIndex(post => post.postId === action.payload.postId)
			state.current[likeidx] = {...state.current[likeidx], likeCount: state.current[likeidx].likeCount + 1}
			return {...state}
		case UNLIKEPOST:
			let unlikeidx = state.current.findIndex(post => post.postId === action.payload.postId)
			state.current[unlikeidx] = {...state.current[unlikeidx], likeCount: state.current[unlikeidx].likeCount - 1}
			return {...state}
		case SETCURRENT:
			return {...state, current: action.payload, loading: false, loaded: true}
		default:
			return state
    }
}