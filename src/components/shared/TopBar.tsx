import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/queries'
import { useEffect } from 'react'
import { useUserContext } from '../context/AuthContext'

const TopBar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const navigate = useNavigate()
  const { user } = useUserContext()

  useEffect(() => {
    if (isSuccess) {
      navigate(0)
    }
  }, [isSuccess])

  return (
    <section className="topbar">
      <div className="flex-between py-3 px-5">
        <Link
          to="/"
          className="flex gap-3 items-center"
        >
          <img
            src="/assets/images/logo.png"
            alt="logo"
            width={170}
          />
        </Link>

        <div className="flex gap-4">
          <Button
            className="shad-button_ghost"
            onClick={() => signOut()}
          >
            <img
              src="/assets/icons/logout.svg"
              alt="logout"
            />
          </Button>
          <Link
            to={`/profile/${user.id}`}
            className="flex gap-3"
          >
            <img
              src={user.imageUrl}
              alt="Profile"
              className="h-9"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default TopBar
