import { useState } from "react";
import { Button, Input } from "../index";
import { textTodiagram } from "../../services/aiServices.js";
import { notify } from "../../utils/toast.jsx";
import { useEffect } from "react";
import { getShapeCenter, getShapeEdgePoint } from "./canvasHelper.js";

const sanitizeShape = (shape) => {
  const isValidHex = (color) =>
    typeof color === "string" && /^#[0-9A-F]{6}$/i.test(color);

  let sanitized = {
    ...shape,
    fill: isValidHex(shape.fill) ? shape.fill : "#f3f4f6",
    stroke: isValidHex(shape.stroke) ? shape.stroke : "#374151",
    context: shape.context || { notes: [], links: [], code: "" },
  };

  if (
    ["diamond", "parallelogram", "triangle", "line", "arrow"].includes(
      shape.type,
    )
  ) {
    if (!Array.isArray(shape.points) || shape.points.length === 0) {
      const w = (shape.width || 120) / 2;
      const h = (shape.height || 80) / 2;

      sanitized.points = [0, -h, w, 0, 0, h, -w, 0, 0, -h];
    }
    sanitized.closed = true;
  }

  return sanitized;
};

export default function TextToDiagram({
  saveHistory,
  setShapes,
  setArrows,
  shapeRefs,
  shapes,
}) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [newlyGeneratedShapes, setNewlyGeneratedShapes] = useState(null);

  const handleDiagramGeneration = async () => {
    if (!description || description.trim().length === 0) {
      notify.error("Description is required");
      return;
    }
    setLoading(true);
    try {
      const response = await textTodiagram(description);
      saveHistory();

      const newShapes = response.shapes.map(sanitizeShape);
      const newArrows = response.arrows;

      setShapes((prev) => [...prev, ...newShapes]);
      setArrows((prev) => [...prev, ...newArrows]);
      setNewlyGeneratedShapes(Date.now());
    } catch (err) {
      notify.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!newlyGeneratedShapes) return;

    setArrows((prevArrows) =>
      prevArrows.map((arrow) => {
        const fromNode = shapeRefs.current[arrow.from];
        const toNode = shapeRefs.current[arrow.to];
        if (!fromNode || !toNode) return arrow;

        const fromShape = shapes.find((s) => s.id === arrow.from);
        const toShape = shapes.find((s) => s.id === arrow.to);

        const fromCenter = getShapeCenter(fromNode, fromShape);
        const toCenter = getShapeCenter(toNode, toShape);
        const from = getShapeEdgePoint(
          fromNode,
          fromShape,
          toCenter.x,
          toCenter.y,
        );
        const to = getShapeEdgePoint(
          toNode,
          toShape,
          fromCenter.x,
          fromCenter.y,
        );

        return { ...arrow, points: [from.x, from.y, to.x, to.y] };
      }),
    );
  }, [newlyGeneratedShapes, setArrows, shapeRefs, shapes]);

  return (
    <div>
      <Input
        disabled={loading}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button
        onClick={handleDiagramGeneration}
        loading={loading}
        children="Text to digram"
      />
    </div>
  );
}
