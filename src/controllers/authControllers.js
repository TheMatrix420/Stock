import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {User} from "../database/db";
import nodemailer from 'nodemailer'

async function signUp(req, res) {
  try {
    const newUser = await User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    if (newUser) {
      const tokenMail = jwt.sign({
          newUser
        },
        process.env.SEED, {
          expiresIn: "1d"
        }
      )

      const transporter = nodemailer.createTransport(({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: 'stockmatrix1@gmail.com',
          pass: '586vm5jm'
        }
      }));

      const url = `${process.env.URL_BASE}/api/confirmar/${tokenMail}`;

      const mail = {
        from: 'stockmatrix1@gmail.com',
        to: `${newUser.email}`,
        subject: 'Confirm Email',
        html: `Haga clic en este enlace para confirmar su correo electrónico: <a href="${url}">${url}</a>`,
      }

      transporter.sendMail(mail);

      res.json({
        user: newUser
      })
    }

  } catch (error) {
    res.status(500).json({
      error,
      message: 'error al enviar el email'
    });
  }
}

async function confirm(req, res) {
  try {
    const {
      newUser: {
        id
      }
    } = jwt.verify(req.params.token, process.env.SEED);

    const usuario = await User.findOne({
      where: {
        id
      },
    });

    if(!usuario){
      return res.json({
        status:404,
        message:'el  usuario no esta registrado'
      })
    }

    if(usuario.estado===true){
      return res.json({
        status: 400,
        message:'el usuario ya se encuentra activo'
      })
    }

    const updateUser = await usuario.update({
      estado: true
    }, {
      where: {
        id
      }
    });

    if (!updateUser) {
      return res.json({
        status:404,
        message: 'usuario no encontrado'
      })
    }

    res.json({
      message: 'correo confirmado'
    })

  } catch (err) {
    return res.status(401).json(err);
  }

}

async function signIn(req, res) {
  try {
    let {
      email,
      password
    } = req.body;
    const usuario = await User.findOne({
      where: {
        email,
        estado: true,
      },
    });

    if (!usuario) {
      return res.json({
        status: 400,
        err: {
          message: "Usuario o Contraseña incorrecta",
        },
      });
    }


    if (!bcrypt.compareSync(password, usuario.password)) {
      return res.json({
        status: 400,
        err: {
          message: "Usuario o Contraseña incorrecta",
        },
      });
    }

    let token = jwt.sign({
        usuario: usuario,
      },
      process.env.SEED, {
        expiresIn: process.env.CADUCIDAD_TOKEN
      }
    );

    res.json({
      status: 200,
      usuario: usuario,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al Iniciar Sesión",
      error,
    });
  }
}

async function emailPassword(req,res){
  try {
    const {email} = req.body

    const user = await User.findOne({
      attributes:['id','email'],
      where:{
        email,
        estado:true
      }
    })

    if(!user){
      return res.status(404).json({
        message:'el correo no esta registrado'
      })
    }
    
    const id=user.id
    const token = jwt.sign({
        id
      },
      process.env.SEED, {
        expiresIn: "1d"
      }
    )

    const transporter = nodemailer.createTransport(({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: 'stockmatrix1@gmail.com',
        pass: '586vm5jm'
      }
    }));

    const url = `${process.env.URL_BASE}/api/cambiar_contrasena/${token}`;

    const mail = {
      from: 'stockmatrix1@gmail.com',
      to: `${user.email}`,
      subject: 'Cambiar contrseña',
      html: `Haga clic en este enlace para generar una nueva contraseña: <a href="${url}">Cambiar contraseña</a>`,
    }

    transporter.sendMail(mail);

    res.json({
      message:'correo enviado'
    })
  

  } catch (error) {
    res.status(500).json({
      message:'error en el servidor'
    })
  }
}

async function changePassword(req,res){
  try {
    const { id }= jwt.verify(req.params.token,process.env.SEED)

    const user = await User.findOne({
      attributes:['email'],
      where:{
        id,
        estado:true
      }
    })

    if(!user){
      return res.status(404).json({
        message:'usuario no encontrado'
      })
    }

    res.json(user)

  } catch (error) {
    res.status(500).json({
      message:'error en el servidor'
    })
  }
}

async function resetPassword(req,res){
  try {
    const {email,password1,password2}=req.body
    const password= bcrypt.hashSync(password1,10)
    
    if(password1.length<=6){
      return res.status(400).json({
        message:'las contraseñas tienen que tener 6 caracteres o más'
      })
    }

    if (!bcrypt.compareSync(password2, password)) {
      return res.status(400).json({
          message: "las contraseñas no coinciden",
      });
    }
    
    const changePass = await User.update({
      password
    },{
      where:{
        email
      }
    })
  
    if(!changePass){
      return res.status(404).json({
        message:'usuario no encontrado'
      })
    }
  
    res.json({
      message:'se realizo el cambio de contraseña'
    })
  
  } catch (error) {
    res.status(500).json({
      message:'error en el servidor'
    })
  }
}

export default {
  signUp,
  signIn,
  confirm,
  emailPassword,
  changePassword,
  resetPassword
};