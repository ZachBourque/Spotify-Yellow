import { Grid, Typography } from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux'

export const SearchPage = (props) => {
    return (
        <Grid container>
            <Grid item>
                <Typography>
                    Hello
                </Typography>
            </Grid>
        </Grid>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage)
