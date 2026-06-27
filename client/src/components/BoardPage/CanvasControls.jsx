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
    <div className="m-3!">
      <div className="flex flex-row flex-wrap gap-2">
      <ul className="menu menu-horizontal bg-base-300 rounded-md mt-6">
        <li>
          <a className="tooltip p-2! h-full" data-tip="Undo">
            <button onClick={() => undo()}>
              <Undo2 size={18} />
            </button>
          </a>
        </li>
        <li>
          <a className="tooltip p-2! h-full" data-tip="Redo">
            <button onClick={() => redo()}>
              <Redo2 size={18} />
            </button>
          </a>
        </li>
      </ul>
    
      <ul className="menu menu-horizontal bg-base-300 rounded-md mt-6">
        <li>
          <a className=" p-2!" >
            <button onClick={() => zoomIn()}>+</button>
          </a>
        </li>
        <li>
          <a className="tooltip p-2! hover:bg-transparent active:bg-transparent" data-tip="Reset zoom">
            <button onClick={() => resetZoom()}>100%</button>
          </a>
        </li>
        <li>
          <a className=" px-2.5! py-2!" >
            <button onClick={() => zoomOut()}>-</button>
          </a>
        </li>
      </ul>

      <label className="label bg-base-300 p-2! rounded-md">
        <input
          type="checkbox"
          defaultChecked={grid}
          className="toggle toggle-sm"
          onChange={() => setGrid((prev) => !prev)}
        />
        <p>Show grid</p>
      </label>
</div>
      
    
    </div>
  );
}
