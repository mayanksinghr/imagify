import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AppContext from '../context/AppContext'

const featuresData = [
  {
    icon: "🖼️",
    title: "Image Generation",
    description: "Turn any text prompt into stunning AI-generated artwork in seconds.",
    color: "bg-purple-50 border-purple-200",
    iconBg: "bg-purple-100",
    route: "/result",
    tag: "Creative"
  },
  {
    icon: "💬",
    title: "AI Chat",
    description: "Ask anything and get instant intelligent answers from our AI assistant.",
    color: "bg-blue-50 border-blue-200",
    iconBg: "bg-blue-100",
    route: "/chat",
    tag: "Assistant"
  },
  {
    icon: "📄",
    title: "Resume Analyser",
    description: "Upload your resume and get AI-powered feedback to land your dream job.",
    color: "bg-green-50 border-green-200",
    iconBg: "bg-green-100",
    route: "/resume",
    tag: "Career"
  },
  {
    icon: "✍️",
    title: "Blog Generator",
    description: "Generate SEO-friendly blog posts on any topic in just a few clicks.",
    color: "bg-amber-50 border-amber-200",
    iconBg: "bg-amber-100",
    route: "/blog",
    tag: "Content"
  },
]

const Features = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const { setShowLogin } = useContext(AppContext)

  const handleClick = (route) => {
    if (user?._id) {
      navigate(route)
    } else {
      setShowLogin(true)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center my-16 px-6 md:px-20'>
      <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>Everything you need</h1>
      <p className='text-gray-500 mb-10 text-center'>Four powerful AI tools, one platform</p>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-6xl'>
        {featuresData.map((feature, index) => (
          <motion.div
            key={index}
            onClick={() => handleClick(feature.route)}
            className={`relative flex flex-col p-6 rounded-2xl border cursor-pointer ${feature.color} hover:scale-[1.03] transition-all duration-300`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <span className='absolute top-4 right-4 text-xs font-medium px-2 py-0.5 bg-white rounded-full text-gray-500 border'>
              {feature.tag}
            </span>
            <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center text-2xl mb-4`}>
              {feature.icon}
            </div>
            <h2 className='text-lg font-semibold mb-2 text-gray-800'>{feature.title}</h2>
            <p className='text-sm text-gray-500 leading-relaxed'>{feature.description}</p>
            <div className='mt-4 flex items-center gap-1 text-sm font-medium text-gray-700'>
              Try now <span className='text-base'>→</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Features