
import { Undo2, Redo2 } from "lucide-react";
export default function CanvasControls({
  zoomIn,
  zoomOut,
  resetZoom,
  undo,
  redo,
  grid,
  setGrid,
}) {
  return (
    <div>
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
      <label className="label">
        <input
          type="checkbox"
          defaultChecked={grid}
          className="toggle"
          onChange={() => setGrid((prev) => !prev)}
        />
        Show grid
      </label>
    </div>
  );
}
