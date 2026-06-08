import { useForm } from "react-hook-form";
import { Input, Button } from "./";
import { useState } from "react";
import api from "../services/api.js";

export default function ChangePassword() {
  const { handleSubmit, register } = useForm();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const update = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.patch("/user/change-password", data);
      setSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong while updating user profile",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(update)}>
        <Input
          type="password"
          label="Old Password "
          placeholder="Old Password"
          {...register("oldPassword", {
            required: "Old Password is required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters",
            },
          })}
        />
        <Input
          type="password"
          label="New Password "
          placeholder="New Password"
          {...register("newPassword", {
            required: "New Password is required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters",
            },
          })}
        />
        {success && <p>Password updated successfully!</p>}
        {error && <p>{error}</p>}
        <Button type="submit" children="Update" loading={loading} />
      </form>
    </div>
  );
}
