import {Fragment} from "react"
import Comment from "./Comment"

export const CommentList = ({comments, history}) => {
  return (
    <Fragment>
      {comments.map((e, index) => {
        return <Comment element={e} key={index} history={history} />
      })}
    </Fragment>
  )
}

export default CommentList
