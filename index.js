const express = require("express");
const dotevn = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./routes");

const app = express();
dotevn.config();
const PORT = process.env.PORT ?? 5000;
const DB_URI = process.env.DB_URI;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", router);

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("connected to Database!");
    app.listen(PORT, () => {
      console.log(`App is running on port: ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
