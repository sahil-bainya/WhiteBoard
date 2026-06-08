import { useState, useRef, useEffect } from "react";
import api from "../../services/api.js";
import { useParams } from "react-router-dom";
import { SHAPE_CONFIG } from "./shapeConfig.jsx";
import { getShapeCenter, getShapeEdgePoint } from "./canvasHelper.js";
export function useBoard() {
  const { id } = useParams();
  const [shapes, setShapes] = useState([]);
  const [boardName, setBoardName] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [tool, setTool] = useState("select");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const stageRef = useRef(null);
  const transformerRef = useRef(null);
  const shapeRefs = useRef({});
  const toolbarRef = useRef(null);
  const [arrows, setArrows] = useState([]);
  const [connectingFrom, setConnectingFrom] = useState(null);

  const updateArrowPoints = (movedId) => {
    setArrows((prev) =>
      prev.map((arrow) => {
        if (arrow.from !== movedId && arrow.to !== movedId) return arrow;
        const fromShape = shapes.find((s) => s.id === arrow.from);
        const toShape = shapes.find((s) => s.id === arrow.to);
        const fromNode = shapeRefs.current[arrow.from];
        const toNode = shapeRefs.current[arrow.to];
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
  };

  const connectShapes = (fromId, toId) => {
    const fromShape = shapes.find((s) => s.id === fromId);
    const toShape = shapes.find((s) => s.id === toId);
    const fromNode = shapeRefs.current[fromId];
    const toNode = shapeRefs.current[toId];
    const fromCenter = getShapeCenter(fromNode, fromShape);
    const toCenter = getShapeCenter(toNode, toShape);
    const from = getShapeEdgePoint(fromNode, fromShape, toCenter.x, toCenter.y);
    const to = getShapeEdgePoint(toNode, toShape, fromCenter.x, fromCenter.y);
    setArrows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        from: fromId,
        to: toId,
        points: [from.x, from.y, to.x, to.y],
      },
    ]);
  };

  const removeArrowsForShape = (id) => {
    setArrows((prev) => prev.filter((a) => a.from !== id && a.to !== id));
  };
  // load board
  useEffect(() => {
    (async () => {
      const res = await api.get(`/boards/${id}`);
      setShapes(res.data.data.board.canvasData || []);
      setBoardName(res.data.data.board.title);
      setArrows(res.data.data.board.arrows);
    })();
  }, [id]);

  // transformer attach
  useEffect(() => {
    if (!transformerRef.current) return;
    if (selectedId) {
      const node = shapeRefs.current[selectedId];
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      }
    } else {
      transformerRef.current.nodes([]);
    }
  }, [selectedId]);
  
  const handleTextDblClick = (id) => {
    const node = shapeRefs.current[id];
    const stage = stageRef.current;

    node.hide();
    transformerRef.current.hide();

    const stageBox = stage.container().getBoundingClientRect();
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);

    textarea.value = node.text();
    textarea.style.position = "absolute";
    textarea.style.top = stageBox.top + node.absolutePosition().y + "px";
    textarea.style.left = stageBox.left + node.absolutePosition().x + "px";
    textarea.style.fontSize = node.fontSize() + "px";
    textarea.style.border = "1px dashed #999";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.background = "transparent";
    textarea.style.resize = "none";
    textarea.style.outline = "none";
    textarea.style.overflow = "hidden";
    textarea.style.whiteSpace = "pre";
    textarea.style.minWidth = "50px";
    textarea.style.minHeight = node.fontSize() * 1.2 + "px";

    const autoResize = () => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
      const span = document.createElement("span");
      span.style.cssText = `
      position: absolute; visibility: hidden;
      white-space: pre; font-size: ${node.fontSize()}px;
      font-family: Arial; line-height: 1.2; padding: 0;
    `;
      const longestLine = textarea.value
        .split("\n")
        .reduce((a, b) => (a.length > b.length ? a : b), "");
      span.textContent = longestLine || " ";
      document.body.appendChild(span);
      textarea.style.width = Math.max(50, span.offsetWidth + 10) + "px";
      document.body.removeChild(span);
    };

    autoResize();
    textarea.addEventListener("input", autoResize);
    textarea.focus();
    textarea.select();

    const save = () => {
      if (!document.body.contains(textarea)) return;
      setShapes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, text: textarea.value } : s)),
      );
      textarea.removeEventListener("input", autoResize);
      document.body.removeChild(textarea);
      node.show();
      transformerRef.current.show();
      transformerRef.current.getLayer().batchDraw();
    };

    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Escape") save();
    });
    textarea.addEventListener("blur", save);
    stage.container().addEventListener("mousedown", save, { once: true });
  };
  const addShape = (type) => {
    setShapes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type,
        x: 100,
        y: 100,

        ...SHAPE_CONFIG[type].defaults,
        context: {
          notes: "",
          links: [],
          code: "",
        },
      },
    ]);
    setSelectedId(null);
  };
  useEffect(() => {
    const updateSize = () => {
      const toolbarHeight = toolbarRef.current?.offsetHeight || 50;
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight - toolbarHeight,
      });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  const handleDragEnd = (e, id, updateArrowPoints) => {
    setShapes((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              x: e.target.x(),
              y: e.target.y(),
              rotation: e.target.rotation(),
            }
          : s,
      ),
    );
    updateArrowPoints(id);
  };

  const deleteSelected = (id, removeArrowsForShape) => {
    setShapes((prev) => prev.filter((s) => s.id !== id));
    removeArrowsForShape(id);
    setSelectedId(null);
  };

  const handleTransformEnd = (id) => {
    const node = shapeRefs.current[id];
    if (!node) return;
    const shape = shapes.find((s) => s.id === id);
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);

    const updatedFields =
      {
        rect: () => {
          const w = Math.max(10, node.width() * scaleX);
          const h = Math.max(10, node.height() * scaleY);
          node.width(w);
          node.height(h);
          return { width: w, height: h };
        },
        circle: () => {
          const r = Math.max(5, shape.radius * scaleX);
          node.radius(r);
          return { radius: r };
        },
        text: () => ({ fontSize: Math.max(8, shape.fontSize * scaleX) }),
        arrow: () => {
          const newPoints = shape.points.map((p, i) =>
            i % 2 === 0 ? p * scaleX : p * scaleY,
          );
          node.points(newPoints);
          return { points: newPoints };
        },
      }[shape.type]?.() ?? {};

    setShapes((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              x: node.x(),
              y: node.y(),
              rotation: node.rotation(), // ← yeh add karo
              ...updatedFields,
            }
          : s,
      ),
    );
  };

  const saveBoard = async (arrows) => {
      await api.patch(`/boards/${id}/canvas`, { canvasData: shapes, arrows });
  };

  const saveTitle = async () => {
    await api.patch(`/boards/${id}`, { title: boardName || "Untitled Board" });
  };

  return {
    shapes,
    setShapes,
    boardName,
    setBoardName,
    selectedId,
    setSelectedId,
    tool,
    setTool,
    isEditingTitle,
    setIsEditingTitle,
    stageRef,
    transformerRef,
    shapeRefs,
    toolbarRef,
    handleTextDblClick,
    addShape,
    handleDragEnd,
    deleteSelected,
    handleTransformEnd,
    saveBoard,
    saveTitle,
    stageSize,
    arrows,
    setArrows,
    connectingFrom,
    setConnectingFrom,
    updateArrowPoints,
    connectShapes,
    removeArrowsForShape,
  };
}
