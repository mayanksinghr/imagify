import React from "react"
import { assets } from "../assets/assets"

const Description = () => {
  return (
    <div className="flex flex-col items-center justify-center my-24 p-6 md:px-28">
      <h1 className="text-3xl sm:text-4xl font-semibold mb-2">Powered by AI</h1>
      <p className="text-gray-500 mb-8">One platform, four superpowers</p>
      <div className="flex flex-col gap-5 md:gap-14 lg:flex-row items-center">
        <img src={assets.sample_img_1} alt="" className="w-80 xl:w-96 rounded-lg" />
        <div>
          <h2 className="text-3xl font-medium max-w-lg mb-4">
            Your complete AI-powered creative suite
          </h2>
          <p className="text-gray-600 mb-4">
            Imagify combines four cutting-edge AI tools in one seamless platform. Generate
            breathtaking images from text, have natural conversations with our AI assistant,
            get professional resume feedback, and produce ready-to-publish blog content — all
            without switching between apps.
          </p>
          <p className="text-gray-600 mb-4">
            Whether you're a designer, job seeker, content creator, or just someone who
            wants AI on their side — Imagify has a tool built for you. Powered by the latest
            large language models and image generation technology, every output is fast,
            high-quality, and tailored to your needs.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              { label: "Image Generation", color: "bg-purple-100 text-purple-700" },
              { label: "AI Chat", color: "bg-blue-100 text-blue-700" },
              { label: "Resume Analyser", color: "bg-green-100 text-green-700" },
              { label: "Blog Generator", color: "bg-amber-100 text-amber-700" },
            ].map((item, i) => (
              <div key={i} className={`px-4 py-2 rounded-full text-sm font-medium text-center ${item.color}`}>
                ✓ {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Description
