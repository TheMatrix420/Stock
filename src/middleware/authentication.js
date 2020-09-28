import jwt from "jsonwebtoken";

async function verificaToken(req, res, next) {
  let token = req.get("token");

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token no válido",
        },
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
}

async function verificaAdminRole(req, res, next) {
  let usuario = req.usuario;

  if (usuario.role === "admin_role") {
    next();
  } else {
    return res.json({
      ok: false,
      err: {
        message: "El usuario no es administrador",
      },
    });
  }
}

export default {
  verificaToken,
  verificaAdminRole,
};
