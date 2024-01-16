import GridPostList from "@/components/shared/GridPostList"
import Loader from "@/components/shared/Loader"
import { useGetCurrentUser } from "@/lib/queries"
import { Models } from "appwrite"

const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser()
  const likedPosts = currentUser?.liked as Models.Document[]

  if (!currentUser) return <Loader />

  return (
    <div className="saved-container">
      <div className="max-w-5xl flex-start gap-3 justify-start w-full">
        <img
          src="/assets/icons/like.svg"
          alt="saved"
          width={36}
          height={36}
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Liked Posts</h2>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {likedPosts &&
          (likedPosts.length > 0 ? (
            <GridPostList
              posts={likedPosts}
              showStats={false}
            />
          ) : (
            <p className="mt-10 text-center w-full font-['Courier_Prime']">You don't have any any saved posts yet.</p>
          ))}
      </div>
    </div>
  )
}

export default LikedPosts