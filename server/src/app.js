import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import main from "./config/groq.js";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // optional
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRoutes from "./routes/user.route.js";
import boardRoutes from "./routes/board.route.js";
app.use("/api/user", userRoutes);
app.use("/api/boards", boardRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  return res.status(statusCode).json({
    statusCode,
    message,
    success: false,
  });
});
main();
export default app;
