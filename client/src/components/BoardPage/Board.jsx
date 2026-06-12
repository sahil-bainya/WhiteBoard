import { useEffect, useState } from "react";
import { ContextPanel } from "../";
import { useBoard } from "./useBoard.js";
import "./BoardStyle.css";
import { messCleanup, architectureAssist } from "../../services/aiServices.js";
import { getElkPositions } from "./elk.js";
import AisuggestionPannel from "./AiSuggestionPannel.jsx";
import NotesPage from "./NotesPage.jsx";
import Toolbar from "./Toolbar.jsx";
import StageCanvas from "./StageCanvas.jsx";

export default function Board() {
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

  const [loading, setLoading] = useState(false);
  const [pendingCleanup, setPendingCleanup] = useState(false);
  const [notesShowing, setNotesShowing] = useState(false);
  const [contextShape, setContextShape] = useState(null);

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

  useEffect(() => {
    if (!pendingCleanup) return;
    shapes.forEach((shape) => updateArrowPoints(shape.id));
    setTimeout(() => setPendingCleanup(false), 0);
  }, [pendingCleanup, shapes, updateArrowPoints]);


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

  return (
    <div>
      <div ref={toolbarRef}>
        <Toolbar
          error={error} // doubt
          loading={loading}
          handleAssist={handleAssist}
          handleCleanup={handleCleanup}
          notesShowing={notesShowing}
          setNotesShowing={setNotesShowing}
          boardName={boardName}
          setBoardName={setBoardName}
          tool={tool}
          saveBoard={saveBoard}
          setTool={setTool}
          arrows={arrows}
          addShape={addShape}
          saveTitle={saveTitle}
          isEditingTitle={isEditingTitle}
          setIsEditingTitle={setIsEditingTitle}
        />
      </div>

      <StageCanvas
        stageRef={stageRef}
        stageSize={stageSize}
        setSelectedId={setSelectedId}
        arrows={arrows}
        shapes={shapes}
        shapeRefs={shapeRefs}
        updateArrowPoints={updateArrowPoints}
        handleDragEnd={handleDragEnd}
        handleTransformEnd={handleTransformEnd}
        handleTextDblClick={handleTextDblClick}
        setContextShape={setContextShape}
        transformerRef={transformerRef}
        selectedId={selectedId}
        handleShapeClick={handleShapeClick}
      />

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
