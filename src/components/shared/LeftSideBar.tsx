import { useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useUserContext } from '../context/AuthContext'
import { sidebarLinks } from '@/constants'
import { INavLink } from '@/types'
import { useSignOutAccount } from '@/lib/queries'
import { IoMdLogOut } from 'react-icons/io'
import { Button } from '../ui/button'

const LeftSideBar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user } = useUserContext()

  useEffect(() => {
    if (isSuccess) {
      navigate(0)
    }
  }, [isSuccess])

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link
          to="/"
          className="flex gap-3 items-center"
        >
          <img src="/assets/images/logo.png" alt="logo" width={200} />
        </Link>
        <Link
          to={`/profile/${user.id}`}
          className="flex gap-3"
        >
          <img
            src={user.imageUrl}
            alt="Profile"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-2xl">{user.name}</p>
            <p className="small-regular font-['Courier_Prime']">@{user.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col space-y-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route
            return (
              <li
                key={link.label}
                className={`group leftsidebar-link ${
                  isActive && 'link-active'
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-3"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                  />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
      <Button
        className="shad-button_ghost"
        onClick={() => signOut()}
      >
        <IoMdLogOut className="h-6 w-6" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  )
}

export default LeftSideBar
