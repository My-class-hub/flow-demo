/** 可变的矩形 **/
import { RectResize } from "@logicflow/extension";
import {h} from "@logicflow/core";

class RectangleModel extends RectResize.model {

    initNodeData(data: any) {
        super.initNodeData(data);
        this.height = 70
    }
}

class RectangleNode extends RectResize.view{
    getResizeShape(): h.JSX.Element {
        const {model} = this.props;
        const {x, y, width, height} = model;
        const style = model.getNodeStyle();
        return h("g", {}, [
            // 矩形
            h("rect", {
                ...style,
                x: x - width / 2,
                y: y - height / 2,
                width,
                height
            }),
        ])
    }
}

export default {
    type: "Rectangle",
    view: RectangleNode,
    model: RectangleModel
}