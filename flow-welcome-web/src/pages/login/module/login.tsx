import React from "react";
import {Button, Form, Input, message, Space} from "antd";

import "./login.less"
import {login, LoginForm} from "@/api/v1/system";
import {useAppDispatch} from "@/hook/store";
import {updateUserInfo} from "@/store/reducer/user";
import {useNavigate} from "react-router-dom";
import {updateMenu} from "@/store/reducer/menu";



const Index: React.FC = () => {
    const [form] = Form.useForm();

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const onFinish = async (values: LoginForm) => {
        const data = await login(values)
        if (data.err_code === 0) {
            dispatch(updateUserInfo({...data}))
            // 登入完成页面跳转
            message.success("正在登入中......",)
            dispatch(updateMenu([
                {
                    label: "首页",
                    key: "/home",
                },
                {
                    label: "管理页",
                    key: "/manage",
                }
            ]))
            // 跳转
            navigate("/manage")
        }else {
            message.error(data.err_msg)
        }
    };
    const onReset = () => {
      form.resetFields()
    }
    return (
        <>
            <Form id="login-form" form={form} name="control-login" onFinish={onFinish}>
                <Form.Item name="username" label="账号" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="密码" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item wrapperCol={{offset: 6, span: 16}}>
                    <Space size={50}>
                        <Button type="primary" htmlType="submit">
                            确定
                        </Button>
                        <Button htmlType="button" onClick={onReset}>
                            重置
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </>
    )
}

export default Index