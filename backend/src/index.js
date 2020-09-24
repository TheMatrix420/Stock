import express, { json } from "express";
import morgan from "morgan";
import router from "./routers/index";
import sequelize from "./database/db";

const app = express();

app.use(morgan("dev"));
app.use(json());
app.use(express.urlencoded({ extended: false }));
// app.use(router)

app.listen(4000, () => {
  console.log("Se esta escuchando el puerto 4000");
  sequelize.sync({ force: true }).then(() => {
    console.log("se establecion la conexion con la bd");
  });
});
