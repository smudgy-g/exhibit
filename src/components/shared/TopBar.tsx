import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { IoMdLogOut } from "react-icons/io";
import { useSignOutAccount } from "@/lib/queries"
import { useEffect } from "react"
import { useUserContext } from "../context/AuthContext"

const TopBar = () => {
  const {mutate: signOut, isSuccess} = useSignOutAccount()
  const navigate = useNavigate()
  const {user} = useUserContext()

  useEffect(()=> {
    if (isSuccess) {
      navigate(0)
    }
  }, [isSuccess])

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link
          to="/"
          className="flex gap-3 items-center"
        >
          <h1 className="text-2xl font-bold text-primary-500">SnapBook</h1>
        </Link>

        <div className="flex gap-4">
          <Button variant={'ghost'} className="shad-button_ghost text-primary-500" onClick={() => signOut()}>
            <IoMdLogOut className="h-8 w-8" />
          </Button>
          <Link to={`/profile/${user.id}`} className="flex gap-3">
            <img src={user.imageUrl} alt="Profile" className="h-8 rounded-full"/>
          </Link>
          
        </div>
      </div>
    </section>
  )
}

export default TopBar
