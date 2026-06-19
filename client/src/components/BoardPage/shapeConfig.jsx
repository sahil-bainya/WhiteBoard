import {
  Square,
  Circle as CircleIcon,
  Type,
  MoveUpRight,
  Minus,
} from "lucide-react";
import { Rect, Circle, Text, Arrow, Line } from "react-konva";

export const SHAPE_CONFIG = {
  rect: {
    icon: <Square size={18}/>,
    defaults: { width: 100, height: 80, fill: "", stroke: "#000000" },
    Component: Rect,
    datatip:"Rectangle",
    getProps: (el) => ({ width: el.width, height: el.height }),
  },
  circle: {
    icon: <CircleIcon size={18}/>,
    defaults: { radius: 50, fill: "", stroke: "#000000" },
    Component: Circle,
    datatip:"Circle",
    getProps: (el) => ({ radius: el.radius }),
  },
  text: {
    icon: <Type size={18}/>,
    defaults: { text: "Hello", fontSize: 24, fill: "" },
    Component: Text,
    datatip:"Text",
    getProps: (el) => ({ text: el.text, fontSize: el.fontSize }),
  },
  arrow: {
    icon: <MoveUpRight size={18}/>,
    defaults: {
      points: [0, 0, 100, 0],
      stroke: "#000000",
      fill: "",
      strokeWidth: 2,
    },
    Component: Arrow,
    datatip:"Arrow",
    getProps: (el) => ({ points: el.points, strokeWidth: el.strokeWidth }),
  },
  line: {
    icon: <Minus size={18}/>,
    defaults: {
      points: [0, 0, 100, 0],
      stroke: "#000000",
      strokeWidth: 2,
      lineCap: "round",
      lineJoin: "round",
    },
    Component: Line,
    datatip:"Line",
    getProps: (el) => ({ points: el.points, strokeWidth: el.strokeWidth }),
  },
};
