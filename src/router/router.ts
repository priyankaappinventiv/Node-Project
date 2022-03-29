import express from "express";
import auth from "../middleware/auth";
import validateUser from "../middleware/validator";
const router = express.Router();

router.post("/register", validateUser, auth.register);
router.post("/login", auth.login);
router.post("/welcome", auth.verifyToken);
router.get("/getprofile", auth.getProfile);
router.post("/updateprofile", auth.updateProfile);
router.post("/deactivate", auth.deactivate);
router.post("/deactivate", auth.reactiveProfile);

export default router;
