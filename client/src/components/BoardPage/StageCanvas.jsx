import { Stage, Layer, Transformer, Arrow, Text } from "react-konva";
import { SHAPE_CONFIG } from "./shapeConfig.jsx";
import { getTextPosition } from "./canvasHelper.js";
import "./BoardStyle.css";
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
  grid,
  setPendingShapeType,
  pendingShapeType,
  addShape,
}) {
  return (
    <Stage
      id={grid ? "Canvas" : undefined}
      width={stageSize.width}
      height={stageSize.height}
      ref={stageRef}
      draggable
  //     onWheel={(e) => {  // ← yeh add karo, ZOOM ke liye
  //   e.evt.preventDefault();
  //   const stage = stageRef.current;
  //   const oldScale = stage.scaleX();
  //   const pointer = stage.getPointerPosition();
  //   const scaleBy = 1.1;
  //   const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
  //   const clampedScale = Math.min(Math.max(newScale, 0.1), 5);
  //   stage.scale({ x: clampedScale, y: clampedScale });
  //   const newPos = {
  //     x: pointer.x - (pointer.x - stage.x()) * (clampedScale / oldScale),
  //     y: pointer.y - (pointer.y - stage.y()) * (clampedScale / oldScale),
  //   };
  //   stage.position(newPos);
  // }}
      onMouseDown={(e) => {
        if (pendingShapeType) {
          const pointerPos = e.target.getStage().getPointerPosition();

          const stage = e.target.getStage();
          const transform = stage.getAbsoluteTransform().copy().invert();
          const canvasPos = transform.point(pointerPos);

          addShape(pendingShapeType, canvasPos.x, canvasPos.y);
          setPendingShapeType(null);
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
           if (el.type === "diamond") {
    console.log("Diamond props:", getProps(el));
    console.log("Diamond el:", el);
  }
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

              {el.type !== "text" && el.text && (
                <Text
                  key={el.id + "-label"}
                  {...getTextPosition(el)}
                  text={el.text}
                  align="center"
                  fill={el.stroke || "#000000"}
                  listening={false}
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
