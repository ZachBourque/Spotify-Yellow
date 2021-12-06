import CommentSkeleton from "./CommentSkeleton"

const BigPostSkeleton = () => {
  return (
    <div>
      <div>{/*Big post skeleton*/}</div>
      <div>
        {/*comment skeletons*/}
        {Array.from({length: 5}).map((e, i) => {
          return <CommentSkeleton key={i} />
        })}
      </div>
    </div>
  )
}

export default BigPostSkeleton
