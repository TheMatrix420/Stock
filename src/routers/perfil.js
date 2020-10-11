import {Router} from 'express'
import perfil from '../controllers/perfilControllers'

const router = Router()

router.put('/update/:id',perfil.updatePerdil)
router.get('/:id',perfil.get)

export default router