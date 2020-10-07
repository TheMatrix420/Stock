import { User } from "../database/db";

async function updateUser(req, res) {
  const { id } = req.params;
  const { first_name, last_name, email } = req.body;
  try {
    const userEditado = await User.findOne({
      attributes: ["id", "first_name", "last_name", "email"],
      where: { id, estado: true },
    });

    if (!userEditado) {
      return res.json({
        status: 404,
        message: "usuario no encontrado",
      });
    }

    const user = await userEditado.update({ first_name, last_name, email });

    res.json(userEditado);
  } catch (e) {
    res.json({
      status: 500,
      data: {},
      e,
    });
  }
}

async function activate(req, res) {
  const { id } = req.params;
  try {
    const usuario = await User.findOne({
      where: {
        id,
        estado: false,
      },
    });

    if (!usuario) {
      return res.json({
        status: 404,
        message: "usuario no encontrado",
      });
    }

    const newUser = await usuario.update({
      estado: true,
    });

    if (newUser) {
      return res.json({ status: 200, newUser });
    }
  } catch (error) {
    res.json({ status: 500, error });
  }
}

async function unactivate(req, res) {
  const { id } = req.params;
  try {
    const usuario = await User.findOne({
      where: {
        id,
        estado: true,
      },
    });

    if (!usuario) {
      return res.json({
        status: 404,
        message: "usuario no encontrado",
      });
    }

    const newUser = await usuario.update({
      estado: false,
    });

    if (newUser) {
      return res.json({ status: 200, newUser });
    }
  } catch (error) {
    res.json({ status: 500, error });
  }
}

async function getAll(req, res) {
  try {
    const usuarios = await User.findAll({
      attributes: ["id", "first_name", "last_name", "email", "estado"],
      where: {
        estado: true,
      },
    });

    if (usuarios.length === 0) {
      return res.json({
        status: 404,
        message: "no se encontraron usuarios",
      });
    }

    res.json({ status: 200, usuarios });
  } catch (error) {
    res.json({ status: 500, error });
  }
}

async function getId(req, res) {
  const { id } = req.params;
  try {
    const usuario = await User.findOne({
      attributes: ["id", "first_name", "last_name", "email", "estado"],
      where: {
        id,
        estado: true,
      },
    });

    if (!usuario) {
      return res.json({
        status: 404,
        message: "no se encontro el usuario",
      });
    }

    res.json({ status: 200, usuario });
  } catch (error) {
    res.json({ status: 500, error });
  }
}

export default {
  updateUser,
  activate,
  unactivate,
  getAll,
  getId,
};
