import { Link } from "react-router-dom";
import LogoutBtn from "./LogoutButton";
import { useSelector } from "react-redux";
export default function Menubar() {
  const user = useSelector((state) => state.auth.user);
  return (
    <ul
      tabIndex={-1}
      className="menu menu-sm dropdown-content bg-base-100 rounded-xl z-10 mt-2 w-52 shadow-lg border border-base-200 p-2!"
    >
      <li className="menu-title text-xs font-medium text-base-content/50 uppercase tracking-wider px-3! py-2!">
        {user?.name}
      </li>

      <div className="divider my-0.5 mx-2" />

      <li>
        <Link to="/dashboard" className="rounded-lg px-4! py-2.5!">
          Dashboard
        </Link>
      </li>
      <li>
        <Link to="/settings" className="rounded-lg px-4! py-2.5!">
          Settings
        </Link>
      </li>

      <div className="divider my-0.5 mx-2" />

      <li className="px-1!">
        <LogoutBtn />
      </li>
    </ul>
  );
}
