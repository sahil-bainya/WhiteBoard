import { useForm } from "react-hook-form";
import { Input, Button } from "../";
import { useState } from "react";
import api from "../../services/api";

export default function UpdateAvatar() {
  const { handleSubmit, register } = useForm();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const update = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData(); // files should be send with form data
      formData.append("avatar", data.avatar[0]);
      await api.patch("/user/avatar", formData);
      setSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong while updating user avatar",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit(update)}>
        <Input type="file" label="Avatar " {...register("avatar")} />
        {success && <p>Avatar updated successfully!</p>}
        {error && <p>{error}</p>}
        <Button type="submit" children="Update" loading={loading} />
      </form>
    </div>
  );
}
