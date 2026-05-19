import React from 'react'
import { assets } from '../assets/assets';
import { useState } from 'react';
import {motion} from "framer-motion"
import Axios from '../utils/Axios';
import SummaryApi from '../common/summaryApi';
import toast from "react-hot-toast"
import { useContext } from 'react';
import AppContext from '../context/AppContext';

const Result = () => {

  const [image, setimage] = useState(assets.sample_img_1)
  const [isImageLoaded, setImageLoaded] = useState(true)
  const [loading, setloading] = useState(false)
  const [prompt,setinput] = useState(" ")
  const {fetchuser} = useContext(AppContext)


    const onSubmitHandler = async(e)=>{
    e.preventDefault()
    try{
      setloading(true);
      const response = await Axios({
        ...SummaryApi.image,
        data:{prompt} 
      })

      console.log(response);
      if(response.data.success){
        setloading(false)
        setimage(response.data.resultImage);
        toast.success(response.data.message)
        await fetchuser();
        setImageLoaded(true);
        setinput("");
      }

      if(response.data.error){
        toast.error(response.data.message)
      }

    }catch(error){
       toast.error(response.data.message)
    }
   


  }


  return (
    <motion.form 
    initial ={{opacity:0.2,y:100}}
    transition={{duration:1}}
    whileInView={{opacity:1,y:0}}
    viewport ={{once:true}}
    onSubmit={onSubmitHandler}   className='flex flex-col min-h-[90vh] justify-center items-center'>
      <div>
        <div className='relative'>
          <img src={image} alt="" className='max-w-sm rounded' />
          <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading? "w-full transition-all duration-[10s]":"w-0" }`} />
        </div>
        <p className={!loading ? "hidden" : ""}>Loading.....</p>
      </div>
      {!isImageLoaded &&
        <div className='flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full'>
          <input onChange={e=>setinput(e.target.value)} value= {prompt} type="text" placeholder='Describe what you want to generate' className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color' />
          <button type="submit" className='bg-zinc-900 px-10 sm:px-16 py-3 rounded-full cursor-pointer'>Generate</button>
        </div>
      }

      {isImageLoaded &&
        <div className='flex gap-2 flex-wrap justify-center text-center text-white text-sm p-0.5 mt-10 rounded-full'>
          <p onClick={() => { setImageLoaded(false) }} className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer'>
            Generate Another
          </p>
          <a href={image} download className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer">Download</a>
        </div>
      }
    </motion.form>

  )
}

export default Result;
