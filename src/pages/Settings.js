import { useEffect, useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles'
import { connect } from 'react-redux'
import { getProfileData} from '../redux/actions/profileActions'
import { editBio } from '../redux/actions/userActions'
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

const styles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
}));

const Settings = (props) => {
	const [form, setForm] = useState(false)
	const classes = styles()
	const submitBio = () => {
		setForm(false)
		props.editBio(document.getElementById('bioInput').value, props.auth.token, props.auth.expires, props.auth.rtoken, props.history)
	}
	return (
		<Container>
		{props.user.loading ? <h1>Loading</h1> : (
		<div>
		<h2>Settings!</h2>
		{form ? (
			<div style={{display: "inline"}}><label htmlFor="bioInput">Bio: </label><input type="text" id="bioInput" autoComplete="off" defaultValue={props.user.bio}/><EditIcon onClick={() => setForm(!form)}/><button type="button" onClick={submitBio}>Submit</button></div>
		): <h3>Bio: {props.user.bio} <EditIcon onClick={() => setForm(!form)}/></h3> }
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