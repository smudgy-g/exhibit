import { useUserContext } from '@/components/context/AuthContext'
import Loader from '@/components/shared/Loader'
import PostStats from '@/components/shared/PostStats'
import { Button } from '@/components/ui/button'
import { useGetPostById } from '@/lib/queries'
import { multiFormatDateString } from '@/lib/utils'
import { Link, useParams } from 'react-router-dom'

const PostDetails = () => {
  const { id } = useParams()
  const { data: post, isPending } = useGetPostById(id as string)
  const { user } = useUserContext()

  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img
            src={post?.imageUrl}
            alt="creator"
            className="post_details-img"
          />
          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profil/${post?.creator.$id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    post?.creator?.imageUrl ||
                    '/assets/icons/profile-placeholder.svg'
                  }
                  alt="creator"
                  className="rounded-full w-8 h-8 md:h-12 md:w-12"
                />
                <div className="flex flex-col gap-1">
                  <p className="base-medium lg:body-bold">
                    {post?.creator.name}
                  </p>
                  <div className="flex flex-col gap-1">
                    <p className="subtle-semibold lg:small-regular">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && 'hidden'}`}
                >
                  <img
                    src="/assets/icons/edit.svg"
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>
                <Button
                  type="button"
                  variant={'ghost'}
                  className={`post_details-delete_btn ${
                    user.id !== post?.creator.$id && 'hidden'
                  }`}
                  // onClick={handleDeletePost}
                >
                  <img
                    src="/assets/icons/delete.svg"
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>
            <hr className="border w-full border-black" />
            <div className="flex flex-col flex-1 w-full small-medium lg:base-medium py-5">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2 font-['Courier_Prime']">
                {post?.tags.map((tag: string) => (
                  <li key={tag}>#{tag}</li>
                ))}
              </ul>
            </div>

            <div className="w-full">{post && <PostStats post={post} userId={user.id} />}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetails
