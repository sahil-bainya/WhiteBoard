import { useEffect } from "react";
import api from "../services/api.js";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addBoard, removeBoard, setBoards,updateBoard } from "../store/boardSlice.js";

export default function Dashboard() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boards = useSelector((state) => state.board.boards);
  const user = useSelector((state) => state.auth.user);
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const boardResponse = await api.get("/boards");
        dispatch(setBoards(boardResponse.data.data.boards));
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Something went wrong while fetching details",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [dispatch]);

  const handleCreate = async () => {
    try {
      const res = await api.post("/boards", { title: "Untitled Board" });
      dispatch(addBoard(res.data.data.board));
      navigate(`/board/${res.data.data.board._id}`);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong while creating board",
      );
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // <-- to stop the event bubbling , otherwise it goes to the parent also
    try {
      await api.delete(`/boards/${id}`);
      dispatch(removeBoard(id));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong while deleting board",
      );
    }
  };

  const saveTitle = async (id) => {
    try {
      await api.patch(`/boards/${id}`, { title: editingTitle || "Untitled Board"});
      dispatch(updateBoard({ id, title: editingTitle }));
      
    } catch (err) {
      setError(err?.response?.data?.message || "Title update failed");
    } finally {
      setEditingBoardId(null);
    }
  };
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <h2>Welcome , {user?.name}</h2>
      <hr />
      {error && <p>{error}</p>}
      <hr />
      <br />
      <br />
      <button onClick={handleCreate}>+ New Board</button>
      <hr />
      <br />
      <br />
      {boards.length > 0 ? (
        boards.map((board) => (
          <div key={board._id} onClick={() => navigate(`/board/${board._id}`)}>
            {editingBoardId === board._id ? (
              <input
                autoFocus
                value={editingTitle}
                 onClick={(e) => e.stopPropagation()} 
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={() => saveTitle(board._id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    saveTitle(board._id);
                    setEditingBoardId(null);
                  }
                  if (e.key === "Escape") setEditingBoardId(null); // ✅ changes discard
                }}
              />
            ) : (
              <h3>{board.title}</h3>
            )}
            <p>{new Date(board.createdAt).toLocaleDateString()}</p>
            <button onClick={(e) => handleDelete(e, board._id)}>Delete</button>
            <br />
            <br />
            <button onClick={(e) => { e.stopPropagation(); setEditingTitle(board.title);setEditingBoardId(board._id)}}>Edit</button>
            <br />
            <br />
          </div>
        ))
      ) : (
        <p>Koi board nahi — naya banao</p>
      )}
    </div>
  );
}
