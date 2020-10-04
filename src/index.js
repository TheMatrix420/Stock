import express from "express";
import morgan from "morgan";
import cors from "cors";
import router from "./routers/index";
import sequelize from "./database/db";
require("@babel/polyfill");
require("../config/config");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

app.listen(process.env.PORT, () => {
  console.log(`Se esta escuchando el puerto ${process.env.PORT}`);
  sequelize.sync({ force: false }).then(() => {
    console.log("se establecion la conexion con la bd");
  });
});
