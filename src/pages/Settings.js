import { useEffect, useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles'
import { connect } from 'react-redux'
import { getProfileData} from '../redux/actions/profileActions'
import { editBio } from '../redux/actions/userActions'
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import $ from 'jquery';
import SpotifySearch from "../components/SpotifySearch"

const styles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

const Settings = (props) => {
	const [form, setForm] = useState(false)
	const [pfp, setPfp] = useState(props.user.profilepic)
	const [dialog, setDialog] = useState(false)
	const classes = styles()
	const submitBio = () => {
		setForm(false)
		props.editBio(document.getElementById('bioInput').value, props.auth.token, props.auth.expires, props.auth.rtoken, props.history)
	}
	const pfpChange = () => {
        	var file = $('#pfpInput').prop('files')[0];
		if(file.type.includes("image")){
			setPfp(URL.createObjectURL(file))
		}
	}
	const submitPfp = () => {
		let formData = new FormData()
		formData.append()
	}
	const cancelPfp = () => {
		setPfp(props.user.profilepic)
		$('#pfpInput').val('')
	}
	return (
		<Container>
		{props.user.loading ? <h1>Loading</h1> : (
		<div>
		<h2>Settings!</h2>
		<label htmlFor="pfpInput">Profile Pic:</label>
		<input type="file" id="pfpInput" onChange={pfpChange}/>
		<img src={pfp} alt="cantfind"/>
		{pfp !== props.user.profilepic ? (
			<div>
				<button type="button" onClick={cancelPfp}>Cancel</button> 
				<button type="button">Submit</button>
			</div>
		) : null}
		{form ? (
			<div style={{display: "inline"}}><label htmlFor="bioInput">Bio: </label><input type="text" id="bioInput" autoComplete="off" defaultValue={props.user.bio}/><EditIcon onClick={() => setForm(!form)}/><button type="button" onClick={submitBio}>Submit</button></div>
		): <h3>Bio: {props.user.bio} <EditIcon onClick={() => setForm(!form)}/></h3> }
		<h3>Favorite Artists:</h3>
		{dialog ? <SpotifySearch/> : null}
		</div>
		)}</Container>
	);
}

const mapStateToProps = (state) => ({
    user: state.user,
    auth: state.auth
})

const mapActionsToProps = {
    getProfileData,
    editBio
}

export default connect(mapStateToProps, mapActionsToProps)(Settings)