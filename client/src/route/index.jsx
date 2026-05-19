import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import BuyCredit from "../pages/BuyCredit";
import Result from "../pages/Result";
import ChatPage from "../pages/chatpage";
import ResumeAnalyser from "../pages/ResumePage";
import BlogGenerator from "../pages/BlogPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path:"/buy",
                element:<BuyCredit/>
            },
            {
                path:"/result",
                element:<Result/>
            },
            {
            path:"/chat",
            element:<ChatPage/>
            },
            {
              path:"/resume",
              element:< ResumeAnalyser/> 
            },
            {
                path:"/blog",
                element:<BlogGenerator/>
            }
        ]

    }
])


export default router;

