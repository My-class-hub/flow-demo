import {Layout, Menu} from 'antd';
import React, {useEffect, useState} from 'react';
import "./index.less"
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useAppSelector} from "@/hook/store";

const {Header, Content, Footer} = Layout;


const Index: React.FC = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const menu = useAppSelector(state => state.menu)
    const [keyState, setKeyState] = useState<string[]>();

    // 菜单跳转
    useEffect(() => {
        // 动态显示页面内容
        setKeyState([location.pathname])
    }, [location])

    const gotoByKey = ({key}: any) => {
        navigate(key)
    }

    return (
        // 动态路由
        <Layout>
            <Header style={{position: 'fixed', zIndex: 1, width: '100%'}}>
                <div className="logo"/>
                <Menu items={menu.menuItem} mode="horizontal" selectedKeys={keyState} onClick={gotoByKey}/>
            </Header>
            <Content className="site-layout" style={{padding: '0 50px', marginTop: 64}}>
                <div className="site-layout-background" style={{minHeight: 380, marginTop: 24}}>
                    <Outlet/>
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>一个简单的FLOW项目</Footer>
        </Layout>
    )
};

export default Index;