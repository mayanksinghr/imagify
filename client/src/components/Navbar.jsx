import React, { useContext } from 'react'
import { assets } from "../assets/assets"
import { Link, useNavigate } from 'react-router-dom'
import AppContext from '../context/AppContext'
import { useSelector, useDispatch } from 'react-redux'
import Axios from '../utils/Axios'
import SummaryApi from '../common/summaryApi'
import { logout } from '../store/UserSlice'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { setShowLogin } = useContext(AppContext)
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handlelogout = async () => {
    try {
      const response = await Axios({ ...SummaryApi.logout })
      if (response.data.success) {
        toast.success(response.data.message)
        localStorage.clear()
        dispatch(logout())
      }
      if (response.data.error) {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <div className='flex items-center justify-between py-4'>
      <Link to='/'>
        <img src={assets.logo} alt="" className='w-28 sm:w-32 lg:w-40' />
      </Link>

      {/* Nav Links */}
      {user._id && (
        <div className='hidden md:flex items-center gap-6 text-sm text-gray-600'>
          <Link to="/result" className='hover:text-black transition-colors'>🖼️ Images</Link>
          <Link to="/chat" className='hover:text-black transition-colors'>💬 Chat</Link>
          <Link to="/resume" className='hover:text-black transition-colors'>📄 Resume</Link>
          <Link to="/blog" className='hover:text-black transition-colors'>✍️ Blog</Link>
        </div>
      )}

      <div>
        {user._id ? (
          <div className='flex items-center gap-2 sm:gap-3'>
            <button
              onClick={() => navigate("/buy")}
              className='flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700 cursor-pointer'
            >
              <img className="w-5" src={assets.credit_star} alt="" />
              <p className='text-xs sm:text-sm font-medium text-gray-600'>Credits: {user.creditBalance}</p>
            </button>
            <p className='text-gray-600 max-sm:hidden pl-4'>Hi, {user.name || "User"}</p>
            <div className='relative group cursor-pointer'>
              <img src={assets.profile_icon} alt="" className='w-8 drop-shadow' />
              <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
                <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm shadow-md min-w-[140px]'>
                  <li className='py-1 px-2 cursor-pointer hover:bg-gray-50 rounded' onClick={() => navigate('/chat')}>💬 Chat</li>
                  <li className='py-1 px-2 cursor-pointer hover:bg-gray-50 rounded' onClick={() => navigate('/resume')}>📄 Resume</li>
                  <li className='py-1 px-2 cursor-pointer hover:bg-gray-50 rounded' onClick={() => navigate('/blog')}>✍️ Blog</li>
                  <li className='py-1 px-2 cursor-pointer hover:bg-gray-50 rounded border-t mt-1 text-red-500' onClick={handlelogout}>Logout</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex items-center gap-2 sm:gap-5'>
            <p onClick={() => navigate('/buy')} className='cursor-pointer'>Pricing</p>
            <button
              onClick={() => setShowLogin(true)}
              className='bg-zinc-800 text-white px-7 py-2 cursor-pointer sm:px-10 text-sm rounded-full'
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar

