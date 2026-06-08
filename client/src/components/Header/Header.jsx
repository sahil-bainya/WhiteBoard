import { Link } from "react-router-dom";
import LogoutBtn from "./LogoutButton.jsx";
import { useSelector } from "react-redux";
export default function Header() {
  const user = useSelector((state) => state.auth.user);
  return (
    <nav>
      <Link to="/dashboard">MyBoard</Link>
      {user ? (
        <div>
          {user.avatar && <img src={user.avatar} width={32} />}
          {user.name} &nbsp;
          <LogoutBtn />
        </div>
      ) : (
        <div>
          <Link to="/login">Login</Link>
           &nbsp;
          <Link to="/register">Register</Link>
        </div>
      )}
      <hr />
    </nav>
  );
}
