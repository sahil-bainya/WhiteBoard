// utils/toast.js
import toast from "react-hot-toast";
import { X, Check, CircleX } from "lucide-react";

export const notify = {
  success: (message) =>
    toast(
      (t) => (
        <div className="flex items-center gap-5 bg-green-50 border border-green-200 rounded-lg px-2! py-1/2! shadow-sm w-full max-w-sm">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-100 shrink-0">
            <Check size={14} color="#16a34a" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-medium text-green-900 flex-1">
            {message}
          </span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-green-400 hover:text-green-600 hover:bg-green-100 rounded p-0.5 transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ),
      {
        duration: 2000,
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
          border: "none",
        },
      },
    ),
  welcome: (message) =>
    toast(
      () => (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4! py-2! shadow-sm w-full max-w-sm">
          <span className="text-sm font-medium text-blue-900 flex-1 whitespace-nowrap">
            👋 {message}!
          </span>
        </div>
      ),
      {
        duration: 1500,
        id: message,
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
          border: "none",
        },
      },
    ),
  error: (message) =>
    toast(
      (t) => (
        <div className="flex items-center gap-5 bg-red-50 border border-red-200 rounded-lg px-2! py-1/2! shadow-sm w-full max-w-sm">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-red-100 shrink-0">
            <CircleX size={14} color="#FF0000" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-medium text-red-900 flex-1">
            {message}
          </span>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-red-400 hover:text-red-600 hover:bg-red-100 rounded p-0.5 transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ),
      {
        duration: 2000,
        style: {
          background: "transparent",
          boxShadow: "none",
          padding: 0,
          border: "none",
        },
      },
    ),
};
