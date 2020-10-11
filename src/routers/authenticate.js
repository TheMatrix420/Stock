import { Router } from "express";
import auth from "../controllers/authControllers";

const router = Router();

router.post("/registro", auth.signUp);
router.post("/login", auth.signIn);
router.get('/confirmar/:token',auth.confirm);
router.get('/recuperar_contrasena',auth.emailPassword)
router.put('/restablecer_contrasena/:token',auth.resetPassword)

export default router;
