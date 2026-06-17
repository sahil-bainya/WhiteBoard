import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { architectureAssist, messCleanup ,textToDiagram} from "../controllers/ai.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/assist").post(architectureAssist);
router.route("/cleanup").post(messCleanup);
router.route("/text-to-diagram").post(textToDiagram);

export default router;
