import React from "react";
import {Button, Card, Col, Row, Space, Typography} from "antd";

import "./index.less"
import {useNavigate} from "react-router-dom";
import {useAppSelector} from "@/hook/store";

const Index: React.FC = () => {
    // 跳转到登入页面
    const navigate = useNavigate();
    // 获取用户信息
    const userInfo = useAppSelector((state) => state.userInfo);

    const LoginOrUse = () => {
        userInfo.token ? navigate("/manage") : navigate("/login");
    }

    return (
        <>
            <div className="home-bg">
                <div className="center-bg">
                    <h1>FLOW-WELCOME</h1>
                    <Button size={'large'} onClick={LoginOrUse}>立即使用 →</Button>
                </div>
            </div>
            {/*设置卡片显示信息*/}
            <div style={{padding: '0 24px 24px 24px'}}>
                <Row gutter={16} style={{marginTop: 24}}>
                    <Col className="gutter-row" span={8}>
                        <Card
                            hoverable
                        >
                            <Card.Meta title="简单易懂🚀" description="基于LogicFlow实现流程步骤，可自定义实现各种节点并通过插拔的方式注册使用。"/>
                        </Card>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Card
                            hoverable

                        >
                            <Card.Meta title="简单编排🥰" description="通过前端可视化编排流程图，能完备的表达业务逻辑，不受流程引擎限制。"/>
                        </Card>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Card
                            hoverable

                        >
                            <Card.Meta title="高效响应🚁" description="服务端采用golang开发结合iris框架实现高速的HTTP响应速度，速度巨快，服务稳定。"/>
                        </Card>
                    </Col>
                </Row>
            </div>
            <div style={{padding: '0 24px 24px 24px'}}>
                <Typography.Title level={3}>技术栈</Typography.Title>
                <div style={{textAlign: 'center'}}>
                    <Space>
                        <div>
                            <img src={new URL("../../assets/img/go.svg", import.meta.url).href}
                                 style={{height: 42, width: 42}} alt=""/>
                            <div>golang</div>
                        </div>
                        <span>➕</span>
                        <div>
                            <img src={new URL("../../assets/img/iris.png", import.meta.url).href}
                                 style={{height: 42, width: 42}} alt=""/>
                            <div>iris</div>
                        </div>
                        <span>➕</span>
                        <div>
                            <img src={new URL("../../assets/img/logo.svg", import.meta.url).href}
                                 style={{height: 48, width: 48}} alt=""/>
                            <div>react</div>
                        </div>
                        <span>➕</span>
                        <div>
                            <img src={new URL("../../assets/img/logic.png", import.meta.url).href}
                                 style={{height: 42}} alt=""/>
                            <div>logic-flow</div>
                        </div>
                        <span>➕</span>
                        <div>
                            <img src={new URL("../../assets/img/mongo.webp", import.meta.url).href}
                                 style={{height: 42}} alt=""/>
                            <div>mongodb</div>
                        </div>
                    </Space>
                </div>
            </div>
        </>
    )
}

export default Index