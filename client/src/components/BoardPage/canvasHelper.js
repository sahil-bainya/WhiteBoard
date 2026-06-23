export const getShapeCenter = (node, shape) => {
  if (!node || !shape) return { x: 0, y: 0 };

  // Circle aur Ellipse — x,y khud center hote hain (Konva ka built-in behavior)
  if (shape.type === "circle" || shape.type === "ellipse") {
    return { x: node.x(), y: node.y() };
  }

  // Points-based shapes (diamond, parallelogram, triangle, line, arrow)
  // — points array se bounding-box ka center nikalo, phir node.x()/y() (jo anchor-point hai) mein add karo
  if (
    ["diamond", "parallelogram", "triangle"].includes(shape.type)
  ) {
    const points = shape.points;
    const xs = points.filter((_, i) => i % 2 === 0);
    const ys = points.filter((_, i) => i % 2 === 1);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const localCx = (minX + maxX) / 2;
    const localCy = (minY + maxY) / 2;

    const rotation = (node.rotation() * Math.PI) / 180;
    // local-center ko rotation apply karke global mein convert karo
    return {
      x: node.x() + localCx * Math.cos(rotation) - localCy * Math.sin(rotation),
      y: node.y() + localCx * Math.sin(rotation) + localCy * Math.cos(rotation),
    };
  }

  // Rect, RoundedRect — purana logic (width/height-based)
  const rotation = (node.rotation() * Math.PI) / 180;
  const hw = node.width() / 2;
  const hh = node.height() / 2;

  return {
    x: node.x() + hw * Math.cos(rotation) - hh * Math.sin(rotation),
    y: node.y() + hw * Math.sin(rotation) + hh * Math.cos(rotation),
  };
};
export const getShapeEdgePoint = (node, shape, targetX, targetY) => {
  if (!node) return { x: 0, y: 0 };

  const center = getShapeCenter(node, shape); // ← reuse karo, consistency ke liye
  const cx = center.x;
  const cy = center.y;
  const angle = Math.atan2(targetY - cy, targetX - cx);

  // Circle
  if (shape.type === "circle") {
    return {
      x: cx + shape.radius * Math.cos(angle),
      y: cy + shape.radius * Math.sin(angle),
    };
  }

  // Ellipse — elliptical-edge formula (alag radiusX, radiusY)
  if (shape.type === "ellipse") {
    const rotation = (node.rotation() * Math.PI) / 180;
    const localAngle = angle - rotation;
    const rx = shape.radiusX;
    const ry = shape.radiusY;
    // parametric-ellipse formula
    const lx = rx * Math.cos(localAngle);
    const ly = ry * Math.sin(localAngle);
    return {
      x: cx + lx * Math.cos(rotation) - ly * Math.sin(rotation),
      y: cy + lx * Math.sin(rotation) + ly * Math.cos(rotation),
    };
  }

  // Points-based polygons (diamond, parallelogram, triangle) —
  // approximate karne ke liye "bounding circle"-jaisa approach use karenge,
  // ya simpler: line-intersection approach (zyada accurate, thoda complex)
  if (["diamond", "parallelogram", "triangle"].includes(shape.type)) {
    const rotation = (node.rotation() * Math.PI) / 180;
    const localAngle = angle - rotation;

    // points ko local-coordinates mein le ke, ray-casting se intersection dhundo
    const points = shape.points;
    const numPoints = points.length / 2;
    let closestPoint = null;
    let minDist = Infinity;

    for (let i = 0; i < numPoints; i++) {
      const x1 = points[i * 2];
      const y1 = points[i * 2 + 1];
      const x2 = points[((i + 1) % numPoints) * 2];
      const y2 = points[((i + 1) % numPoints) * 2 + 1];

      // ray from origin (0,0) in direction of localAngle, intersect with edge (x1,y1)-(x2,y2)
      const rayDx = Math.cos(localAngle);
      const rayDy = Math.sin(localAngle);

      const edgeDx = x2 - x1;
      const edgeDy = y2 - y1;

      const denom = rayDx * edgeDy - rayDy * edgeDx;
      if (Math.abs(denom) < 1e-10) continue;

      const t = (x1 * rayDy - y1 * rayDx) / denom;
      const u = (x1 * edgeDy - y1 * edgeDx) / denom;

      if (u >= 0 && u <= 1 && t > 0) {
        const ix = x1 + t * edgeDx;
        const iy = y1 + t * edgeDy;
        const dist = Math.sqrt(ix * ix + iy * iy);
        if (dist < minDist) {
          minDist = dist;
          closestPoint = { x: ix, y: iy };
        }
      }
    }

    if (closestPoint) {
      return {
        x:
          cx +
          closestPoint.x * Math.cos(rotation) -
          closestPoint.y * Math.sin(rotation),
        y:
          cy +
          closestPoint.x * Math.sin(rotation) +
          closestPoint.y * Math.cos(rotation),
      };
    }
    return { x: cx, y: cy }; // fallback
  }

  // Rect, RoundedRect — purana logic
  if (shape.type === "rect" || shape.type === "roundedRect") {
    const rotation = (node.rotation() * Math.PI) / 180;
    const hw = node.width() / 2;
    const hh = node.height() / 2;
    const localAngle = angle - rotation;
    const tanAngle = Math.tan(localAngle);

    let lx, ly;
    if (Math.abs(tanAngle) <= hh / hw) {
      lx = localAngle > -Math.PI / 2 && localAngle < Math.PI / 2 ? hw : -hw;
      ly = tanAngle * lx;
    } else {
      ly = localAngle > 0 ? hh : -hh;
      lx = ly / tanAngle;
    }

    return {
      x: cx + lx * Math.cos(rotation) - ly * Math.sin(rotation),
      y: cy + lx * Math.sin(rotation) + ly * Math.cos(rotation),
    };
  }

  return { x: cx, y: cy };
};
export const getTextPosition = (shape) => {
  // Circle — x,y already center hai, radius se size milta hai
  if (shape.type === "circle") {
    return {
      x: shape.x - shape.radius,
      y: shape.y - 7, // sirf vertical center adjust, fontSize/2 jaisa
      width: shape.radius * 2,
      fontSize: Math.max(10, shape.radius * 0.25),
    };
  }

  // Ellipse — x,y already center hai (circle jaisa), radiusX/radiusY se size
  if (shape.type === "ellipse") {
    return {
      x: shape.x - shape.radiusX,
      y: shape.y - 7,
      width: shape.radiusX * 2,
      fontSize: Math.max(10, shape.radiusX * 0.25),
    };
  }

  if (
    shape.type === "diamond" ||
    shape.type === "parallelogram" ||
    shape.type === "triangle"
  ) {
    const xs = shape.points.filter((_, i) => i % 2 === 0);
    const ys = shape.points.filter((_, i) => i % 2 === 1);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const w = maxX - minX;

    return {
      x: shape.x + minX,
      y: shape.y + (minY + maxY) / 2 - 7,
      width: w,
      fontSize: Math.max(10, w * 0.1), // ← yeh add karo
    };
  }

  // Rect, RoundedRect — x,y top-left hai, width/height se size
  if (shape.type === "rect" || shape.type === "roundedRect") {
    return {
      x: shape.x,
      y: shape.y + shape.height / 2 - 7,
      width: shape.width,
      fontSize: Math.max(10, shape.x * 0.25),
    };
  }

  // Fallback
  return { x: shape.x, y: shape.y, width: 100 };
};
