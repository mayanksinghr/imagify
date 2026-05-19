import React from "react"
import { assets } from "../assets/assets"

const Description =()=>{
    return(
        <div className="flex flex-col items-center justify-center my-24 p-6 md:px-28">
           <h1 className="text-3xl sm:text-4xl font-semibold mb-2">Create AI Image</h1>
           <p className="text-gray-500 mb-8 ">Turn your imagination into visuals</p>
           <div className="flex flex-col gap-5 md:gap-14 lg:flex-row items-center">
            <img src={assets.sample_img_1} alt="" className="w-80 xl:w-96 rounded-lg"/>
            <div>
              <h2 className="text-3xl font-medium max-w-lg mb-4">Introducing the AI-Powered Text to image Generator</h2>
              <p className="text-gray-600 mb-4">AI text-to-image technology is transforming creativity by enabling machines to generate images directly from written descriptions. Using advanced deep learning models such as diffusion networks and generative adversarial networks (GANs), these systems understand natural language prompts and convert them into realistic or artistic visuals.</p>
              <p className="text-gray-600 mb-4">
                AI text-to-image generation is a cutting-edge technology that turns written prompts into detailed visuals. By combining natural language processing with computer vision, models like Stable Diffusion and DALL·E can understand human descriptions and create lifelike or imaginative images. This capability empowers artists, marketers, and educators to bring ideas to life instantly without advanced design tools. 
              </p>
            </div>
           </div>
        </div>
    )
}

export default Description