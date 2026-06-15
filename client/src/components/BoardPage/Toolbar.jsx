import { Button } from "../";
import SaveButton from "./SaveButton";
import { SHAPE_CONFIG } from "./shapeConfig.jsx";
import { Workflow, NotebookText, Undo2, Redo2 } from "lucide-react";
import ColorPicker from "./ColorPicker.jsx";
export default function Toolbar({
  error,
  loading,
  handleAssist,
  handleCleanup,
  notesShowing,
  setNotesShowing,
  boardName,
  setBoardName,
  tool,
  saveBoard,
  setTool,
  arrows,
  addShape,
  saveTitle,
  isEditingTitle,
  setIsEditingTitle,
  undo,
  redo,
  zoomIn,
  zoomOut,
  resetZoom,
  selectedId,
  shapes,
  setShapes,
  saveHistory,
}) {
  return (
    <div>
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
      <div>
        <button onClick={() => undo()}>
          <Undo2 />
        </button>
        <button onClick={() => redo()}>
          <Redo2 />
        </button>
      </div>
      <div>
        <button onClick={() => zoomIn()}>+</button>
        <button onClick={() => resetZoom()}>100%</button>
        <button onClick={() => zoomOut()}>-</button>
      </div>
      {selectedId && (
        <ColorPicker
          shapes={shapes}
          selectedId={selectedId}
          setShapes={setShapes}
          saveHistory={saveHistory}
        />
      )}
    </div>
  );
}
