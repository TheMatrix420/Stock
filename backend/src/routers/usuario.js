import { Router } from "express";
import user from "../controllers/usuarioControllers";
import auth from "../middleware/authentication";

const router = Router();

router.put('/update/:id',auth.verificaToken,auth.verificaAdminRole,user.updateUser)
router.put('/unactivate/:id',auth.verificaToken,auth.verificaAdminRole,user.unactivate)
router.put('/activate/:id',auth.verificaToken,auth.verificaAdminRole,user.activate)
router.get('/get',auth.verificaToken,auth.verificaAdminRole,user.getAll)
router.get('/get/:id',auth.verificaToken,user.getId)


export default router;
