import express from "express"
import { generateImage } from "../conntroller/imageController.js"
import {chatWithAI}  from "../conntroller/chatController.js";
import { Router } from "express"
import auth from "../middleware/auth.js";
import { generateBlog } from "../conntroller/BlogController.js";
import { analyseResume,upload } from "../conntroller/resumeController.js";

const router = Router()

router.post('/image/generate-image',auth,generateImage);
router.post("/chat/message", chatWithAI);
router.post("/generate",generateImage)
router.post("/blog/generate",generateBlog)
router.post("/resume/analyse", upload.single("resume"), analyseResume)

export default router;


