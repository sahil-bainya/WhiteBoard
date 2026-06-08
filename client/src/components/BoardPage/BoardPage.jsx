import { useEffect, useState } from "react";
import { Stage, Layer, Transformer, Arrow } from "react-konva";
import { Workflow } from "lucide-react";
import { ContextPanel } from "../";
import { useBoard } from "./useBoard.js";
import SaveButton from "./SaveButton.jsx";
// import { useArrows } from "./useArrow.js";
import { SHAPE_CONFIG } from "./shapeConfig.jsx";
import "./BoardStyle.css";
export default function BoardPage() {
  const {
    shapes,
    setShapes,
    boardName,
    setBoardName,
    selectedId,
    saveBoard,
    setSelectedId,
    handleTextDblClick,
    tool,
    setTool,
    error,
    isEditingTitle,
    setIsEditingTitle,
    stageRef,
    transformerRef,
    shapeRefs,
    toolbarRef,
    addShape,
    handleDragEnd,
    deleteSelected,
    handleTransformEnd,
    saveTitle,
    stageSize,
    arrows,
    connectingFrom,
    setConnectingFrom,
    updateArrowPoints,
    connectShapes,
    removeArrowsForShape,
  } = useBoard();

  const [contextShape, setContextShape] = useState(null);
  // delete key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        if (document.activeElement.tagName === "TEXTAREA") return;
        deleteSelected(selectedId, removeArrowsForShape);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId]);

  const handleShapeClick = (e, id) => {
    if (tool === "connect") {
      if (!connectingFrom) {
        setConnectingFrom(id);
      } else if (connectingFrom !== id) {
        connectShapes(connectingFrom, id);
        setConnectingFrom(null);
        setTool("select");
      }
    } else {
      setSelectedId(id);
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div ref={toolbarRef}>
        {error && <p>{error}</p>}
        {isEditingTitle ? (
          <input
            autoFocus
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveTitle();
                setIsEditingTitle(false);
              }
              if (e.key === "Escape") setIsEditingTitle(false);
            }}
          />
        ) : (
          <h2 onDoubleClick={() => setIsEditingTitle(true)}>{boardName}</h2>
        )}
        {Object.entries(SHAPE_CONFIG).map(([type, config]) => (
          <button key={type} onClick={() => addShape(type)}>
            {config.icon}
          </button>
        ))}
        <button
          onClick={() => setTool(tool === "connect" ? "select" : "connect")}
          style={{
            background: tool === "connect" ? "#000" : "",
            color: tool === "connect" ? "#fff" : "",
          }}
        >
          <Workflow />
        </button>
        <SaveButton saveBoard={saveBoard} arrows={arrows} />
      </div>

      {/* Canvas */}
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
            keepRatio={
              shapes.find((s) => s.id === selectedId)?.type === "circle"
            }
            rotateEnabled={true}
          />
        </Layer>
      </Stage>

      {/* Context Panel */}
      {contextShape && (
        <div>
          <ContextPanel
            shape={contextShape}
            onClose={() => setContextShape(null)}
            onSave={(updatedShape) => {
              setShapes(
                shapes.map((s) =>
                  s.id === updatedShape.id ? updatedShape : s,
                ),
              );
              setContextShape(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
