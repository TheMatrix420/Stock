import {Router} from 'express'
import authControllers from '../controllers/authControllers'

const router=Router()

router.post('/registro',authControllers.signUp)

export default router