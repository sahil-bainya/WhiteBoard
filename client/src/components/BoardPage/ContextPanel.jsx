import { useState } from "react";

export default function ContextPanel({ shape, onClose, onSave }) {
  const [notes, setNotes] = useState(shape.context?.notes || "");
  const [links, setLinks] = useState(shape.context?.links || []);
  const [code, setCode] = useState(shape.context?.code || "");
  const [newLink, setNewLink] = useState("");
  const HandleClose = () => {
    onSave({ ...shape, context: { notes, links, code } });
    onClose();
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
      <div className="tabs tabs-box w-100 gap-3 p-3!">
        <input
          type="radio"
          name="my_tabs_6"
          className="tab px-2!"
          aria-label="Notes"
        />
        <div className="tab-content bg-base-100 border-base-300 p-6!">
          <div>
            <label htmlFor="Notes">Notes</label>
            <textarea
              name="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write the notes here..."
            />
          </div>
        </div>

        <input
          type="radio"
          name="my_tabs_6"
          className="tab px-2!"
          aria-label="Link"
          defaultChecked
        />
        <div className="tab-content bg-base-100 border-base-300 p-6!">
          {links.map((link) => (
            <div key={link.id}>
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

        <input
          type="radio"
          name="my_tabs_6"
          className="tab px-2!"
          aria-label="Code"
        />
        <div className="tab-content bg-base-100 border-base-300 p-6!">
          <div>
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
      </div>
    </div>
  );
}
