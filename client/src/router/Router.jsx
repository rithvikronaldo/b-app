import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../home/Home";
import Shop from "../shop/Shop";
import About from "../components/About";
import Blog from "../components/Blog";

const Router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home/>
            },
            {
                path:'/shop',
                element: <Shop/>
            },
            {
                path:'/about',
                element: <About/>
            },
            {
                path: '/blog',
                element: <Blog/>
            },
        ]
    },
]);

export default Router;
