import { useId, forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, type = "text", error, classname = "", ...props },
  ref,
) {
  const id = useId();
  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        {...props}
        type={type}
        className={`${classname}`}
        ref={ref}
        id={id}
      ></input>
      {error && <span style={{ color: "red" }}>{error}</span>}
    </div>
  );
});

export default Input;
