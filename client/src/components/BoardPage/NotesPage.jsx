import { useState } from "react";

export default function NotesPage({ boardNotes, onDelete, addNotes }) {
  const [note, setNote] = useState("");
  const handleAddNote = async () => {
    const newNote = {
      id: crypto.randomUUID(),
      text: note,
    };
    await addNotes(newNote);
    setNote("");
  };
  return (
    <div>
      <h2>Notes page -----</h2>
      {boardNotes.map((notes) => (
        <div key={notes.id}>
          <p style={{ whiteSpace: "pre-wrap" }}>{notes.text}</p>
          <button onClick={() => onDelete(notes.id)}>✕</button>
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
