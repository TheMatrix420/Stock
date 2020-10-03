import { Router } from "express";
import authControllers from "../controllers/authControllers";

const router = Router();

router.post("/registro", authControllers.signUp);
router.post("/login", authControllers.signIn);
router.get('/confirmar/:token',authControllers.confirm);

export default router;
