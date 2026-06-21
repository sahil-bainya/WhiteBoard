import { Button } from "../";
import SaveButton from "./SaveButton";
import { SHAPE_CONFIG } from "./shapeConfig.jsx";
import {
  Workflow,
  NotebookText,
  ImageDown,
  Download,
  Brain,
  ChevronLeft 
} from "lucide-react";
import TextToDiagram from "./TextToDiagram.jsx";
import "./Toolbar.css";
import { useNavigate } from "react-router-dom";
export default function Toolbar({
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
  shapes,
  setShapes,
  saveHistory,
  exportPNG,
  exportPDF,
  shapeRefs,
}) {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between w-auto m-5!">
      <div className="flex gap-2">
        <button onClick={()=>navigate("/dashboard")}><ChevronLeft /></button> 
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
      </div>
      <ul className="menu menu-horizontal bg-base-300 rounded-box mt-6 flex gap-3 p-1!">
        {Object.entries(SHAPE_CONFIG).map(([type, config]) => (
          <li>
            <div className="tooltip tooltip-bottom" data-tip={config.datatip}>
              <button
                key={type}
                onClick={() => addShape(type)}
                className="   p-2!"
              >
                {config.icon}
              </button>
            </div>
          </li>
        ))}
        <li>
          <div className="tooltip" data-tip="Connect">
            <button
              onClick={() => setTool(tool === "connect" ? "select" : "connect")}
              style={{
                background: tool === "connect" ? "#000" : "",
                color: tool === "connect" ? "#fff" : "",
              }}
              className="p-2!"
            >
              <Workflow size={18} />
            </button>
          </div>
        </li>
      </ul>
      <div className="flex flex-row gap-1.5 flex-wrap">
        <SaveButton saveBoard={saveBoard} arrows={arrows} />
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="tooltip tooltip-bottom"
            data-tip="use AI features"
          >
            <button className="btn btn-sm btn-ghost p-5! bg-base-300 rounded-xl">
              <Brain size={18} />
              AI
            </button>
          </div>
          <ul
            tabIndex="-1"
            className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li className="tooltip" data-tip="Get AI suggestions">
              <Button onClick={handleAssist} children="Assist"></Button>
            </li>
            <li>
              <Button
                onClick={handleCleanup}
                children="cleanup"
                loading={loading}
                loadingText="cleaning..."
              ></Button>
            </li>
            <li>
              <TextToDiagram
                saveHistory={saveHistory}
                setShapes={setShapes}
                setArrows={setArrows}
                shapes={shapes}
                shapeRefs={shapeRefs}
              />
            </li>
          </ul>
        </div>
        <div
          className="dropdown dropdown-end tooltip tooltip-bottom"
          data-tip="Export"
        >
          <button className="btn btn-sm btn-ghost  bg-base-300 rounded-xl py-5! px-3!">
            <ImageDown size={18} />
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
        <div className="tooltip tooltip-bottom" data-tip="Notes">
          <button
            className={`btn btn-sm btn-ghost bg-base-300 rounded-xl py-5! px-3! ${notesShowing && "hidden"}`}
            onClick={() => {
              setNotesShowing((prev) => !prev);
            }}
          >
            <NotebookText size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
