import { useState } from "react";
import { Button, Input } from "../index";
import { textTodiagram } from "../../services/aiServices.js";
import { notify } from "../../utils/toast.jsx";
import { useEffect } from "react";
import { CircleArrowUp } from 'lucide-react';
import {
  getShapeCenter,
  getShapeEdgePoint,
  getExistingContentBounds,
} from "./canvasHelper.js";

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
const fitStageToContent = (allShapes, stage, stageSize) => {
  if (allShapes.length === 0) return;

  const bounds = getExistingContentBounds(allShapes); // already-banaya-hua-helper-reuse-karo
  if (!bounds) return;

  const contentWidth = bounds.maxX - bounds.minX;
  const contentHeight = bounds.maxY - bounds.minY;
  const contentCenterX = (bounds.minX + bounds.maxX) / 2;
  const contentCenterY = (bounds.minY + bounds.maxY) / 2;

  // padding-ke-saath-fit-karne-ke-liye-scale-calculate-karo
  const padding = 100;
  const scaleX = stageSize.width / (contentWidth + padding * 2);
  const scaleY = stageSize.height / (contentHeight + padding * 2);
  const scale = Math.min(scaleX, scaleY, 1.5); // 1.5-se-zyada-zoom-mat-karo (bahut-zoomed-in-na-ho-jaaye-chhote-content-ke-liye)
  const finalScale = Math.max(scale, 0.1); // bahut-chhota-bhi-na-ho

  stage.scale({ x: finalScale, y: finalScale });
  stage.position({
    x: stageSize.width / 2 - contentCenterX * finalScale,
    y: stageSize.height / 2 - contentCenterY * finalScale,
  });
  stage.batchDraw();
};
export default function TextToDiagram({
  saveHistory,
  setShapes,
  setArrows,
  shapeRefs,
  shapes,
  stageRef,
  stageSize,
}) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [newlyGeneratedShapes, setNewlyGeneratedShapes] = useState(null);
  const [isopen, setisopen] = useState(false);
  const handleDiagramGeneration = async () => {
    if (!description || description.trim().length === 0) {
      notify.error("Description is required");
      return;
    }
    setLoading(true);
    try {
      setDescription("")
      const bounds = getExistingContentBounds(shapes);
      const suggestedStartX = bounds ? bounds.maxX + 150 : 100; // agar-content-hai, uske-right-mein-150px-gap-ke-baad-shuru-karo
      const suggestedStartY = bounds ? bounds.minY : 100; // same-vertical-level-pe-rakho (ya-chaho-toh-bounds.minY-bhi-kar-sakte-ho)

      const response = await textTodiagram(
        description,
        suggestedStartX,
        suggestedStartY,
      );
      saveHistory();

      const idMap = {}; // AI-ki-purani-id → naya-unique-id

      const newShapes = response.shapes.map((shape) => {
        const newId = crypto.randomUUID();
        idMap[shape.id] = newId; // mapping-store-karo
        return sanitizeShape({ ...shape, id: newId });
      });

      const newArrows = response.arrows.map((arrow) => ({
        ...arrow,
        id: crypto.randomUUID(), // arrow-ki-apni-id-bhi-unique-karo
        from: idMap[arrow.from], // purani-shape-id-ki-jagah-naya-mapped-id
        to: idMap[arrow.to],
      }));
      // ===== ID-REMAPPING-KHATAM =====
      const allShapes = [...shapes, ...newShapes];
      setShapes(allShapes);
      setArrows((prev) => [...prev, ...newArrows]);
      setNewlyGeneratedShapes(Date.now());
      setTimeout(() => {
        fitStageToContent(allShapes, stageRef.current, stageSize);
      }, 100);
      setisopen(false)
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
      <button onClick={()=>setisopen(prev=>!prev)}>
        {isopen ? "Cancel": "Generate Diagram" }
      </button>
      {isopen && (
        <div>
          <Input
            disabled={loading}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            classname="w-full h-full"
          />
          <Button
            onClick={handleDiagramGeneration}
            loading={loading}
            children={<CircleArrowUp fill="#B5B5B5"/>}
          />
        </div>
      )}
    </div>
  );
}
