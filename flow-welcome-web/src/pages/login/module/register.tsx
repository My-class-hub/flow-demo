import React from "react";
import {Button, Form, Input, message, Space} from "antd";
import {register, RegisterForm} from "@/api/v1/system";


const Index: React.FC = () => {
    const [form] = Form.useForm();
    const onFinish = async (values: RegisterForm) => {
        const data = await register(values)
        if (data.err_code === 0) {
            message.success(data.err_msg)
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
                            注册
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