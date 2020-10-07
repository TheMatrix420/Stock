import { Router } from "express";
import authControllers from "../controllers/authControllers";

const router = Router();

router.post("/registro", authControllers.signUp);
router.post("/login", authControllers.signIn);
router.get('/confirmar/:token',authControllers.confirm);
router.get('/recuperar_contrasena',authControllers.emailPassword)
router.get('/cambiar_contrasena/:token',authControllers.changePassword)
router.put('/restablecer_contrasena',authControllers.resetPassword)
export default router;
