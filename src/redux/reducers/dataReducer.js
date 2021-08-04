import { DATALOADING, SETCURRENT, SETSEARCHDATA, SETFEEDDATA, DELETEPOST, EDITPOST, SETCURRENTPOST, SETCOMMENTLIST } from '../types'

const initialState = {
	feed: [],
	currentPost: null,
	loading: false,
	loaded: false
}

export default function(state = initialState, action){
    switch(action.type){
		case DATALOADING:
			return {...state, loading: true, loaded: false}
		case SETFEEDDATA:
			return {...state, feed: action.payload, loading: false, loaded: true}
		case DELETEPOST:
			return {...state, feed: state.feed.filter(a => a.postId !== action.payload.id)}
		case EDITPOST:
			let newFeed = [...state.feed]
			let newState = {...state}
			let post = newFeed.find(a => a.postId === action.payload.id)
			console.log(post)
			if(post){
				let idx = newFeed.indexOf(post)
				newFeed[idx] = {...post, ...action.payload.changes}
			}
			console.log(post)
			console.log(newFeed)
			return {state: newState, feed: newFeed}
		case SETCURRENTPOST:
			return {...state, currentPost: action.payload, loading: false, loaded: true}
		case SETCOMMENTLIST:
			let newCommentList = [...state.currentPost.comments]
			newCommentList.push(action.payload.newComment)
			state.currentPost.comments = newCommentList
			return {...state}
		default:
			return state
    }
}