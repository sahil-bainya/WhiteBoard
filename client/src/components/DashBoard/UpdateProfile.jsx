import { useForm } from "react-hook-form";
import { Input, Button } from "../";
import { useState } from "react";
import api from "../../services/api";

export default function UpdateProfile() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const update = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.patch("/user/update", data);
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
          type="email"
          error={errors.email?.message}
          label="Email "
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            validate: {
              matchPattern: (value) =>
                /^\S+@\S+\.\S+$/.test(value) || "Email address must be valid",
            },
          })}
        />
        <Input
          type="text"
          label="name "
          placeholder="name"
          error={errors.name?.message}
          {...register("name", {
            required: "name is required",
          })}
        />
        {success && <p>Profile updated successfully!</p>}
        {error && <p>{error}</p>}
        <Button type="submit" children="Update" loading={loading} />
      </form>
    </div>
  );
}
