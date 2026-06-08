import api from "../../services/api.js";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearUser } from "../../store/authSlice.js";
import { useNavigate } from "react-router-dom";

export default function LogoutBtn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const logoutHandler = async () => {
    setLoading(true);
    try {
      await api.post("/user/logout");
      dispatch(clearUser());
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={logoutHandler} disabled={loading}>
        {loading ? "Logging out..." : "Logout"}
      </button>
      {error && <p>{error}</p>}
    </>
  );
}
