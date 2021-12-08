import AccountCircle from "@material-ui/icons/AccountCircle"
import Avatar from "@material-ui/core/Avatar"
import Grid from "@material-ui/core/Grid"
import Container from "@material-ui/core/Container"
import FavoriteCardSkeleton from "./FavoriteCardSkeleton"
import SmallPostSkeleton from "./SmallPostSkeleton"
import Typography from "@material-ui/core/Typography"

function ProfileSkeleton() {
  return (
    <Grid container spacing={3} align="center" style={{marginTop: 15}}>
      <Grid container direction="row" alignItems="center" justify="center" spacing={3}>
        <Grid item>
          <Avatar style={{width: 100, height: 100}}>
            <AccountCircle style={{width: 100, height: 100}} />
          </Avatar>
        </Grid>
        <div style={{backgroundColor: "gray", height: 40, width: 200}} />
      </Grid>
      <Grid container alignItems="center" justify="center">
        <Grid item>
          <div style={{backgroundColor: "gray", width: 400, height: 20, margin: 10}} />
          <div style={{backgroundColor: "gray", width: 200, height: 20, margin: 10}} />
        </Grid>
      </Grid>
      <Container>
        <Grid container direction="row" alignItems="center" spacing={3} xs={8} sm={12}>
          <Grid item>
            <Typography variant="h4">Favourite Artists:</Typography>
          </Grid>
          <Grid item>
            {Array.from({length: 3}).map((e, idx) => {
              return <FavoriteCardSkeleton key={idx} />
            })}
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center" spacing={3} xs={8} sm={12}>
          <Grid item>
            <Typography variant="h4">Favourite Albums:</Typography>
          </Grid>
          <Grid item>
            {Array.from({length: 3}).map((e, idx) => {
              return <FavoriteCardSkeleton key={idx} />
            })}
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center" spacing={3} xs={8} sm={12}>
          <Grid item>
            <Typography variant="h4">Favourite Songs:</Typography>
          </Grid>
          <Grid item>
            {Array.from({length: 3}).map((e, idx) => {
              return <FavoriteCardSkeleton key={idx} />
            })}
          </Grid>
        </Grid>
      </Container>
      {/*User's Posts container*/}
      <Grid container spacing={3} align="center">
        <Grid item xs={12}>
          <Grid item xs={6}>
            {Array.from({length: 5}).map((e, idx) => {
              return <SmallPostSkeleton key={idx} />
            })}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProfileSkeleton
