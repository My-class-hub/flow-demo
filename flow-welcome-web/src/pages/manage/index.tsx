import React, {useEffect, useState} from "react";
import {Button, Card, Col, Form, Input, Layout, Menu, Modal, Row, Space} from "antd";
import {HomeFilled} from '@ant-design/icons';
import "./index.less"
import {createFlow, flowList} from "@/api/v1/system";

const item = [
    {
        key: "1",
        icon: <HomeFilled/>,
        label: "我的文件"
    }
]

interface Flow {
    _id: string,
    filename: string,
    user_id: string,
    preview_url: string,
}

const Index: React.FC = () => {

    const {Sider, Content} = Layout;
    const {Meta} = Card;

    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [list, setList] = useState<Flow[]>([])

    const [form] = Form.useForm();

    const handleShow = () => {
        setVisible(true)
    }

    const handleOk = () => {
        form.validateFields().then(async (value) => {
            form.resetFields()
            setConfirmLoading(true);
            try {
                const data = await createFlow(value)
                window.open(`/diagraming/${data.file_id}`)
            }finally {
                // 这里是重新获取页面数据，如果可以推荐封装一下
                const data = await flowList()
                setList(data.list)

                setVisible(false);
                setConfirmLoading(false);
            }

        })
    }
    const handleCancel = () => {
        form.resetFields()
        setVisible(false)
    }

    // 获取请求参数
    useEffect(() => {
        (async () => {
            const data = await flowList()
            setList(data.list)
        })()
    }, [])

    return (
        <>
            <Layout className="manage-layout">
                <Sider>
                    <div className="create">
                        <Button type="primary" style={{width: 170}} onClick={handleShow}>创建文件</Button>
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        items={item}
                    />
                </Sider>
                <Layout style={{overflowY: 'auto'}}>
                    <Content
                        style={{
                            margin: '24px 16px',
                            minHeight: 280,
                        }}
                    >
                        <div>我的文件</div>
                        <Row gutter={16}>
                            {
                                list.map(item => {
                                    return (
                                        <Col key={item._id} span={6} style={{marginTop: 16}} >
                                            <Card bordered={false} hoverable={true} onClick={() => {
                                                window.open(`/diagraming/${item._id}`)
                                            }}
                                                  cover={
                                                      item.preview_url ? <img style={{height: 170, width: '100%'}}
                                                          alt="example"
                                                          src={item.preview_url}
                                                      /> : <div style={{height: 170,width: '100%'}}></div>
                                                  }
                                            >
                                                <Meta title={item.filename}/>
                                            </Card>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </Content>
                </Layout>
            </Layout>
            <Modal
                title="创建文件"
                visible={visible}
                onOk={handleOk}
                okText="确定"
                cancelText="取消"
                onCancel={handleCancel}
                confirmLoading={confirmLoading}
            >
                <Form
                    name="basic-form"
                    initialValues={{remember: true, modifier: 'public'}}
                    form={form}
                    autoComplete="off"
                >
                    <Form.Item
                        label="名称："
                        name="filename"
                        rules={[{required: true, message: 'Please input your username!'}]}
                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default Index