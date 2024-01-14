import { FaSpinner } from 'react-icons/fa'

const Loader = () => {
  return (
    <div className="flex-center w-full">
      <FaSpinner className="animate-spin" />
    </div>
  )
}

export default Loader
