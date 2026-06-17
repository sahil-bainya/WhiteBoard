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
import CanvasControls from "./CanvasControls.jsx";

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
    undo,
    redo,
    zoomIn,
    zoomOut,
    resetZoom,
    saveHistory,
    exportPNG,
    exportPDF,
    setArrows,
  } = useBoard();

  const [loading, setLoading] = useState(false);
  const [pendingCleanup, setPendingCleanup] = useState(false);
  const [notesShowing, setNotesShowing] = useState(false);
  const [contextShape, setContextShape] = useState(null);

  const [aiResponse, setAiresponse] = useState(null);
  const [grid, setGrid] = useState(false);

  const handleAssist = async () => {
    const result = await architectureAssist(shapes, arrows);
    setAiresponse(result);
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
  }, [selectedId, deleteSelected, removeArrowsForShape]);

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.ctrlKey && e.key === "z") undo();
      if (e.ctrlKey && e.key === "y") redo();
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown); //cleanup function hai — React automatically call karta hai jab component unmount ho.
  }, [undo, redo]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    stage.position({
      x: stageSize.width / 2,
      y: stageSize.height / 2,
    });
  }, [stageSize, stageRef]);

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
          undo={undo}
          redo={redo}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          resetZoom={resetZoom}
          selectedId={selectedId}
          shapes={shapes}
          setShapes={setShapes}
          saveHistory={saveHistory}
          exportPNG={exportPNG}
          exportPDF={exportPDF}
          grid={grid}
          setGrid={setGrid}
          setArrows={setArrows}
         shapeRefs={shapeRefs}
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
        grid={grid}
      />
      <CanvasControls
        undo={undo}
        redo={redo}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        resetZoom={resetZoom}
        grid={grid}
        setGrid={setGrid}
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
