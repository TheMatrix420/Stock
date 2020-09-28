"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Perfil extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Perfil.belongsTo(models.User);
    }
  }
  Perfil.init(
    {
      img: {
        type: DataTypes.STRING,
      },
      telefono: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "El telefono es obligatorio",
          },
          isInt: {
            args: true,
            msg: "Debe contener solo números",
          },
          min: {
            args: 9,
            msg: "El telefono tiene que ser de 9 digitos",
          },
        },
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "La direccion es obligatoria",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Perfil",
    }
  );
  return Perfil;
};
