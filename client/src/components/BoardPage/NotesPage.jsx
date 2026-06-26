import { useState } from "react";
import { X, Trash } from "lucide-react";
import formatDate from "../../utils/formatDate";

const getGroupTitle = (dateString) => {
  const date = new Date(dateString);
  const dateOnly = date.toLocaleDateString();
  const today = new Date().toLocaleDateString();
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();

  if (dateOnly === today) return "Today";
  if (dateOnly === yesterday) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export default function NotesPage({
  boardNotes,
  onDelete,
  addNotes,
  setNotesShowing,
}) {
  const [note, setNote] = useState("");
  const [added, setAdded] = useState(false);

  const handleAddNote = async () => {
    if (!note.trim()) return;
    setAdded(true);
    const newNote = {
      id: crypto.randomUUID(),
      text: note,
      source: "manual",
      createdAt: new Date().toISOString(),
    };
    await addNotes(newNote);
    setNote("");
    setTimeout(() => {
      setAdded(false);
    }, 3000);
  };

  const groupedNotes = boardNotes.reduce((groups, n) => {
    const dateKey = new Date(n.createdAt).toLocaleDateString();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(n);
    return groups;
  }, {});

  return (
    
    <div className="w-full flex flex-col gap-3 p-4! bg-base-100 h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Notes</h2>
        <button
          className="btn btn-sm btn-ghost btn-circle"
          onClick={() => setNotesShowing(false)}
        >
          <X size={18} />
        </button>
      </div>
      <div className="divider " />

      {/* Empty state */}
      {boardNotes.length === 0 && (
        <p className="text-sm text-base-content/50 text-center py-8">
          No notes yet — AI suggestions and manual notes will appear here.
        </p>
      )}

      {/* Grouped notes */}
      <div className="flex flex-col gap-2 overflow-y-auto flex-1">
        {Object.entries(groupedNotes).map(([dateKey, notesInGroup]) => (
          <div
            className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-lg  px-2! py-1! "
            key={dateKey}
          >
            <input
              type="checkbox"
              defaultChecked={dateKey === new Date().toLocaleDateString()}
            />
            <div className="collapse-title text-md font-semibold gap-2 flex items-center ">
              {getGroupTitle(notesInGroup[0].createdAt)}
              <span className="text-xs text-base-content/40 ml-2">
                ({notesInGroup.length})
              </span>
            </div>

            <div className="collapse-content flex flex-col gap-2 ">
              {notesInGroup.map((n) => (
                <div
                  key={n.id}
                  className="card bg-base-200 shadow-sm p-2! mt-2! "
                >
                  {n.source === "AI" && (
                    <div className="badge badge-soft badge-info self-start mb-1! px-1! text-xs">
                      AI generated
                    </div>
                  )}
                  <p style={{ whiteSpace: "pre-wrap" }} className="text-md">
                    {n.text}
                  </p>
                  <div className="flex  items-end justify-between">
                    <span className="text-xs text-base-content/50">
                      {formatDate(n.createdAt)}
                    </span>
                    <button
                      className="btn btn-square btn-sm btn-ghost"
                      onClick={() => onDelete(n.id)}
                    >
                      <Trash size={14} className="text-error" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add note */}
      <div className="flex flex-col gap-2 mt-2 ">
        <textarea
          className="textarea textarea-bordered text-sm p-1! resize-none w-full"
          placeholder="Type your note here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          className="btn btn-soft btn-success btn-sm self-end px-2! mb-2! mr-2! rounded-2xl"
          onClick={handleAddNote}
        >
          {added ? "Note added!" : " + Add Note"}
        </button>
      </div>
    </div>
  );
}
