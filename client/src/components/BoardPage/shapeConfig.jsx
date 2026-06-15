import { Square, Circle as CircleIcon, Type, MoveUpRight } from "lucide-react"
import { Rect, Circle, Text, Arrow } from "react-konva"

export const SHAPE_CONFIG = {
  rect: {
    icon: <Square/>,
    defaults: { width: 100, height: 80, fill: "", stroke: "#000000" },
    Component: Rect,
    getProps: (el) => ({ width: el.width, height: el.height }),
  },
  circle: {
    icon: <CircleIcon />,
    defaults: { radius: 50, fill: "", stroke: "#000000" },
    Component: Circle,
    getProps: (el) => ({ radius: el.radius }),
  },
  text: {
    icon: <Type />,
    defaults: { text: "Hello", fontSize: 24, fill: "" },
    Component: Text,
    getProps: (el) => ({ text: el.text, fontSize: el.fontSize }),
  },
  arrow: {
    icon: <MoveUpRight />,
    defaults: { points: [0, 0, 100, 0], stroke: "#000000", fill: "", strokeWidth: 2 },
    Component: Arrow,
    getProps: (el) => ({ points: el.points, strokeWidth: el.strokeWidth }),
  },
}