import { Button } from "../";
import SaveButton from "./SaveButton";
import { SHAPE_CONFIG } from "./shapeConfig.jsx";
import { Workflow, NotebookText, ImageDown, Download } from "lucide-react";
import ColorPicker from "./ColorPicker.jsx";
import TextToDiagram from "./TextToDiagram.jsx";
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
  setArrows,
  addShape,
  saveTitle,
  isEditingTitle,
  setIsEditingTitle,
  selectedId,
  shapes,
  setShapes,
  saveHistory,
  exportPNG,
  exportPDF,
  shapeRefs
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
      <div className="tooltip" data-tip="Get AI suggestions">
        <Button onClick={handleAssist} children="Assist"></Button>
      </div>
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
      <div className="dropdown">
        <button className="btn btn-sm btn-ghost">
          <ImageDown size={16} /> Export image...
        </button>
        <ul className="dropdown-content menu bg-base-200 rounded-box w-max p-2!">
          <li>
            <button onClick={exportPNG} className="btn btn-s px-2!">
              <Download /> Export PNG
            </button>
          </li>
          <li>
            <button onClick={exportPDF} className="btn btn-s px-2!">
              <Download /> Export PDF
            </button>
          </li>
        </ul>
      </div>
      {selectedId && (
        <ColorPicker
          shapes={shapes}
          selectedId={selectedId}
          setShapes={setShapes}
          saveHistory={saveHistory}
        />
      )}

      <TextToDiagram
        saveHistory={saveHistory}
        setShapes={setShapes}
        setArrows={setArrows}
        shapes={shapes}
        shapeRefs={shapeRefs}
      />
    </div>
  );
}
