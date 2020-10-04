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
      return res.status(404).json({
        message:'el  usuario no esta registrado'
      })
    }

    if(usuario.estado===true){
      return res.status(400).json({
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
      return res.status(404).json({
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
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario o Contraseña incorrecta",
        },
      });
    }


    if (!bcrypt.compareSync(password, usuario.password)) {
      return res.status(400).json({
        ok: false,
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
      ok: true,
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

export default {
  signUp,
  signIn,
  confirm
};