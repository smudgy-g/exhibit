import { ID, Permission, Query, Role } from 'appwrite'
import { INewPost, INewUser, IUpdatePost } from '@/types'
import { account, appwriteConfig, avatars, databases, storage } from './config'
import { UploadIcon } from '@radix-ui/react-icons'

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    )

    if (!newAccount) throw Error('Failed to create new user account.')

    const avatarUrl = avatars.getInitials(user.name)

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    })

    return newUser
  } catch (error) {
    console.log(error)
    return error
  }
}

export async function saveUserToDB(user: {
  accountId: string
  email: string
  name: string
  imageUrl: URL
  username?: string
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user,
      [Permission.read(Role.any())]
    )

    return newUser
  } catch (error) {
    console.log(error)
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password)
    return [session, null]
  } catch (error) {
    console.log(error)
    return [null, error]
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession('current')
    return session
  } catch (error) {
    console.log(error)
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get()

    return currentAccount
  } catch (error) {
    console.log(error)
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount()

    if (!currentAccount) throw Error('Current account does not exist.')

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if (!currentUser) throw Error('Current user does not exist.')

    return currentUser.documents[0]
  } catch (error) {
    console.log(error)
  }
}

export async function createPost(post: INewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0])
    if (!uploadedFile) throw Error

    const fileUrl = getFilePreview(uploadedFile.$id)
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }

    const tagsArray = post.tags?.replace(/ /g, '').split(',') || []

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tagsArray,
      }
    )

    if (!newPost) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }

    return newPost
  } catch (error) {
    console.log(error)
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    }

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0])
      if (!uploadedFile) throw Error

      const fileUrl = getFilePreview(uploadedFile.$id)
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id)
        throw Error
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
    }

    const tagsArray = post.tags?.replace(/ /g, '').split(',') || []

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tagsArray,
      }
    )

    if (!updatedPost) {
      await deleteFile(post.imageId)
      throw Error
    }

    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId)

    return { status: 'ok' }
  } catch (error) {
    console.log(error)
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      'top',
      100
    )

    if (!fileUrl) throw Error

    return fileUrl
  } catch (error) {
    console.log(error)
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
      // [Permission.write(Role.any())]
    )

    return uploadedFile
  } catch (error) {
    console.log(error)
  }
}

export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(20)]
  )
  if (!posts) throw Error

  return posts
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    )

    if (!updatedPost) throw Error('Unable to update post.')
    return updatedPost
  } catch (error) {
    console.log(error)
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const savedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    )

    if (!savedPost) throw Error('Unable to save post.')
    return savedPost
  } catch (error) {
    console.log(error)
  }
}

export async function deleteSavedPost(savedPostId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedPostId
    )

    if (!statusCode) throw Error('Unable to delete saved post.')
    return { status: 'ok' }
  } catch (error) {
    console.log(error)
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )
    return post
  } catch (error) {
    console.log(error)
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error('Missing postId or imageId.')
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    return { status: 'ok' }
  } catch (error) {
    console.log(error)
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)]

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()))
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    )
    if (!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search('caption', searchTerm)]
    )
    if (!posts) throw Error

    return posts
  } catch (error) {
    console.log(error)
  }
}
