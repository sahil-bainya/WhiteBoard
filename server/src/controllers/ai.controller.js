import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import groq from "../config/groq.js";
import { APIError } from "groq-sdk";

const architectureAssist = asyncHandler(async (req, res) => {
  const { shapes, arrows } = req.body;
  if (!shapes || shapes.length === 0) {
    throw new ApiError(400, "Canvas is empty");
  }
  const diagramDescription = shapes
    .map((shape) => {
      return `${shape.type} at (${shape.x}, ${shape.y}) — label: "${shape.text || shape.type}"`;
    })
    .join("\n");

  const connectionDescription = arrows
    .map((arrow) => {
      const from = shapes.find((s) => s.id === arrow.from);
      const to = shapes.find((s) => s.id === arrow.to);
      return `"${from?.text || from?.type}" connects to "${to?.text || to?.type}"`;
    })
    .join("\n");

  const prompt = `
You are an expert diagram analyzer and software architect.
Analyze the following diagram and first identify what type it is, then provide relevant suggestions.

COMPONENTS:
${diagramDescription}

CONNECTIONS:
${connectionDescription.length > 0 ? connectionDescription : "No connections defined yet"}

STEP 1 — Detect diagram type:
- flowchart → if it shows a process or algorithm flow
- architecture → if it shows system components, services, databases
- mind_map → if it shows ideas branching from a center
- er_diagram → if it shows database entities and relations
- general → if it does not fit any specific type

STEP 2 — Based on detected type, provide:

If FLOWCHART:
- Write the algorithm this flowchart represents
- Find logical errors or missing steps
- Suggest improvements to the flow

If ARCHITECTURE:
- Missing components (load balancer, cache, gateway)
- Database recommendations
- Scaling and performance issues
- Security concerns

If ER_DIAGRAM:
- Missing relationships
- Normalization issues
- Index recommendations

If MIND_MAP:
- Missing branches or concepts
- Better organization suggestions

If GENERAL:
- Explain what the diagram represents
- Find any errors or inconsistencies
- Suggest improvements

Rules:
- Be specific — reference actual component names
- Maximum 6 suggestions
- No generic advice

Return ONLY this JSON, nothing else:
{
  "diagram_type": "flowchart|architecture|er_diagram|mind_map|general",
  "summary": "one line — what this diagram represents",
  "suggestions": [
    {
      "type": "error|improvement|missing|algorithm|recommendation",
      "title": "short title",
      "message": "detailed actionable suggestion"
    }
  ]
}
`;
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });
  if (!response) {
    throw new ApiError(500, "Groq Error");
  }
  const result = JSON.parse(response.choices[0].message.content);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Suggestions generated"));
});

const messCleanup = asyncHandler(async (req, res) => {
  const { shapes, arrows } = req.body;
  if (!shapes || shapes.length === 0) {
    throw new APIError(400, "Canvas is empty");
  }

  const prompt = `
You are a diagram analysis expert.
Analyze these shapes and return their logical relationships.

SHAPES:
${JSON.stringify(shapes.map((s) => ({ id: s.id, label: s.text || s.type })))}

EXISTING CONNECTIONS:
${JSON.stringify(
  arrows.map((a) => {
    const from = shapes.find((s) => s.id === a.from);
    const to = shapes.find((s) => s.id === a.to);
    return {
      from: a.from,
      fromLabel: from?.text || from?.type,
      to: a.to,
      toLabel: to?.text || to?.type,
    };
  }),
)}

Rules:
- Keep ALL existing connections
- Add missing logical relationships if any
- Only use ids from the shapes list above
- Do not create connections to non-existent shapes

Return ONLY this JSON, nothing else:
{
  "nodes": [{ "id": "exact_shape_id", "label": "shape_label" }],
  "edges": [{ "from": "exact_id", "to": "exact_id" }]
}
Total nodes must be exactly ${shapes.length}.
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });
  if (!response) {
    throw new ApiError(500, "Groq error");
  }
  const result = JSON.parse(response.choices[0].message.content);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Logical relations indentified"));
});

const textToDiagram = asyncHandler(async (req, res) => {
  const { description } = req.body;
  if (!description || description.trim().length === 0) {
    throw new ApiError(400, "Description is required");
  }
  const prompt = `
You are an expert at converting natural language descriptions into structured diagrams.

USER DESCRIPTION:
"${description}"

Your task:
1. Identify all distinct components, entities, or steps mentioned
2. Identify the relationships or flow between them
3. Convert this into shapes and arrows that can be rendered on a canvas

RULES:
- Each component becomes a "rect" shape with appropriate width based on text length (estimate: text length * 9 + 40, minimum 120)
- Use consistent height of 70 for all rect shapes
- Arrange shapes in a logical flow — left-to-right for processes, top-to-bottom for hierarchies
- Space shapes at least 180px apart horizontally and 140px apart vertically
- Start first shape at x:100, y:100
- Every relationship mentioned becomes an arrow connecting two shapes by their ids
- Use sequential numeric strings as ids: "1", "2", "3"...
- If the description implies a decision or branching (if/else, success/failure), create multiple arrows from one shape
- Keep shape labels short and clear — max 3-4 words, extracted from the description, not verbatim copied
- Do not invent components that were not mentioned or clearly implied
- If the description is ambiguous, make the most reasonable interpretation a software engineer would make

Return ONLY this JSON, nothing else:
{
  "shapes": [
    {
      "id": "1",
      "type": "rect",
      "x": number,
      "y": number,
      "width": number,
      "height": 70,
      "text": "short label",
      "fill": "#ffffff",
      "stroke": "#000000"
    }
  ],
  "arrows": [
    {
      "id": "a1",
      "from": "1",
      "to": "2"
    }
  ]
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });
  if (!response) {
    throw new ApiError(500, "Groq error");
  }
  const result = JSON.parse(response.choices[0].message.content);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Diagram generated successfully"));
});

export { architectureAssist, messCleanup, textToDiagram };
