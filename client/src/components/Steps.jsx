import React from 'react'
import { stepsData } from '../assets/assets'

const allSteps = [
  {
    title: "Choose your tool",
    description: "Pick from Image Generation, AI Chat, Resume Analyser, or Blog Generator.",
    icon: stepsData[0]?.icon,
  },
  {
    title: "Enter your prompt or file",
    description: "Type your prompt, upload your resume, or describe the blog topic you want.",
    icon: stepsData[1]?.icon,
  },
  {
    title: "AI does the work",
    description: "Our AI processes your input and generates high-quality output instantly.",
    icon: stepsData[2]?.icon,
  },
]

const Steps = () => {
  return (
    <div className='flex flex-col items-center justify-center my-32'>
      <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>How it works</h1>
      <p className='text-lg text-gray-600 mb-8'>Three simple steps to get started</p>
      <div className='space-y-4 w-full max-w-3xl text-sm'>
        {allSteps.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-5 px-8 bg-white/20 shadow-md border border-amber-50 cursor-pointer hover:scale-[1.02] transition-all duration-300 rounded-lg"
          >
            {item.icon && <img width={40} src={item.icon} alt="" />}
            {!item.icon && (
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                {index + 1}
              </div>
            )}
            <div>
              <h2 className='text-xl font-medium'>{item.title}</h2>
              <p className='text-gray-500'>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Steps