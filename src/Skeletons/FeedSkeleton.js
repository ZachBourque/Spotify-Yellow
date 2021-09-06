import Typography from "@material-ui/core/Typography"

function FeedSkeleton(props) {
  return (
    <Typography variant="h2" className={props.class}>
      Loading...
    </Typography>
  )
}

export default FeedSkeleton
