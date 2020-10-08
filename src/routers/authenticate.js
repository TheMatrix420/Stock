import { Router } from "express";
import authControllers from "../controllers/authControllers";

const router = Router();

router.post("/registro", authControllers.signUp);
router.post("/login", authControllers.signIn);
router.get('/confirmar/:token',authControllers.confirm);
router.get('/recuperar_contrasena',authControllers.emailPassword)
router.put('/restablecer_contrasena/:token',authControllers.resetPassword)

export default router;
