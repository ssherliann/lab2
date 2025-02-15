import express, { json } from "express";
import session from "express-session";
import router from "./routes/index.js";
import sequelize from "./config/db.js";

const app = express();

app.use(json());

app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(router);

sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => console.error("Error connecting to the database", err));
