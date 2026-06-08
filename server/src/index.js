import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import app from "./app.js";
import connectDB from "./db/index.js";
const PORT = process.env.PORT ;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.log("Mongodb connection failed ", err);
  });
