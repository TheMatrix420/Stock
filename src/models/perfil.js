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
        defaultValue: "no-image",
      },
      telefono: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {},
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {},
      },
    },
    {
      sequelize,
      modelName: "Perfil",
    }
  );
  return Perfil;
};
