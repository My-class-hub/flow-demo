import {Navigate, useRoutes} from "react-router-dom";

import {RouteObject} from "react-router/lib/router";
import Layout from "@/layout";
import Home from "@/pages/home";
import Manage from "@/pages/manage";
import Login from "@/pages/login";
import Flow from "@/pages/flow";

const routes = (routes: RouteObject[]) => {
    return useRoutes(routes)
}
export const auth =[
    {
        path: "/",
        element: <Layout/>,
        children: [
            // 重定向
            {
                index: true,
                element: <Navigate to="/home"/>,
            },
            {
                path: "home",
                element: <Home/>
            },
            {
                path: "manage",
                element: <Manage/>
            }
        ]
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/diagraming/:fid",
        element: <Flow/>
    }
]

export const open =[
    {
        path: "/",
        element: <Layout/>,
        children: [
            // 重定向
            {
                index: true,
                element: <Navigate to="/home"/>,
            },
            {
                path: "home",
                element: <Home/>
            },
        ]
    },
    {
        path: "/login",
        element: <Login/>
    }
]
export default routes