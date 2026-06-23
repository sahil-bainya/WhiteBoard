import { Stage, Layer, Transformer, Arrow ,Text} from "react-konva";
import { SHAPE_CONFIG } from "./shapeConfig.jsx";
import { getTextPosition } from "./canvasHelper.js";

export default function StageCanvas({
  stageRef,
  stageSize,
  setSelectedId,
  arrows,
  shapes,
  shapeRefs,
  updateArrowPoints,
  handleDragEnd,
  handleTransformEnd,
  handleTextDblClick,
  setContextShape,
  transformerRef,
  selectedId,
  handleShapeClick,
  grid,setPendingShapeType,
  pendingShapeType,addShape,
}) {
  return (
    <Stage
      id={grid && "Canvas"}
      width={stageSize.width}
      height={stageSize.height}
      ref={stageRef}
      onMouseDown={(e) => {
    if (pendingShapeType) {
      // click-position nikalo (Stage ke relative coordinates mein)
      const pointerPos = e.target.getStage().getPointerPosition();
      
      // Stage ka current scale/position consider karo (kyunki zoom/pan ki wajah se 
      // screen-coordinates aur canvas-coordinates alag ho sakte hain)
      const stage = e.target.getStage();
      const transform = stage.getAbsoluteTransform().copy().invert();
      const canvasPos = transform.point(pointerPos);

      addShape(pendingShapeType, canvasPos.x, canvasPos.y);
      setPendingShapeType(null); // ek shape place hone ke baad mode reset karo
      return;
    }

    if (e.target === e.target.getStage()) setSelectedId(null);
  }}
    >
      <Layer>
        {arrows.map((arrow) => (
          <Arrow
            key={arrow.id}
            points={arrow.points}
            stroke={arrow.stroke || "#000000"}
            fill={arrow.fill || "#000000"}
            strokeWidth={2}
          />
        ))}
        {shapes.map((el) => {
          const { Component, getProps } = SHAPE_CONFIG[el.type];
          return (
            <>
              <Component
                key={el.id}
                draggable
                x={el.x || 0}
                y={el.y || 0}
                rotation={el.rotation || 0}
                fill={el.fill}
                stroke={el.stroke}
                ref={(node) => (shapeRefs.current[el.id] = node)}
                onClick={(e) => handleShapeClick(e, el.id)}
                onDragMove={() => updateArrowPoints(el.id)}
                onDragEnd={(e) => handleDragEnd(e, el.id, updateArrowPoints)}
                onTransformEnd={() => handleTransformEnd(el.id)}
                onDblClick={() =>
                  el.type === "text"
                    ? handleTextDblClick(el.id)
                    : setContextShape(el)
                }
                {...getProps(el)}
              />

              {/* naya — label text, sirf non-text shapes ke liye jinke paas text hai */}
              {el.type !== "text" && el.text && (
                <Text
                  key={el.id + "-label"}
                  {...getTextPosition(el)}
                  text={el.text}
                  align="center"
                  fill={el.stroke || "#000000"} 
                  listening={false} // ← important, taaki click events Component pe hi jaayein, text overlap na kare
                  rotation={el.rotation || 0}
                />
              )}
            </>
          );
        })}
        <Transformer
          ref={transformerRef}
          boundBoxFunc={(oldBox, newBox) =>
            newBox.width < 10 || newBox.height < 10 ? oldBox : newBox
          }
          enabledAnchors={
            shapes.find((s) => s.id === selectedId)?.type === "circle"
              ? ["top-left", "top-right", "bottom-left", "bottom-right"]
              : undefined
          }
          keepRatio={shapes.find((s) => s.id === selectedId)?.type === "circle"}
          rotateEnabled={true}
        />
      </Layer>
    </Stage>
  );
}
