import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import AppContext from '../context/AppContext'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const GenerateBtn = () => {
  const { setShowLogin } = useContext(AppContext)
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()

  const onClickHandler = () => {
    if (user?._id) {
      navigate("/result")
    } else {
      setShowLogin(true)
    }
  }

  return (
    <div className='pb-16 text-center'>
      <h1 className="text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-6 md:py-16">
        Ready to experience AI? Start for free.
      </h1>
      <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
        <button
          onClick={onClickHandler}
          className='inline-flex items-center gap-2 px-12 py-3 rounded-full bg-black text-white cursor-pointer hover:scale-105 transition-all duration-500'
        >
          Generate Images
          <img src={assets.star_group} alt="" className='h-6' />
        </button>
        <button
          onClick={() => user?._id ? navigate("/chat") : setShowLogin(true)}
          className='inline-flex items-center gap-2 px-12 py-3 rounded-full border border-black text-black cursor-pointer hover:scale-105 transition-all duration-500'
        >
          Try AI Chat →
        </button>
      </div>
    </div>
  )
}

export default GenerateBtn

