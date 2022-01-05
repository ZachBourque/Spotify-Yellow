import React from 'react'
import { connect } from 'react-redux'
import Comment from "./Comment"

export const CommentList = ({comments, history}) => {
    return (
        <div>
            {comments.map((e, index) => {
                return <Comment element={e} key={index} history={history} />
            })}
        </div>
    )
}

const mapStateToProps = (state) => ({

})

const mapActionsToProps = {

}

export default connect(mapStateToProps, mapActionsToProps)(CommentList)
