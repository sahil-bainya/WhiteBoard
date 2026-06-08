export default function Button({
  children, // text inside the button
  type = "button",
  bgColor = "bg-blue-600",
  loading, // when data is fetching from api then the user can not click on button again and again
  textColor = "text-white",
  classname = "",
  ...props
}) {
  return (
    <button
      disabled={loading}
      className={`px-4 py-2 rounded-2xl ${bgColor} ${textColor} ${classname}`}
      type={type}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
