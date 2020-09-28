import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../database/db";

async function signUp(req, res) {
  try {
    const newUser = await User.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    if (newUser) {
      return res.status(200).json(newUser);
    }
  } catch (error) {
    res.status(500).json(error);
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

    let token = jwt.sign(
      {
        usuario: usuario,
      },
      process.env.SEED,
      { expiresIn: process.env.CADUCIDAD_TOKEN }
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
};
