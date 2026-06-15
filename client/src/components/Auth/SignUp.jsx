import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice";
import "./authStyle.css";
import { notify } from "../../utils/toast.jsx";
export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const create = async (data) => {
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      if (data.avatar[0]) {
        formData.append("avatar", data.avatar[0]);
      }
      const res = await api.post("/user/register", formData);
      dispatch(setUser(res.data.data.user));
      notify.welcome(`Welcome ${res.data.data.user.name}!`);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form-inner" onSubmit={handleSubmit(create)}>
      <h1>Create Account</h1>
      <div className="auth-divider" />

      <div className="auth-input-group">
        <label>Name</label>
        <input
          type="text"
          placeholder="Your full name"
          {...register("name", { required: "Name is required" })}
        />
        <span className="auth-input-error">{errors.name?.message}</span>
      </div>

      <div className="auth-input-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          {...register("email", {
            required: "Email is required",
            validate: {
              matchPattern: (value) =>
                /^\S+@\S+\.\S+$/.test(value) || "Email address must be valid",
            },
          })}
        />
        <span className="auth-input-error">{errors.email?.message}</span>
      </div>

      <div className="auth-input-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters",
            },
          })}
        />
        <span className="auth-input-error">{errors.password?.message}</span>
      </div>

      <div className="auth-input-group">
        <label>Avatar <span style={{ color: '#bbb', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
        <input
          type="file"
          accept="image/*"
          {...register("avatar")}
        />
        <span className="auth-input-error">{errors.avatar?.message}</span>
      </div>

      {error && <div className="auth-error-box">{error}</div>}

      <button className="auth-submit-btn" type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}