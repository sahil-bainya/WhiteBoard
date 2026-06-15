export default function Button({
  children, // text inside the button
  type = "button",
  loading, // when data is fetching from api then the user can not click on button again and again
  buttonType = "btn-soft",
  ...props
}) {
  return (
    <button
      disabled={loading}
      type={type}
      {...props}
      className={`btn ${buttonType} px-2!`}
    >
      {loading ? (
        <span className="loading loading-dots loading-md"></span>
      ) : (
        children
      )}
    </button>
  );
}
