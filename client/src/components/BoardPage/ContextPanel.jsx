import { useState } from "react";

export default function ContextPanel({ shape, onClose, onSave }) {
  const [notes, setNotes] = useState(shape.context?.notes || "");
  const [links, setLinks] = useState(shape.context?.links || []);
  const [code, setCode] = useState(shape.context?.code || "");
  const [newLink, setNewLink] = useState("");
  const HandleClose = () => {
      onSave({ ...shape, context: { notes, links, code } });
      onclose();
  };
  const removeLink = (id) => {
    const updatedLinks = links.filter((link) => link.id !== id);
    setLinks(updatedLinks);
  };
  const inserLink = () => {
    if (!newLink.trim()) return;
    setLinks([...links, { id: crypto.randomUUID(), url: newLink }]);
    setNewLink("");
  };
  return (
    <div>
      <div>
        <h1>Context Pannel</h1>
        <button onClick={HandleClose}>X</button>
      </div>
      <div>
        <label htmlFor="Notes">Notes</label>
        <textarea
          name="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write the notes here..."
        />
      </div>
      <div>
        <h3>Links </h3>
        <hr />
        {links.map((link) => (
          <div key={link.id}>
            {/* target="_blank" <-- so that link will open in new tab
             rel="noreferrer" <-- so that new tab cannot access previous tab (for security purpose )*/}
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              style={{ color: "blue" }}
            >
              {link.url}
            </a>
            <br />
            <button onClick={() => removeLink(link.id)}>Delete</button>
          </div>
        ))}
        <input
          type="text"
          placeholder="paste link here"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
        />
        <button onClick={inserLink}>Insert</button>
      </div>
      <div>
        <h3>Code</h3>
        <label htmlFor="Code"></label>
        <textarea
          style={{ fontFamily: "monospace" }}
          name="Code"
          value={code}
          placeholder="Write code here"
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
    </div>
  );
}
