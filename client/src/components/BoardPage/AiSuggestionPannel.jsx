import {
  CircleAlert,
  TriangleAlert,
  Lightbulb,
  Wrench,
  Pin,
  X,
  Brain,
} from "lucide-react";
import { useState } from "react";

export default function AiSuggestionPanel({
  suggestions,
  summary,
  diagramType,
  onClose,
  onAddToNotes,
}) {
  const icons = {
    error: <CircleAlert color="#ef4444" />,
    missing: <TriangleAlert color="#f59e0b" />,
    improvement: <Wrench color="#3b82f6" />,
    recommendation: <Lightbulb color="#8b5cf6" />,
    algorithm: <Lightbulb />,
    other: <Pin color="#6b7280" />,
  };
  const [added, setAdded] = useState(false);
  const handleAddToNotes = async () => {
    setAdded(true);
    await onAddToNotes();
    setTimeout(() => {
      setAdded(false);
    }, 3000);
  };
  return (
    <div>
      <div>
        <div>
          <Brain />
          <h3>AI Suggestions</h3>
        </div>
        <button onClick={onClose}>
          <X />
        </button>
      </div>
      {diagramType && (
        <p>
          Detected: <strong>{diagramType}</strong>
        </p>
      )}
      {summary && <p>{summary}</p>}

      <div>
        {suggestions && suggestions.length > 0 ? (
          suggestions.map((suggestion, idx) => (
            <div key={idx}>
              <div>
                {icons[suggestion.type] || icons.other}{" "}
                {suggestion.type.toUpperCase()}
                <h4>{suggestion.title}</h4>
              </div>
              <p>{suggestion.message}</p>
            </div>
          ))
        ) : (
          <p>No suggestions found.</p>
        )}

        <button onClick={handleAddToNotes} disabled={added}>
          {added ? "Added" : "+ Add to Notes"}
        </button>
      </div>
    </div>
  );
}
