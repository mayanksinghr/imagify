export const baseURL = "http://localhost:4000";


const SummaryApi = {
register:{
        url:"/api/user/register",
        method:"post"
},
  login:{
    url:"api/user/login",
    method:"post"
},
userDetails:{
    url:"api/user/userDetail",
    method:"get"
},
logout:{
    url:"api/user/logout",
    method:"get"
},
image:{
    url:"api/image/generate-image",
    method:"post"
},
chat: {
  url: "api/chat/message",
  method: "post"
},
resumeAnalyse: {
  url: "api/resume/analyse",
  method: "post"
},
blogGenerate: {
  url: "api/blog/generate",
  method: "post"
}
}

export default SummaryApi;
