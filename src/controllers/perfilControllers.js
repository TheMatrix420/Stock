import {Perfil} from '../database/db'
import cloudinary from '../../lib/cloudinary'
import fs from 'fs'

async function updatePerdil(req,res){
    const {id} = req.params
    const {telefono,direccion} = req.body

    try {
        const perfil = await Perfil.findOne({
            attributes:['img'],
            where:{
                UserId:id
            }
        }) 

        if(!perfil){
            return res.status(404).json({ status:404, message:'Perfil no encontrado' })
        }
      
        if(!req.files || Object.keys(req.files).length === 0) { 
            const estado =await actualizar(id,telefono,direccion,perfil.img)
            removeTemp(req.files.img.tempFilePath)
            return res.json(estado)
        }

        const file=req.files.img
        console.log(file.mimetype)
        if(file.mimetype !== 'image/jpeg' && file.mimetype != 'image/jpg' ){
            return res.json({
                status:400,
                message:'formato no valido'
            })
        }

 
        const path = req.files.img.tempFilePath
        const urlSecure =await cloudinary.uploader(path)
        const estado=await actualizar(id,telefono,direccion,urlSecure.secure_url)
        removeTemp(path)
        const urldecode=perfil.img.split("/");
        const idImg1 = urldecode[urldecode.length-1];
        const idImg2 = urldecode[urldecode.length-2];
        const urldecode2=idImg1.split(".");
        const idImg3 = urldecode2[urldecode2.length-2];
        const del= await cloudinary.delet(`${idImg2}/${idImg3}`)
        console.log(`${idImg2}/${idImg3}`)
        console.log(del)
        return res.json(estado)
        
    } catch (error) {
        res.status(500).json({
            sstatus:500,
            error
        })    
    }
}

async function actualizar(id,telefono,direccion,url){
    try {
        const perfilEditado = await Perfil.update({telefono:telefono,direccion:direccion,img:url},
            {
                where:{
                    UserId:id
                }
            })
        if(!perfilEditado){
            return {
                status:404,
                message:'no se ha encontrado el perfil'
            }
        }

        return {
            status:200,
            message:'se ha actualizado correctamente'
        }
    } catch (error) {
        return {
            status:500,
            message:'error de servidor'
        }
    }
}

const removeTemp=(path)=>{
    fs.unlink(path,err=>{
        if(err) throw err;
    })
}

async function get(req,res){
    const {id} = req.params
    try {
        const perfil = await Perfil.findOne({
            attributes:['telefono','direccion','img'],
            where:{
                UserId:id
            }
        }) 

        if(!perfil){
            return res.json({
                status:404,
                message:'perfil no encontrado'
            })
        }

        res.json({
            status:200,
            perfil
        })
    } catch (error) {
        return {
            status:500,
            message:'error de servidor'
        }
    }
}

export default {
    updatePerdil,get
}