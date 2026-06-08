import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createBoard,
  getAllBoards,
  getBoard,
  deleteBoard,
  updateTitle,
  updateCanvas,
} from "../controllers/board.controller.js";
const router = Router();

router.use(verifyJWT);
router.route("/").post(createBoard);
router.route("/").get(getAllBoards);
router.route("/:id").get(getBoard);
router.route("/:id").patch(updateTitle);
router.route("/:id").delete(deleteBoard);
router.route("/:id/canvas").patch(updateCanvas);
export default router;
