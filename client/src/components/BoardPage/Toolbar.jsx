import { Button } from "../";
import SaveButton from "./SaveButton";
import { SHAPE_CONFIG } from "./shapeConfig.jsx";
import { Workflow, NotebookText } from "lucide-react";
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
    </div>
  );
}
