import { useState } from "react";
import { X, Trash, Calendar } from "lucide-react";
import formatDate from "../../utils/formatDate";
export default function NotesPage({
  boardNotes,
  onDelete,
  addNotes,
  setNotesShowing,
}) {
  const [note, setNote] = useState("");
  const handleAddNote = async () => {
    const newNote = {
      id: crypto.randomUUID(),
      text: note,
      source: "manual",
      createdAt: new Date().toISOString(),
    };
    await addNotes(newNote);
    setNote("");
  };
  return (
    <div className="w-100">
      <h2>Notes</h2>
      <button onClick={() => setNotesShowing(false)}>
        <X />
      </button>
      {boardNotes.map((notes) => (
        <div className="card bg-base-100 w-full h-auto shadow-sm border p-4!" key={notes.id}>
          <div className="card-body">
            <p style={{ whiteSpace: "pre-wrap" }}>{notes.text}</p>
            
            <div className="card-actions justify-end ">
              <p className="text-base-content/60 text-xs! flex gap-2">
              <Calendar size={13}/>{formatDate(notes.createdAt)}
            </p>
              <button
                className="btn btn-square btn-sm"
                onClick={() => onDelete(notes.id)}
              >
                <Trash size={18} color="red"/>
              </button>
            </div>
          </div>
        </div>
      ))}
      <div>
        <textarea
          placeholder="type notes here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
        <button onClick={handleAddNote}>Add</button>
      </div>
    </div>
  );
}
