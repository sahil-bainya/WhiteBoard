export const getShapeEdgePoint = (node, shape, targetX, targetY) => {
  if (!node) return { x: 0, y: 0 }

  // center nikalo
  let cx, cy
  if (shape.type === "circle") {
    cx = node.x()
    cy = node.y()
  } else {
    cx = node.x() + (node.width() / 2) * Math.cos(node.rotation() * Math.PI / 180)
      - (node.height() / 2) * Math.sin(node.rotation() * Math.PI / 180)
    cy = node.y() + (node.width() / 2) * Math.sin(node.rotation() * Math.PI / 180)
      + (node.height() / 2) * Math.cos(node.rotation() * Math.PI / 180)
  }

  const angle = Math.atan2(targetY - cy, targetX - cx)

  if (shape.type === "circle") {
    return {
      x: cx + shape.radius * Math.cos(angle),
      y: cy + shape.radius * Math.sin(angle),
    }
  }

  if (shape.type === "rect") {
    const rotation = (node.rotation() * Math.PI) / 180
    const hw = node.width() / 2
    const hh = node.height() / 2

    // local angle — rotation minus karo
    const localAngle = angle - rotation
    const tanAngle = Math.tan(localAngle)

    let lx, ly
    if (Math.abs(tanAngle) <= hh / hw) {
      lx = localAngle > -Math.PI / 2 && localAngle < Math.PI / 2 ? hw : -hw
      ly = tanAngle * lx
    } else {
      ly = localAngle > 0 ? hh : -hh
      lx = ly / tanAngle
    }

    // local point ko global mein convert karo
    return {
      x: cx + lx * Math.cos(rotation) - ly * Math.sin(rotation),
      y: cy + lx * Math.sin(rotation) + ly * Math.cos(rotation),
    }
  }

  return { x: cx, y: cy }
}

export const getShapeCenter = (node, shape) => {
  if (!node || !shape) return { x: 0, y: 0 }
  if (shape.type === "circle") return { x: node.x(), y: node.y() }

  const rotation = (node.rotation() * Math.PI) / 180
  const hw = node.width() / 2
  const hh = node.height() / 2

  return {
    x: node.x() + hw * Math.cos(rotation) - hh * Math.sin(rotation),
    y: node.y() + hw * Math.sin(rotation) + hh * Math.cos(rotation),
  }
}