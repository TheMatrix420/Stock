module.exports = {
  username: "postgres",
  password: "586vm5jm",
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
