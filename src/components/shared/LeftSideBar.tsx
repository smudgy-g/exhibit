import React, { useEffect } from 'react'
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
          <h1 className="text-4xl font-bold text-primary-500">SnapBook</h1>
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
            <p className="">{user.name}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route
            return (
              <li
                key={link.label}
                className={`group leftsidebar-link ${
                  isActive && 'bg-primary-500'
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && 'invert-white'
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
      <Button
        variant={'ghost'}
        className="shad-button_ghost text-primary-500"
        onClick={() => signOut()}
      >
        <IoMdLogOut className="h-8 w-8" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  )
}

export default LeftSideBar
