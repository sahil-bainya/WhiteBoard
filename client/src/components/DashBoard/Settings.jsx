import { useSelector } from "react-redux";
import UpdateAvatar from "./UpdateAvatar";
import UpdateProfile from "./UpdateProfile";
import ChangePassword from "./ChangePassword";
import { useState } from "react";
import { Camera } from "lucide-react";

export default function Settings() {
  const user = useSelector((state) => state.auth.user);
  const [editingField, setEditingField] = useState(null);
  const [value, setValue] = useState("");

  const startEdit = (field, currentValue) => {
    setEditingField(field);
    setValue(currentValue);
  };
  const [showAvatarUpdate, setShowAvatarUpdate] = useState(false);
  const cancelEdit = () => {
    setEditingField(null);
    setValue("");
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
      <div className="card bg-base-100 shadow-xl w-full max-w-lg">
        <div className="card-body gap-6">
          {/* Header */}
          <h1 className="text-2xl font-bold">Settings</h1>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            {/* Avatar with camera icon */}
            <div className="relative w-16 h-16">
              {/* Avatar */}
              {user?.avatar ? (
                <div className="avatar">
                  <div className="w-16 rounded-xl">
                    <img src={user.avatar} alt="avatar" />
                  </div>
                </div>
              ) : (
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-xl w-16">
                    <span className="text-2xl">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}

              {/* Camera icon — avatar ke upar */}
              <button
                onClick={() => setShowAvatarUpdate(!showAvatarUpdate)}
                className="absolute bottom-0 right-0 bg-base-100 rounded-full p-1 shadow cursor-pointer hover:bg-base-200"
              >
                <Camera size={14} />
              </button>
            </div>

            {/* Name + Email */}
            <div>
              <p className="font-semibold text-lg">{user?.name}</p>
              <p className="text-sm text-base-content/60">{user?.email}</p>
            </div>
          </div>

          {/* UpdateAvatar — camera click pe show ho */}
          {showAvatarUpdate && (
            <UpdateAvatar onDone={() => setShowAvatarUpdate(false)} />
          )}

          <div className="divider my-0" />

          {/* Profile Section */}
          <div>
            <UpdateProfile />
          </div>

          <div className="divider my-0" />

          {/* Password Section */}
          <div>
            <h2 className="font-medium mb-4">Password</h2>
            <ChangePassword />
          </div>
        </div>
      </div>
    </div>
  );
}
