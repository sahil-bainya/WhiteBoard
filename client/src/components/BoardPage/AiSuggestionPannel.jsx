import {
  CircleAlert,
  TriangleAlert,
  Lightbulb,
  Wrench,
  Pin,
  X,
  Brain,
  FilePlusCorner,
} from "lucide-react";
import { useState } from "react";

export default function AiSuggestionPanel({
  suggestions,
  summary,
  diagramType,
  onClose,
  onAddToNotes,
  loading,
}) {
  const icons = {
    error: <CircleAlert size={16} className="text-error" />,
    missing: <TriangleAlert size={16} className="text-warning" />,
    improvement: <Wrench size={16} className="text-info" />,
    recommendation: <Lightbulb size={16} className="text-primary" />,
    algorithm: <Lightbulb size={16} className="text-primary" />,
    other: <Pin size={16} className="text-base-content/50" />,
  };

  const [added, setAdded] = useState(false);

  const handleAddToNotes = async () => {
    setAdded(true);
    await onAddToNotes();
    setTimeout(() => setAdded(false), 3000);
  };

  return loading ? (
    <div className=" z-50 absolute left-4 top-20 w-[90vw] max-w-sm max-h-[70vh] bg-base-100 rounded-xl shadow-xl flex flex-col gap-4">
      <div className="skeleton h-20 w-full rounded-lg"></div>
      <div className="skeleton h-20 w-full rounded-lg"></div>
      <div className="skeleton h-20 w-full rounded-lg"></div>
      <div className="skeleton h-20 w-full rounded-lg"></div>
      <div className="skeleton h-20 w-full rounded-lg mt-2!"></div>
    </div>
  ) : (
    <div className="border border-base-300 z-50 absolute left-4 top-20 w-[90vw] max-w-sm max-h-[70vh] bg-base-100 rounded-xl shadow-xl flex flex-col px-3! pt-3!">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <Brain size={18} className="text-primary" />
          </div>
          <h3 className="text-lg font-bold">AI Suggestions</h3>
        </div>
        <button className="btn btn-sm btn-ghost btn-circle" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="divider my-0" />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-3">
        {/* Detected type + summary */}
        {(diagramType || summary) && (
          <div className="text-sm text-base-content/70">
            {diagramType && (
              <p>
                Detected:{" "}
                <span className="font-semibold capitalize">
                  {diagramType} diagram
                </span>
              </p>
            )}
            {summary && <p className="mt-1">{summary}</p>}
          </div>
        )}

        {/* Suggestions */}
        {suggestions && suggestions.length > 0 ? (
          suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className="card bg-primary/5 border border-primary/20 p-2!"
            >
              <div className="flex items-center gap-2 mb-2! justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {suggestion.title || suggestion.type}
                </span>
                <div className="flex items-center gap-1 mt-2">
                  {icons[suggestion.type] || icons.other}
                  <span className="text-xs text-base-content/50 capitalize">
                    {suggestion.type}
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-base-content/90">
                {suggestion.message}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-base-content/50 text-center py-8 mb-3!">
            No suggestions found.
          </p>
        )}
      </div>

      {/* Add to notes — fixed bottom */}
      {suggestions && suggestions.length > 0 && (
        <div className="m-3!">
          <button
            className="btn btn-primary btn-soft w-auto gap-2  rounded-2xl px-2!"
            onClick={handleAddToNotes}
            disabled={added}
          >
            <FilePlusCorner size={14} />
            {added ? "Added" : "Add to Notes"}
          </button>
        </div>
      )}
    </div>
  );
}
