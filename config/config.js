//Token
process.env.CADUCIDAD_TOKEN = "48h";
//SEED DE AUTENTICACION
process.env.SEED = process.env.SEED || "eyJzYWRhZGFzZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9";

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
