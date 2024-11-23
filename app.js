const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Koneksi ke database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pertanian",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/pupuk", (req, res) => {
  db.query("SELECT * FROM pupuk", (err, results) => {
    if (err) throw err;
    res.render("pupuk", { pupuk: results });
  });
});

app.get("/bibit", (req, res) => {
  db.query("SELECT * FROM bibit", (err, results) => {
    if (err) throw err;
    res.render("bibit", { bibit: results });
  });
});
