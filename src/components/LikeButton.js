import React, { useEffect, useState } from 'react';
import ThumbUp from "@material-ui/icons/ThumbUp"
import ThumbUpOutline from "@material-ui/icons/ThumbUpOutlined"
import { connect } from 'react-redux'
import { likePost, unlikePost } from "../redux/actions/dataActions"
import ToolTip from "@material-ui/core/Tooltip"
import IconButton from "@material-ui/core/IconButton"

class LikeButton extends React.Component {
	liked = () => {
		return this.props.user.likes && this.props.user.likes.find(like => like?.postId === this.props?.postId)
	}

	likePost = () => {
		this.props.likePost(this.props.postId, this.props.auth.token, this.props.auth.expires, this.props.auth.rtoken)
	}

	unlikePost = () => {
		this.props.unlikePost(this.props.postId, this.props.auth.token, this.props.auth.expires, this.props.auth.rtoken)
	}
	
	render() {
	return (
		<React.Fragment>
		{this.props.auth.loggedIn ? (
			<React.Fragment>
			{this.liked() ? (
				<React.Fragment>
					<ToolTip title="Unlike Post" placement="top">
						<IconButton onClick={this.unlikePost}>
							<ThumbUp color="primary"/>
						</IconButton>
					</ToolTip>
				</React.Fragment>
			) : (
				<React.Fragment>
					<ToolTip title="Like Post" placement="top">
						<IconButton onClick={this.likePost}>
							<ThumbUpOutline/>
						</IconButton>
					</ToolTip>
				</React.Fragment>
			)}
			</React.Fragment>
		) : (
			<React.Fragment>
				<p>log in lol</p>
			</React.Fragment>
		)}
		</React.Fragment>
	)
	}
}

const mapStateToProps = (state) => ({
    user: state.user,
    auth: state.auth
})

const mapActionsToProps = {
    likePost,
    unlikePost
}

export default connect(mapStateToProps, mapActionsToProps)(LikeButton)