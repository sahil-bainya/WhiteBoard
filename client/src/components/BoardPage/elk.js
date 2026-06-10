import ELK from "elkjs"; // Eclipse Layout Kernel
const elk = new ELK();

export const getElkPositions = async (shapes, edges) => {
  const graph = {
    id: "root",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "RIGHT",
      "elk.spacing.nodeNode": "80",
      "elk.layered.spacing.nodeNodeBetweenLayers": "100",
    },
    children: shapes.map((s) => ({
      id: s.id,
      width: s.type === "circle" ? s.radius * 2 : s.width || 100,
      height: s.type === "circle" ? s.radius * 2 : s.height || 80,
    })),
    edges: edges.map((e) => ({
      id: `${e.from}-${e.to}`,
      sources: [e.from],        
      targets: [e.to],
    })),
  };

  const result = await elk.layout(graph);
  return result.children; // positions milegi
};
