import {http, upload} from "@/api/http";

export interface LoginForm {
    username: string,
    password: string,
}

export interface RegisterForm {
    username: string,
    password: string,
}

export interface CreateFlow {
    filename: string
}

export interface SaveFlow {
    _id: string,
    nodes: any,
    edges: any
}

export const login = async (loginForm: LoginForm) => {
    return (await http("/api/v1/user/login", "POST", loginForm)).json()
}

export const register = async (registerForm: RegisterForm) => {
    return (await http("/api/v1/user/register", "POST", registerForm)).json()
}

export const info = async () => {
    return (await http("/api/v1/user/info")).json()
}

export const createFlow = async (flowInfo: CreateFlow) => {
    return (await http("/api/v1/flow/create", "POST", flowInfo)).json()
}

export const flowList = async () => {
    return (await http("/api/v1/flow/list")).json()
}

export const saveFlow = async (dto: SaveFlow) => {
    return (await http("/api/v1/flow/save", "PUT", dto)).json()
}

export const selectFlow = async (fid: string) => {
    return (await http(`/api/v1/flow/chart/${fid}`, "GET")).json()
}

export const fileUpload = async (dto: Record<string, any>) => {
    return (await upload(`/api/v1/flow/upload`, "POST", dto)).json()
}