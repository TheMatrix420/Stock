module.exports = {
  username: "postgres",
  password: "fenix5769",
  database: "stock",
  host: "localhost",
  dialect: "postgres",
  seederStorage: "json",
  seederStoragePath: "sequelizeSeeds.json",
  migrationStorage: "json",
  migrationStoragePath: "sequelizeMigrate.json",
  define: {
    timestamps: false,
  },
};
