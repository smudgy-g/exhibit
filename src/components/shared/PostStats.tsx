import { Models } from 'appwrite'
import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikedPost,
  useSavePost,
} from '@/lib/queries'
import { useEffect, useState } from 'react'
import Loader from './Loader'

type PostStatsProps = {
  userId: string
  post: Models.Document
}

const PostStats = ({ post, userId }: PostStatsProps) => {
  const { data: currentUser } = useGetCurrentUser()
  const { mutate: likePost } = useLikedPost()
  const { mutate: savePost, isPending: isSavingPost } = useSavePost()
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } =
    useDeleteSavedPost()

  const likesList = post.likes.map((user: Models.Document) => user.$id)
  const [likes, setLikes] = useState(likesList)
  const [isSaved, setIsSaved] = useState(false)

  const checkIsLiked = (likeList: string[], userId: string) => {
    return likeList.includes(userId)
  }

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  )

  useEffect(() => {
    setIsSaved(!!savedPostRecord)
  }, [currentUser])

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation()

    let newLikes = [...likes]
    const hasLiked = newLikes.includes(userId)

    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId)
    } else {
      newLikes.push(userId)
    }

    likePost({ postId: post.$id, likesArray: newLikes })
    setLikes(newLikes)
  }

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (savedPostRecord) {
      setIsSaved(false)
      deleteSavedPost(savedPostRecord.$id)
    } else {
      savePost({ postId: post.$id, userId })
      setIsSaved(true)
    }
  }

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          height={20}
          width={20}
          className="cursor-pointer"
          alt="like"
          src={
            checkIsLiked(likes, userId)
              ? '/assets/icons/liked.svg'
              : '/assets/icons/like.svg'
          }
          onClick={handleLikePost}
        />

        <p className="small-medium lg:base-medium">{likes.length > 0 && likes.length}</p>
      </div>
      <div className="flex gap-2">
        {isSavingPost || isDeletingSaved ? (
          <Loader />
        ) : (
          <img
            height={20}
            width={20}
            className="cursor-pointer"
            alt="save"
            src={isSaved ? '/assets/icons/saved.svg' : '/assets/icons/save.svg'}
            onClick={handleSavePost}
          />
        )}
      </div>
    </div>
  )
}

export default PostStats
