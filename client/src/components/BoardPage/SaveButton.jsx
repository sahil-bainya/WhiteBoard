import { useState } from "react";
import { Button } from "../";
export default function SaveButton({ saveBoard, arrows }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const HandleSave = async () => {
    setLoading(true);
    setError("");
    try {
      await saveBoard(arrows);
    } catch (err) {
      setError(err?.response?.data?.message || "Not saved");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Button onClick={HandleSave} loading={loading} children="save"  ></Button>
      {error && <p>{error}</p>}
    </div>
  );
}
