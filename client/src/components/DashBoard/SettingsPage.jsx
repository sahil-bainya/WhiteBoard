import { ChangePassword, UpdateAvatar, UpdateProfile } from "../";
export default function SettingsPage() {
  return (
    <div>
      <h1>Settings</h1>

      <section>
        <h2>Profile</h2>
        <UpdateProfile />
      </section>

      <section>
        <h2>Avatar</h2>
        <UpdateAvatar />
      </section>

      <section>
        <h2>Password</h2>
        <ChangePassword />
      </section>
    </div>
  );
}
