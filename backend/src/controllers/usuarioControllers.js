import {User} from '../database/db'


async function updateUser(req, res) {
    const {id} = req.params;
    const {first_name,last_name,email} = req.body;
    try {
        const userEditado = await User.findAll({
            attributes:['id','first_name','last_name','email'],
            where: {id}
        });

        if (userEditado.length > 0) {
            userEditado.forEach(async User => {
                await User.update({first_name,last_name,email});
            });

        }else{
            return res.status(400).json({
                ok:false,
                message:'no se encontro el usuario'
            })
        }
        res.json(userEditado);
    } catch (e) {
        res.status(500).json({
            data: {},
            e
        });
    }
}

function unactivate(req,res){
    const {id} = req.params

    User.findOne({
        attributes:["estado"],
        where:{
            id
        }
    }).then((result)=>{
            result.update({
                estado:true
            })

        res.status(200).json(result)
    }).catch(err=>{
        return res.status(400).json({
            ok:false,
            err
        })
    });
  
}

function activate(req,res){
    const {id} = req.params

    User.findOne({
        attributes:["estado"],
        where:{
            id
        }
    }).then((result)=>{
            result.update({
                estado:true
            })

        res.status(200).json(result)
    }).catch(err=>{
        return res.status(400).json({
            ok:false,
            err
        })
    });
  
}

export default {
    unactivate,activate,updateUser
}