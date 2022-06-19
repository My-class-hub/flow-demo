/** 自定义圆形 **/
import {EllipseResize} from "@logicflow/extension"

class CircularModel extends EllipseResize.model {

    initNodeData(data: any) {
        super.initNodeData(data);
        this.rx = 35
        this.ry = 35
    }
}

class CircularNode extends EllipseResize.view {

}

export default {
    type: "Circular",
    model: CircularModel,
    view: CircularNode
}
