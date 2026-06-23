export default function Button({
  children, // text inside the button
  type = "button",
  loading, // when data is fetching from api then the user can not click on button again and again
  buttonType = "btn-soft",
  className ="btn px-2!",
  ...props
}) {
  return (
    <button
      disabled={loading}
      type={type}
      {...props}
      className={` ${buttonType} ${className}`}
    >
      {loading ? (
        <span className="loading loading-dots loading-md"></span>
      ) : (
        children
      )}
    </button>
  );
}
