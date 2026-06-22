const COLORS = [
  "#ffffff",
  "#000000",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

export default function ColorPicker({
  shapes,
  selectedId,
  setShapes,
  saveHistory,
}) {
  const selectedShape = shapes.find((s) => s.id === selectedId);
  if (!selectedShape) return null;

  const isText = selectedShape.type === "text";
  const isArrow = selectedShape.type === "arrow";
  const updateColor = (key, value) => {
    saveHistory();
    setShapes(
      shapes.map((s) => (s.id === selectedId ? { ...s, [key]: value } : s)),
    );
  };

  const hexToRgba = (hex, opacity) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
  };

  const getOpacity = (color) => {
    if (!color) return 1;
    if (color.startsWith("rgba")) {
      const match = color.match(/[\d.]+/g);
      return match ? parseFloat(match[3]) : 1;
    }
    return 1;
  };

  const getHex = (color) => {
    if (!color) return "#ffffff";
    if (color.startsWith("rgba")) {
      const match = color.match(/[\d.]+/g);
      if (!match) return "#ffffff";
      const r = parseInt(match[0]).toString(16).padStart(2, "0");
      const g = parseInt(match[1]).toString(16).padStart(2, "0");
      const b = parseInt(match[2]).toString(16).padStart(2, "0");
      return `#${r}${g}${b}`;
    }
    return color;
  };

  const updateText = (value) => {
    saveHistory();
     console.log("updating text to:", value)
    setShapes(
      shapes.map((s) => (s.id === selectedId ? { ...s, text: value } : s)),
    );
  };

  const fillOpacity = getOpacity(selectedShape.fill);
  const fillHex = getHex(selectedShape.fill);
  const strokeHex = getHex(selectedShape.stroke);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {!isText && (
      <div className="flex items-center gap-1">
        <span className="text-xs text-base-content/60">Label</span>
        <input
          type="text"
          defaultValue={selectedShape.text || ""}
          onKeyDown={(e) => {
    if (e.key === "Enter") {
      updateText(e.target.value)
      
    }
  }}
          placeholder="Add label..."
          className="input input-bordered input-xs w-32"
        />
      </div>
    )}

      {isText && (
        <div className="flex items-center gap-1">
          <span className="text-xs text-base-content/60">Color</span>
          <div className="flex gap-1">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => updateColor("fill", color)}
                style={{ background: color }}
                className={`w-5 h-5 rounded-md border ${
                  fillHex === color
                    ? "border-primary border-2"
                    : "border-base-300"
                }`}
              />
            ))}
            <input
              type="color"
              value={fillHex}
              onChange={(e) => updateColor("fill", e.target.value)}
              className="w-5 h-5 rounded-full cursor-pointer border-0"
            />
          </div>
        </div>
      )}
      {isArrow && (
        <div className="flex items-center gap-1">
          <span className="text-xs text-base-content/60">Color</span>
          <div className="flex gap-1">
            {COLORS.map((color) => (
              <button
                key={color}
                onClick={() => updateColor("stroke", color)}
                style={{ background: color }}
                className={`w-5 h-5 rounded-md border ${
                  fillHex === color
                    ? "border-primary border-2"
                    : "border-base-300"
                }`}
              />
            ))}
            <input
              type="color"
              value={fillHex}
              onChange={(e) => updateColor("fill", e.target.value)}
              className="w-5 h-5 rounded-full cursor-pointer border-0"
            />
          </div>
        </div>
      )}
      {!isArrow && !isText && (
        <>
          <div className="flex items-center gap-1">
            <span className="text-xs text-base-content/60">Fill</span>
            <div className="flex gap-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() =>
                    updateColor("fill", hexToRgba(color, fillOpacity))
                  }
                  style={{ background: color }}
                  className={`w-5 h-5 rounded-md border ${
                    fillHex === color
                      ? "border-primary border-2"
                      : "border-base-300"
                  }`}
                />
              ))}
              <input
                type="color"
                value={fillHex}
                onChange={(e) =>
                  updateColor("fill", hexToRgba(e.target.value, fillOpacity))
                }
                className="w-5 h-5 rounded-md cursor-pointer border-0"
              />
            </div>

            {/* Opacity */}
            <div className="flex items-center gap-1 ml-1">
              <span className="text-xs text-base-content/60">
                {Math.round(fillOpacity * 100)}%
              </span>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={fillOpacity}
                onChange={(e) =>
                  updateColor(
                    "fill",
                    hexToRgba(fillHex, parseFloat(e.target.value)),
                  )
                }
                className="range range-xs"
              />
            </div>
          </div>

          <div className="divider divider-horizontal mx-0" />

          {/* Stroke */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-base-content/60">Stroke</span>
            <div className="flex gap-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => updateColor("stroke", color)}
                  style={{ background: color }}
                  className={`w-5 h-5 rounded-full border ${
                    strokeHex === color
                      ? "border-primary border-2"
                      : "border-base-300"
                  }`}
                />
              ))}
              <input
                type="color"
                value={strokeHex}
                onChange={(e) => updateColor("stroke", e.target.value)}
                className="w-5 h-5 rounded-full cursor-pointer border-0"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
