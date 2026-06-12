import { Stage, Layer, Transformer, Arrow } from "react-konva";
import { SHAPE_CONFIG } from "./shapeConfig.jsx";
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
}) {
  return (
    <Stage
      id="Canvas"
      width={stageSize.width}
      height={stageSize.height}
      ref={stageRef}
      onMouseDown={(e) => {
        if (e.target === e.target.getStage()) setSelectedId(null);
      }}
    >
      <Layer>
        {arrows.map((arrow) => (
          <Arrow
            key={arrow.id}
            points={arrow.points}
            stroke="#000"
            fill="#000"
            strokeWidth={2}
          />
        ))}
        {shapes.map((el) => {
          const { Component, getProps } = SHAPE_CONFIG[el.type];
          return (
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
