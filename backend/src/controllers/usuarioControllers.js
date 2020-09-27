import {User} from '../database/db'


async function updateUser(req, res) {
    const {id} = req.params;
    const {first_name,last_name,email} = req.body;
    try {
        const userEditado = await User.findOne({
            attributes:['id','first_name','last_name','email'],
            where: {id}
        });

        if(!userEditado){
            return res.status(404).json({
                message:'usuario no encontrado'
            })
        }

        const user= await userEditado.update({first_name,last_name,email})
        
        res.json(userEditado);

    } catch (e) {
        res.status(500).json({
            data: {},
            e
        });
    }
}

async function activate(req,res){
    const {id}=req.params;
    try {

        const usuario = await User.findOne({
            where:{
                id
            }
        })

        if(!usuario){
            return res.status(404).json({
                message:'usuario no encontrado'
            })
        }

        const newUser= await usuario.update({
            estado:true
        })

        if(newUser){
            return res.status(200).json(newUser)
        }
        
    } catch (error) {
        res.status(500).json(error)
    }
        
}

async function unactivate(req,res){
    const {id}=req.params;
    try {

        const usuario = await User.findOne({
            where:{
                id
            }
        })

        if(!usuario){
            return res.status(404).json({
                message:'usuario no encontrado'
            })
        }

        const newUser= await usuario.update({
            estado:false
        })

        if(newUser){
            return res.status(200).json(newUser)
        }
        
    } catch (error) {
        res.status(500).json(error)
    }
        
}

async function getAll(req,res){
    try {
        const usuarios =await User.findAll({
            attributes:["id","first_name","last_name","email","estado"],
            where:{
                estado:true
            }
        })

        if(usuarios.length===0){
            return res.status(404).json({
                message:'no se encontraron usuarios'
            })
        }

        res.status(200).json(usuarios)
    } catch (error) {
        res.status(500).json(error)
    }
}

async function getId(req,res){
    const {id} =req.params
    try {
        const usuario =await User.findOne({
            attributes:["id","first_name","last_name","email","estado"],
            where:{
                id,
                estado:true
            }
        })

        if(!usuario){
            return res.status(404).json({
                message:'no se encontro el usuario'
            })
        }

        res.status(200).json(usuario)
    } catch (error) {
        res.status(500).json(error)
    }
}


export default {
 updateUser,activate,unactivate,getAll,getId
}