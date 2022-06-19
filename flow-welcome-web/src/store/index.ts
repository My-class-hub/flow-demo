// 配置store
import {configureStore} from "@reduxjs/toolkit";
import {menuReducer, userReducer} from "./reducer"

// 注册用户
const store = configureStore({
    reducer: {
        userInfo: userReducer,
        menu: menuReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store