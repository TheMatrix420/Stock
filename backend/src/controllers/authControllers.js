import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {User} from '../database/db'


async function signUp(req,res){
    
    try {
        const newUser= await User.create({
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            email:req.body.email,
            password: bcrypt.hashSync(req.body.password,10)
        })

        if(newUser){
            return res.status(200).json(newUser)
        }
        

    } catch (error) {
        res.status(500).json(error)
    }
        
}

export default {
    signUp
} 