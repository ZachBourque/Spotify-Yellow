import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText, Typography, TextField} from '@material-ui/core'
import { makeComment } from '../redux/actions/dataActions'
import { getNewToken } from '../redux/actions/authActions'
import DisplayData from './DisplayData'
import axios from 'axios'

export class SearchUsers extends Component {

    state = {
        searchText: '',
        users: [],
        filteredUsers: [],
    }

    componentDidMount () {
        axios.get('/users').then(res => {
            this.setState({users: res.data.users})
        })
    }

    searchTextChanged = (e) => {
        this.setState({ searchText: e.target.value })
        this.setState({filteredUsers: this.state.users.filter(user => {return user.username.includes(e.target.value)})})
        console.log(this.state.users.filter(user => {return user.username.includes(e.target.value)}))
    }

    handleClick = () => {

    }

    componentDidUpdate () {
        
    }

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose} maxWidth='xs' fullWidth>
                <DialogTitle id="">Search Users:</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        id="commentBody"
                        fullWidth
                        variant="outlined"
                        value={this.state.searchText}
                        onChange={this.searchTextChanged}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose} color="default">
                        Cancel
                    </Button>
                    <Button onClick={this.handleClick} color="primary" variant="contained">
                        Comment
                    </Button>
                </DialogActions>
                <DialogContent>
                </DialogContent>
            </Dialog>
        )
    }
}

const mapStateToProps = (state) => ({
    
})

const mapActionsToProps = {
    
}

export default connect(mapStateToProps, mapActionsToProps)(SearchUsers)
