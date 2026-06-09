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
  const { shapes } = req.body;
  if (!shapes || shapes.length === 0) {
    throw new APIError(400, "Canvas is empty");
  }
  const prompt = `
You are a diagram layout expert.
Reorganize these shapes into a clean, readable flow diagram.

CURRENT SHAPES:
${JSON.stringify(shapes.map((s) => ({ id: s.id, type: s.type, label: s.text || s.type })))}

Layout Rules:
- Use a top-to-bottom flow layout
- Start first shape at x:100, y:80
- Minimum 120px horizontal gap between shapes
- Minimum 100px vertical gap between shapes
- Group related shapes in same row
- Maximum 3 shapes per row
- All shapes must be visible — no negative coordinates

Return ONLY this JSON, nothing else:
{
  "shapes": [
    { "id": "exact_same_id", "x": number, "y": number }
  ]
}
Every shape from input must appear in output with same id.
`;
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });
  const result = JSON.parse(response.choices[0].message.content);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Canvas cleaned successfully"));
});

export { architectureAssist, messCleanup };
