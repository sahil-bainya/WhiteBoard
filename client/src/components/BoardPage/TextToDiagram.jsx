import { useState } from "react";
import { Button, Input } from "../index";
import { textTodiagram } from "../../services/aiServices.js";
import { notify } from "../../utils/toast.jsx";
import { useEffect } from "react";
import { getShapeCenter, getShapeEdgePoint } from "./canvasHelper.js";

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
      const newShapes = response.shapes;
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


  }, [newlyGeneratedShapes, setArrows,shapeRefs,shapes]);

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
