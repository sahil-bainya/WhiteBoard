import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "../../services/api";
import { setUser } from "../../store/authSlice";
import {Input,Button} from "../";
export default function UpdateAvatar({ onDone }) {  // ← onDone prop lo
  const dispatch = useDispatch();
  const { handleSubmit, register } = useForm();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("avatar", data.avatar[0]);
      const updatedUser = await api.patch("/user/avatar", formData);
      dispatch(setUser(updatedUser.data.data));
      onDone?.()  // ← success pe band karo
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(update)}>
        <Input type="file" label="Avatar" {...register("avatar")} />
        {error && <p>{error}</p>}
        <Button type="submit" loading={loading}>Update</Button>
      </form>
    </div>
  );
}