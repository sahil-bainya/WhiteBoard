import { useForm } from "react-hook-form";
import { Input, Button } from "./";
import { useState } from "react";
import api from "../services/api.js";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice.js";

export default function SignUp() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
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
      const res=await api.post("/user/register", formData);
      dispatch(setUser(res.data.data.user))
      navigate("/dashboard")
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(create)}>
        <Input
          type="text"
          label="Name "
          placeholder="Name"
          error={errors.name?.message}
          {...register("name", { required: "Name is required" })}
        />
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
        <Input
          type="file"
          label="Avatar "
          error={errors.avatar?.message}
          {...register("avatar")}
        />
        {error && <p>{error}</p>}
        <Button type="submit" children="Signup" loading={loading} />
      </form>
    </div>
  );
}
