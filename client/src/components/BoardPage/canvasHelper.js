export const getShapeEdgePoint = (node, shape, targetX, targetY) => {
  if (!node) return { x: 0, y: 0 };

  // center nikalo
  let cx, cy;
  if (shape.type === "circle") {
    cx = node.x();
    cy = node.y();
  } else {
    cx =
      node.x() +
      (node.width() / 2) * Math.cos((node.rotation() * Math.PI) / 180) -
      (node.height() / 2) * Math.sin((node.rotation() * Math.PI) / 180);
    cy =
      node.y() +
      (node.width() / 2) * Math.sin((node.rotation() * Math.PI) / 180) +
      (node.height() / 2) * Math.cos((node.rotation() * Math.PI) / 180);
  }

  const angle = Math.atan2(targetY - cy, targetX - cx);

  if (shape.type === "circle") {
    return {
      x: cx + shape.radius * Math.cos(angle),
      y: cy + shape.radius * Math.sin(angle),
    };
  }

  if (shape.type === "rect") {
    const rotation = (node.rotation() * Math.PI) / 180;
    const hw = node.width() / 2;
    const hh = node.height() / 2;

    // local angle — rotation minus karo
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

    // local point ko global mein convert karo
    return {
      x: cx + lx * Math.cos(rotation) - ly * Math.sin(rotation),
      y: cy + lx * Math.sin(rotation) + ly * Math.cos(rotation),
    };
  }

  return { x: cx, y: cy };
};

export const getShapeCenter = (node, shape) => {
  if (!node || !shape) return { x: 0, y: 0 };
  if (shape.type === "circle") return { x: node.x(), y: node.y() };

  const rotation = (node.rotation() * Math.PI) / 180;
  const hw = node.width() / 2;
  const hh = node.height() / 2;

  return {
    x: node.x() + hw * Math.cos(rotation) - hh * Math.sin(rotation),
    y: node.y() + hw * Math.sin(rotation) + hh * Math.cos(rotation),
  };
};

export const getTextPosition = (shape) => {
  
  // Circle — x,y already center hai, radius se size milta hai
  if (shape.type === "circle") {
    return {
      x: shape.x - shape.radius,
      y: shape.y - 7,  // sirf vertical center adjust, fontSize/2 jaisa
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

  // Triangle — RegularPolygon, x,y center hai, radius se size
 if (shape.type === "triangle") {
  return {
    x: shape.x - shape.radius * 0.6,  // width thoda kam, taaki text triangle ke andar fit ho (upar se neeche tak chaudai badhti hai)
    y: shape.y + shape.radius * 0.01,  // thoda neeche shift, triangle ke visual lower-half ke center ke paas
    width: shape.radius * 1.2, 
    fontSize: Math.max(10, (shape.x - shape.radius * 0.6) * 0.25),
  };
}

  // Diamond aur Parallelogram — points array se bante hain, x,y unka "anchor point" hai (jahan se points relative hain)
  if (shape.type === "diamond" || shape.type === "parallelogram") {
    // points array se bounding box nikalo
    const xs = shape.points.filter((_, i) => i % 2 === 0);  // even indices = x values
    const ys = shape.points.filter((_, i) => i % 2 === 1);  // odd indices = y values
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const w = maxX - minX;
    
    return {
      x: shape.x + minX,
      y: shape.y + (minY + maxY) / 2 - 7,
      width: w,
      fontSize: Math.max(10, (shape.x + minX) * 0.25),
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
