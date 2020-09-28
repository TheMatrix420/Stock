import express from 'express'
import auth from './authenticate'
import user from './usuario'
const app=express()

app.use('',auth)
app.use('/usuario',user)

export default app