import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function Protected({ children }) {
  const { status, loading } = useSelector((state) => state.auth);

  if (loading) return <p>Loading...</p>;
  if (!status) return <Navigate to="/login" />; // redirect to login without page render
  return children;
}
