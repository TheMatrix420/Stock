import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, Perfil } from "../database/db";
import nodemailer from "nodemailer";

async function signUp(req, res) {
  try {
    const newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    };

    if (newUser) {
      const tokenMail = jwt.sign(
        {
          newUser,
        },
        process.env.SEED,
        {
          expiresIn: "1d",
        }
      );

      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        auth: {
          user: "stockmatrix1@gmail.com",
          pass: "586vm5jm",
        },
      });

      const url = `${process.env.URL_BASE_FRONT}/ValidarCuenta/${tokenMail}`;

      const mail = {
        from: "stockmatrix1@gmail.com",
        to: `${newUser.email}`,
        subject: "Confirm Email",
        html: `Haga clic en este enlace para confirmar su correo electrónico: <a href="${url}">${url}</a>`,
      };

      transporter.sendMail(mail);

      res.json({
        status: 200,
        message: "Se ha enviado un correo de confirmacion",
        tokenMail: tokenMail,
      });
    }
  } catch (error) {
    res.json({
      status: 500,
      error,
      message: "error al enviar el email",
    });
  }
}

async function confirm(req, res) {
  try {
    const {
      newUser: { first_name, last_name, email, password },
    } = jwt.verify(req.params.token, process.env.SEED);

    const emailUser = await User.findOne({
      where: {
        email,
      },
    });

    if (emailUser) {
      return res.json({
        status: 400,
        message: "El correo ingresado ya se encuentra registrado",
      });
    }

    const usuario = await User.create(
      {
        first_name,
        last_name,
        email,
        password,
        Perfil: {},
      },
      {
        include: {
          model: Perfil,
          as: "Perfil",
        },
      }
    );

    if (!usuario) {
      return res.json({
        status: 400,
        message: "link invalido",
      });
    }

    res.json({
      status: 200,
      message: "correo confirmado",
    });
  } catch (err) {
    return res.json({ status: 401, err });
  }
}

async function signIn(req, res) {
  try {
    let { email, password } = req.body;
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

    let token = jwt.sign(
      {
        usuario: usuario,
      },
      process.env.SEED,
      {
        expiresIn: process.env.CADUCIDAD_TOKEN,
      }
    );

    res.json({
      status: 200,
      usuario: usuario,
      token,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Error al Iniciar Sesión",
      error,
    });
  }
}

async function facebook(req, res) {
  try {
    let { email, first_name,last_name} = req.body;
    const usuario = await User.findOne({
      where: {
        email,
      },
    });

    if (!usuario) {
      const newUser= await User.create(
        {
          first_name,
          last_name,
          email,
          password:':c',
          Perfil: {},
        },
        {
          include: {
            model: Perfil,
            as: "Perfil",
          },
        }
      );

      const usuario ={
        first_name:newUser.first_name,
        last_name:newUser.last_name,
        email:newUser.email
      }

      let token = jwt.sign({usuario:usuario,},process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN,});
  
      return res.json({
        status: 200,
        usuario: usuario,
        token,
      });
    }

    let token = jwt.sign({usuario: usuario,},process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN,});

    res.json({
      status: 200,
      usuario: usuario,
      token,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Error al Iniciar Sesión",
      error,
    });
  }
}

async function emailPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      attributes: ["id", "email"],
      where: {
        email,
        estado: true,
      },
    });

    if (!user) {
      return res.json({
        status: 404,
        message: "el correo no esta registrado",
      });
    }

    const id = user.id;
    const token = jwt.sign(
      {
        id,
      },
      process.env.SEED,
      {
        expiresIn: "1d",
      }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "stockmatrix1@gmail.com",
        pass: "586vm5jm",
      },
    });

    const url = `${process.env.URL_BASE}/${token}`;

    const mail = {
      from: "stockmatrix1@gmail.com",
      to: `${user.email}`,
      subject: "Cambiar contrseña",
      html: `Haga clic en este enlace para generar una nueva contraseña: <a href="${url}">Cambiar contraseña</a>`,
    };

    transporter.sendMail(mail);

    res.json({
      status: 200,
      message: "correo enviado",
    });
  } catch (error) {
    res.json({
      status: 500,
      message: "error en el servidor",
    });
  }
}

async function resetPassword(req, res) {
  try {
    const { id } = jwt.verify(req.params.token, process.env.SEED);
    const { password1, password2 } = req.body;
    const password = bcrypt.hashSync(password1, 10);

    if (password1.length <= 6) {
      return res.json({
        status: 400,
        message: "las contraseñas tienen que tener 6 caracteres o más",
      });
    }

    if (!bcrypt.compareSync(password2, password)) {
      return res.json({
        status: 400,
        message: "las contraseñas no coinciden",
      });
    }

    const changePass = await User.update(
      {
        password,
      },
      {
        where: {
          id,
        },
      }
    );

    if (!changePass) {
      return res.json({
        status: 404,
        message: "usuario no encontrado",
      });
    }

    res.json({
      status: 200,
      message: "se realizo el cambio de contraseña",
    });
  } catch (error) {
    res.json({
      status: 500,
      message: "error en el servidor",
    });
  }
}

export default {
  signUp,
  signIn,
  confirm,
  emailPassword,
  resetPassword,
  facebook,
};
