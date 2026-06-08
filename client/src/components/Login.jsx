import { useForm } from "react-hook-form";
import { Input, Button } from "./";
import { useState } from "react";
import api from "../services/api.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice.js";
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const login = async (data) => {
    setLoading(true);
    try {
      setError("");
      const res = await api.post("/user/login", data);
      dispatch(setUser(res.data.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(login)}>
        <Input
          type="email"
          label="Email "
          placeholder="Email"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            validate: {
              matchPattern: (value) =>
                /^\S+@\S+\.\S+$/.test(value) || "Email address must be valid",
            },
          })}
        />
        <Input
          type="password"
          label="Password "
          placeholder="Password"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters",
            },
          })}
        />
        {error && <p>{error}</p>}
        <Button type="submit" children="Login" loading={loading} />
      </form>
    </div>
  );
}
