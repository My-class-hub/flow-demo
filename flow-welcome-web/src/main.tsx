import React, {useEffect, useState} from 'react'
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from "react-redux";
// css
import '@/style/global.less';
import '@logicflow/core/dist/style/index.css';
import '@logicflow/extension/lib/style/index.css';
import 'antd/dist/antd.less'

import routes, {open, auth} from "@/config/routes";
//导入全局状态管理容器
import store from "@/store"
import {useAppDispatch, useAppSelector} from "@/hook/store";
import {info} from "@/api/v1/system";
import {updateUserInfo} from "@/store/reducer/user";
import {updateMenu} from "@/store/reducer/menu";

const PERMISSION = ["ordinary", "vip"]


const Index: React.FC = () => {
    const userInfo = useAppSelector((state) => state.userInfo);
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (userInfo.token) {
            (async () => {
                const data = await info()
                dispatch(updateUserInfo({...data}))
                dispatch(updateMenu([
                    {
                        label: "首页",
                        key: "/home"
                    },
                    {
                        label: "管理页",
                        key: "/manage"
                    }
                ]))
            })()
        } else {
            dispatch(updateMenu([
                {
                    label: "首页",
                    key: "/home"
                }
            ]))
        }
    }, [])

    return (
        <>
            {routes(auth)}
        </>
    )
}


ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <Index/>
        </Provider>
    </BrowserRouter>
    , document.getElementById("root"))
