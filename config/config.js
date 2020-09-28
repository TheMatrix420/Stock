// PUERTO
process.env.PORT = process.env.PORT || 4000;
//Token
process.env.CADUCIDAD_TOKEN = "48h";
//SEED DE AUTENTICACION
process.env.SEED =
  process.env.SEED ||
  "eyJzYWRhZGFzZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9";
//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

if (process.env.NODE_ENV === "dev") {
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
} else {
  module.exports = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "postgres",
    seederStorage: "json",
    seederStoragePath: "sequelizeSeeds.json",
    migrationStorage: "json",
    migrationStoragePath: "sequelizeMigrate.json",
    define: {
      timestamps: false,
    },
  };
}
