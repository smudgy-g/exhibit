import { useUserContext } from '@/components/context/AuthContext'
import GridPostList from '@/components/shared/GridPostList'
// import GridPostList from '@/components/shared/GridPostList'
import Loader from '@/components/shared/Loader'
import { Button } from '@/components/ui/button'
import { useGetUserById } from '@/lib/queries'
import {
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom'

const UserStat = ({ value, label }: { value: number; label: string }) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="small-semibold lg:body-bold font-['Courier_Prime'] text-pink">
        {value}
      </p>
      <p className="small-semibold lg:body-bold">{label}</p>
    </div>
  )
}
const Profile = () => {
  const { pathname } = useLocation()
  const { id } = useParams()
  const { user: currentUser } = useUserContext()
  const { data: userData, isError } = useGetUserById(id as string)

  if (!userData) return <Loader />
  return (
    <div className="profile-container">
      {isError && <p className="font-['Courier_Prime']">No user found.</p>}
      <div className="profile-inner_container">
        <div className="flex flex-col lg:flex-row flex-1 gap-7">
          <img
            src={userData.imageUrl || '/assets/icons/profile-placeholder.svg'}
            alt="profile"
            className="rounded-full w-28 h-28 lg:w-36 lg:h-36"
          />

          <div className="flex flex-col flex-1 justify between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {userData.name}
              </h1>
              <p className="small-regular md:body-medium text-pink text-center xl:text-left">
                @{userData.username}
              </p>
            </div>
            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <UserStat
                value={userData.posts.length}
                label="Posts"
              />
              <UserStat
                value={171}
                label="Followers"
              />
              <UserStat
                value={127}
                label="Following"
              />
            </div>
            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {userData.bio}
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <div className={`${currentUser.id !== userData.$id && 'hidden'}`}>
              <Link
                to={`/update-profile/${userData.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  currentUser.id !== userData.$id && 'hidden'
                }`}
              >
                <img
                  src={'/assets/icons/edit.svg'}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium font-['Courier_Prime']">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${currentUser.id === id && 'hidden'}`}>
              <Button
                type="button"
                className="shad-button_primary px-8"
              >
                Follow
              </Button>
            </div>
          </div>
        </div>
      </div>
      {userData.$id === currentUser.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab ${
              pathname === `/profile/${id}` && '!link-active'
            }`}
          >
            <img
              src={'/assets/icons/posts.svg'}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab ${
              pathname === `/profile/${id}/liked-posts` && '!link-active'
            }`}
          >
            <img
              src={'/assets/icons/like.svg'}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}
      <Routes>
        <Route
          index
          element={
            <GridPostList
              posts={userData.posts}
              showUser={false}
            />
          }
        />
        {userData.$id === currentUser.id && (
          <Route
            path="/liked-posts"
            element={
              <GridPostList
                posts={userData.liked}
                showStats={false}
              />
            }
          />
        )}
      </Routes>
      <Outlet />
    </div>
  )
}

export default Profile
