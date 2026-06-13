import { useSelector } from "react-redux";
export default function Avatar() {
  const user = useSelector((state) => state.auth.user);
  return (
    <div className="avatar">
      <div className="w-24 rounded-xl">
        {user?.avatar ? <img src={user.avatar} /> : <p>avatr</p>}
      </div>
    </div>
  );
}
