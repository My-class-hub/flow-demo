// 定义一个声明接口
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "@/store";
import {createStorage} from "@/hook/local";

interface UserInfoState {
    _id?: string
    username?: string,
    roles: string[],
    token: string,
    auth?: boolean
}

interface UserInfoInterface {
    _id?: string
    username?: string,
    permission: string[],
    access_token: string,
}

const storage = createStorage({prefixKey: "ACCESS_", storage: localStorage});
// 初始化一个参数
const initialState: UserInfoState = {
    roles: [],
    token: storage.get("TOKEN")
}
// 创建切片
export const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState,
    reducers: {
        updateUserInfo: (state, action: PayloadAction<UserInfoInterface>) => {
            const userInfoState = action.payload;
            state._id = userInfoState._id;
            state.username = userInfoState.username;
            state.roles = userInfoState.permission;
            if (userInfoState.access_token) {
                state.token = userInfoState.access_token;
                storage.set("TOKEN", userInfoState.access_token)
            }
        },
        updateToken: (state, action: PayloadAction<string>) => {
            const token = action.payload;
            storage.set("TOKEN", token)
            state.token = token;
        },
        updateAuth: (state, action: PayloadAction<boolean>) => {
            state.auth = action.payload
        }
    },
})

// 析构actions
export const {updateUserInfo,updateToken,updateAuth} = userInfoSlice.actions
// 到处reducer
export default userInfoSlice.reducer
// 获取请求参数
export const selectUserInfo = (state: RootState) => state.userInfo