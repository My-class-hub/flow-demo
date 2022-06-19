import React, {useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import LogicFlow from "@logicflow/core";
import Rectangle from "@/components/node/rectangle";
import Circular from "@/components/node/circular";
import Animation from "@/components/edge/animation";
import {Control, DndPanel, Menu, MiniMap, SelectionSelect, Snapshot} from "@logicflow/extension";

import "./index.less"
import {saveFlow, SaveFlow, selectFlow, fileUpload} from "@/api/v1/system";
import {message} from "antd";

const Index: React.FC = () => {

    const {fid} = useParams();


    // 获取ref
    const graph = useRef<HTMLDivElement>(null)

    // 初始化画板
    useEffect(() => {
        (async () => {
            const data = await selectFlow(fid!)
            const lf = new LogicFlow({
                container: graph.current!,
                grid: {
                    size: 10,
                    type: 'mesh'
                },
                config: {
                    color: '#ababab',
                    thickness: 1,
                },
                keyboard: {
                    enabled: true
                },
                plugins: [Control, DndPanel, SelectionSelect, Snapshot, MiniMap, Menu]
            })
            // 注册自定义节点
            lf.register(Rectangle)
            lf.register(Circular)
            lf.register(Animation)
            lf.setDefaultEdgeType("animation-edge")
            // 设置参数
            lf.extension.selectionSelect.openSelectionSelect();
            lf.extension.dndPanel.setPatternItems([
                {
                    type: 'Circular',
                    text: '圆形',
                    label: '圆形',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAiJJREFUOE+tlDFo1FAYx//fS6UgljZp3QQVk7sT4RTOqZMuLnYSFBQR3UxCuwg9FycXT3BpuZybIqKg4FQXF506eaAH4l0SUcHNNmmpCMXe+yS55Gyvd3IGs77/93t533u/j/CfPxrE21/9sK+N0SITFQE53cmJZWJuKNhsfLeP/ehX2xeo1vx5YjkHEm2AWwy0omIC8gDlwVJhEguhqd/the4Cao7/HuAiM5dDO7erIAKoVXeeiCoANQJLP74dugOoOf4SwGcF6OSKpdf/1t4pxy9J8FuAXgaWPpNmu0DN8c4DeCZp6/CaefTLMHc1Uft4SPDIZwAXAst4nrQFmKo0x+SY8o6Yb6/auYfDwNLMZNW9ykS3xEb7xEq5sBH/4cSid0oo/Diwcgf+BZZmNcf9Jtt0eW3WeBMDtWrrBpOYCS3jdBag6nivieVSYOfvJUD3CRHWV62cmQU46bg1ZowHdu5SDFQd7xEI66FpzGYBqjVvEYzx0DKuJMBP14nkucA0zmQBajXvFbN4EVpH7idH9qch8DQw9YPZgP5XSFwMbH05Bsbe0p4mMxYG2TFoo441mFP4VyHyu/uwO/5yZRhLUnhqCxOVU6971Ys9HsaWP5bs9LnfcIh9JuZrg6xJ7HjQ63FXvd7+JF7fAXiUQZ4AN6OMBBUIbAC0CeBm6u/AabN9IfJ7a69SEkKWACp11rgupaiP/GzXI2+HHrBZnk5a8xvFzuwVfZadcgAAAABJRU5ErkJggg==',
                },
                {
                    type: 'Rectangle',
                    text: '矩形',
                    label: '矩形',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAHdJREFUOE9jZKAyYKSyeQxgAwUm33aghsEfclUPgA0UnHZ7PyMDA0WG/mdgOPA+S9URYeD/fwffZas3kONSoak3G/4zMtmPeAMZGQ68y1RtHBxhOP12/f//DA7Ui5RRAyFZj5KcQp8wpGbhQPXii5zcgUsP1UtsAO9mqRUf/nShAAAAAElFTkSuQmCC',
                },
            ])
            lf.extension.control.addItem({
                iconClass: "navigation",
                title: "导航",
                text: "导航",
                onClick: (lFun: { getPointByClient: (arg0: any, arg1: any) => any; extension: { miniMap: { show: (arg0: number, arg1: any) => void; }; }; }, ev: { x: any; y: any; }) => {
                    lf.extension.miniMap.show(
                        1280,
                        80
                    );
                }
            });
            lf.extension.control.addItem({
                iconClass: "download",
                title: "下载",
                text: "下载",
                onClick: (lFun: { getPointByClient: (arg0: any, arg1: any) => any; extension: { miniMap: { show: (arg0: number, arg1: any) => void; }; }; }, ev: { x: any; y: any; }) => {
                    // @ts-ignore
                    lf.extension.snapshot.getSnapshot(`${data.filename}.png`);
                    // 获取流
                    // @ts-ignore
                    lf.extension.snapshot.getSnapshotBlob().then(res => {

                        const dto = {
                            "file": res.data,
                            "fid": fid
                        }
                        // 上传二进制流
                        fileUpload(dto).then(r => {
                            message.success({
                                content: "文件下载成功"
                            })
                        })
                    })
                }
            });
            lf.extension.control.addItem({
                iconClass: "save",
                title: "保存",
                text: "保存",
                onClick: (lFun: { getPointByClient: (arg0: any, arg1: any) => any; extension: { miniMap: { show: (arg0: number, arg1: any) => void; }; }; }, ev: { x: any; y: any; }) => {
                    const data = lf.graphModel.modelToGraphData();
                    const dto: SaveFlow = {
                        _id: fid!,
                        ...data
                    }
                    saveFlow(dto).then(r => {
                        // @ts-ignore
                        lf.extension.snapshot.getSnapshotBlob().then(res => {
                            const dto = {
                                "file": res.data,
                                "fid": fid
                            }
                            fileUpload(dto).then(r => {
                                message.success({
                                    content: "保存成功"
                                })
                            })
                        })
                    })

                    // const data = lf.getGraphData();
                    // console.log(data)
                }
            });
            lf.render(data.data)
        })()

    }, [])

    return (
        <>
            <div ref={graph} style={{height: '100%'}}></div>
        </>
    )
}

export default Index