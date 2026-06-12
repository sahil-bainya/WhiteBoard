import { useSelector } from "react-redux";
import { UserRound } from "lucide-react";
import { AppName } from "../";
import Menubar from "./Menubar.jsx";
export default function Header() {
  const user = useSelector((state) => state.auth.user);
  return (
    <nav>
      <div className="navbar bg-base-100 shadow-sm h-16 px-4!">
        <div className="flex-1 pl-2!">
          <a className="btn btn-ghost text-lg font-semibold tracking-tight">
            <AppName />
          </a>
        </div>

        <div className="flex items-center pr-2!">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar hover:bg-base-200 transition-colors"
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden bg-base-200">
                {user?.avatar ? (
                  <img
                    src={`${user?.avatar}`}
                    alt="user photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserRound className="w-5 h-5 text-base-content/60" />
                )}
              </div>
            </div>

            <Menubar />
          </div>
        </div>
      </div>
    </nav>
  );
}
