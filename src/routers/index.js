import express from 'express'
import auth from './authenticate'
import user from './usuario'
import perfil from './perfil'
const app=express()

app.use('',auth)
app.use('/perfil',perfil)
app.use('/usuario',user)

export default app