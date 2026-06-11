import { useEffect, useState } from "react";
import { Stage, Layer, Transformer, Arrow } from "react-konva";
import { Workflow, NotebookText } from "lucide-react";
import { ContextPanel } from "../";
import { useBoard } from "./useBoard.js";
import SaveButton from "./SaveButton.jsx";
// import { useArrows } from "./useArrow.js";
import { SHAPE_CONFIG } from "./shapeConfig.jsx";
import "./BoardStyle.css";
import { messCleanup, architectureAssist } from "../../services/aiServices.js";
import { getElkPositions } from "./elk.js";
import { Button } from "../";
import AisuggestionPannel from "./AiSuggestionPannel.jsx";
import NotesPage from "./NotesPage.jsx";
// import dagre from "@dagrejs/dagre"

export default function BoardPage() {
  const {
    shapes,
    setShapes,
    addToNotes,
    boardNotes,
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
    removeNotes,
    getShapeCenter,
    shapeRefs,
    toolbarRef,
    addShape,
    handleDragEnd,
    deleteSelected,
    handleTransformEnd,
    saveTitle,
    stageSize,
    arrows,
    getShapeEdgePoint,
    connectingFrom,
    setConnectingFrom,
    updateArrowPoints,
    connectShapes,
    removeArrowsForShape,
    setArrows,
  } = useBoard();

  const [loading, setLoading] = useState(false);
  const [pendingCleanup, setPendingCleanup] = useState(false);
  const [notesShowing, setNotesShowing] = useState(false);

  const [aiResponse, setAiresponse] = useState(null);
  const handleAssist = async () => {
    const result = await architectureAssist(shapes, arrows);
    setAiresponse(result);
    console.log(result);
  };

  const handleCleanup = async () => {
    setLoading(true);
    try {
      const result = await messCleanup(shapes, arrows);
      const elkNodes = await getElkPositions(shapes, result.edges);
      console.log(shapes);
      const updatedShapes = shapes.map((shape) => {
        const elkNode = elkNodes.find((n) => n.id === shape.id);
        if (!elkNode) return shape;
        return {
          ...shape,
          x:
            shape.type === "circle" ? elkNode.x + elkNode.width / 2 : elkNode.x,
          y:
            shape.type === "circle"
              ? elkNode.y + elkNode.height / 2
              : elkNode.y,
        };
      });
      console.log(updatedShapes);
      setShapes(updatedShapes);
      setPendingCleanup(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pendingCleanup) return;
    shapes.forEach((shape) => updateArrowPoints(shape.id));
    setTimeout(() => setPendingCleanup(false), 0);
  }, [pendingCleanup, shapes, updateArrowPoints]);

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
        <Button onClick={handleAssist} children="Assist"></Button>
        <Button
          onClick={handleCleanup}
          children="cleanup"
          loading={loading}
          loadingText="cleaning..."
        ></Button>
        <button
          className={notesShowing ? "bg-amber-400" : "bg-amber-50"}
          onClick={() => {
            setNotesShowing((prev) => !prev);
          }}
        >
          <NotebookText />
        </button>
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

      {aiResponse && (
        <AisuggestionPannel
          suggestions={aiResponse.suggestions}
          summary={aiResponse.summary}
          diagramType={aiResponse.diagram_type}
          onClose={() => setAiresponse(null)}
          onAddToNotes={async () => {
            const newNote = {
              id: crypto.randomUUID(),
              text: `${aiResponse.summary}\n\n${aiResponse.suggestions
                .map((s) => `• ${s.title}: ${s.message}`)
                .join("\n")}`,
            };
            addToNotes(newNote);
          }}
        />
      )}
      {notesShowing && (
        <NotesPage
          boardNotes={boardNotes}
          onDelete={(id) => removeNotes(id)}
          addNotes={addToNotes}
        />
      )}
    </div>
  );
}
