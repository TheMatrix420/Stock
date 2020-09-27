"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Perfil);
    }
  }

  let rolesValidos = {
    values: ["admin_role", "user_role"],
    message: "{VALUE} no es un rol válido",
  };

  User.init(
    {
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "El primer nombre es obligatorio",
          },
          isAlpha: {
            args: true,
            msg: "El primer nombre solo puede contener letras",
          },
          len: {
            args: [2, 50],
            msg: "El primer nombre tiene que ser entre 2 y 50 caracteres",
          },
        },
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "El segundo nombre es obligatorio",
          },
          isAlpha: {
            args: true,
            msg: "El segundo nombre solo puede contener letras",
          },
          len: {
            args: [2, 50],
            msg: "El segundo nombre tiene que ser entre 2 y 50 caracteres",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "El email es obligatorio",
          },
          isEmail: {
            args: true,
            msg: "El correo debe ser válido",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "El password es obligatorio",
          }
        },
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "user_role",
        enum: rolesValidos,
      },
      estado: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      google: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
