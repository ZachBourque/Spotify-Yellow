import { Grid, Typography } from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux'
import fantano from "../assets/404.gif"


export const PageNotFound = (props) => {
    return (
        <Grid container justify="center" alignItems="center" direction="column">
            <Grid item>
                <Typography variant="h1">404. Not Found</Typography>
            </Grid>
            <Grid item>
                <img src={fantano} alt="404" />
            </Grid>
        </Grid>
    )
}

const mapStateToProps = (state) => ({

})

const mapActionsToProps = {

}

export default connect(mapStateToProps, mapActionsToProps)(PageNotFound)
