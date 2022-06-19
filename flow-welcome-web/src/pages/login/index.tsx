import React from "react";
import "./index.less"
import {Card, Tabs} from "antd";
import Login from "@/pages/login/module/login";
import Register from "@/pages/login/module/register";

const Index: React.FC = () => {

    const {TabPane} = Tabs

    return (
        <div className="login-bg">
            <Card className="login-card">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="登入" key="1">
                        <Login/>
                    </TabPane>
                    <TabPane tab="注册" key="2">
                        <Register/>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    )
}

export default Index