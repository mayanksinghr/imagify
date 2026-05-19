import axios from "axios";
import pkg from "form-data";
import userModel from "../models/user.model.js";


export const generateImage = async (req, res) => {
  const FormData = pkg;
  try {
    const userId = req.userId; // assuming you set this from auth middleware
    const { prompt } = req.body;
     console.log("PROMY",prompt)
    if (!prompt) {
      return res.json({ success: false, error:true, message: "Prompt is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, error:true, message: "Please login" });
    }
    if (user.creditBalance <= 0) {
      return res.json({ success: false, error:true, message: "No credits left please buy credit" });
    }

    //prepare form-data
    const formData = new FormData();
    formData.append("prompt", prompt);

    //call ClipDrop API
    const { data, headers } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY, // <-- set in your .env
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer", // because response can be image/png
        validateStatus: null, // allow handling of 400/500 manually
      }
    );

    const contentType = headers["content-type"];

    // if ClipDrop returned JSON → it's an error
    if (contentType.includes("application/json")) {
      const errorData = JSON.parse(Buffer.from(data).toString("utf-8"));
      return res.json({
        success: false,
        message: errorData.error || "ClipDrop API error",
      });
    }

    // success: we got an image
    const base64Image = Buffer.from(data).toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    // update credits based on ClipDrop headers
    const creditsConsumed = parseInt(headers["x-credits-consumed"] || "1", 10);
    const newBalance = Math.max(user.creditBalance - creditsConsumed, 0);
    await userModel.findByIdAndUpdate(user._id, { creditBalance: newBalance });

    return res.json({
      success: true,
      message: "Image generated",
      creditBalance: newBalance,
      resultImage,
    });
  } catch (err) {
    return res.json({
      success: false,
      message: err.message,
    });
  }
};




