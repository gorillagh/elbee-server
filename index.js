const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const { readdirSync } = require("fs");
require("dotenv").config();

//App
const app = express();
const port = process.env.PORT || 8000;

//Connect to db
mongoose
  .connect(process.env.DATABASE, {
    keepAlive: true,
  })
  .then(() => {
    console.log("Db Connection Succesful");
  })
  .catch((error) =>
    console.log(`Connection Error! ${error.message}, Error Code: ${error.code}`)
  );

//Middlewares
// app.use((req, res, next) => {
//   req.header("Access-Control-Allow-Origin", "*");
//   next();
// });
const allowCors = (fn) => async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

const handler = (req, res) => {
  const d = new Date();
  res.end(d.toString());
};
app.use(allowCors(handler));

app.use(morgan("tiny"));
// app.use(cors());
app.use(express.json({ limit: "2mb" })); //Used to parse JSON bodies
app.use(express.urlencoded({ limit: "2mb", extended: true })); //Parse URL-encoded bodies

//Routes Middleware
readdirSync("./routes").map((r) => app.use("/api", require("./routes/" + r)));

app.listen(port, () => {
  console.log(`Elbee server is running at http://localhost:${port}`);
});
