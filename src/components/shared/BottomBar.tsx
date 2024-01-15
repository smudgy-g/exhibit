import { bottombarLinks } from '@/constants'
import { INavLink } from '@/types'
import { Link, useLocation } from 'react-router-dom'

const BottomBar = () => {
  const { pathname } = useLocation()
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link: INavLink) => {
        const isActive = pathname === link.route
        return (
          <Link
            to={link.route}
            key={link.label}
            className={`${
              isActive && 'link-active'
            } flex-center flex-col gap-1 p-2 transition`}
          >
            <img
              src={link.imgURL}
              alt={link.label}
              width={16}
              height={16}
            />
            <p className="tiny-medium">{link.label}</p>
          </Link>
        )
      })}
    </section>
  )
}

export default BottomBar
