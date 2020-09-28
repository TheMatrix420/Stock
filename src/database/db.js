import { Sequelize, DataTypes } from "sequelize";
import config from "../../config/config";

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

export const User = require("../models/user")(sequelize, DataTypes);
export const Perfil = require("../models/perfil")(sequelize, DataTypes);

const db = { User, Perfil };

User.associate(db);
Perfil.associate(db);

export default sequelize;
