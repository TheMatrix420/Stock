import { Router } from "express";
import user from "../controllers/usuarioControllers";
import auth from "../middleware/authentication";

const router = Router();

// router.put('/update/:id',auth.verificaToken,user.updateUser)
// router.put('/unactivate/:id',user.unactivate)
// router.put('/activate/:id',user.activate)

export default router;
