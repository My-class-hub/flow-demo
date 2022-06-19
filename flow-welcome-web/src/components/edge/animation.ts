import { PolylineEdge, PolylineEdgeModel } from "@logicflow/core";

class AnimationEdgeModel extends PolylineEdgeModel {
    // customTextPosition = true;
    setAttributes() {
        this.isAnimation = true;
    }
    getEdgeAnimationStyle() {
        const style = super.getEdgeAnimationStyle();
        style.strokeDasharray = "5 5";
        style.animationDuration = "30s";
        // 设置颜色
        style.stroke = "#000000"
        return style;
    }
}

class AnimationEdge extends PolylineEdge {}

export default {
    type: "animation-edge",
    model: AnimationEdgeModel,
    view: AnimationEdge
};