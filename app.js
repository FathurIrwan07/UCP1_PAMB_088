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

// Tambah pupuk
app.post("/pupuk/tambah", (req, res) => {
  const { nama_pupuk, jenis_pupuk, harga_pupuk, stok, tanggal_masuk } =
    req.body;
  db.query(
    "INSERT INTO pupuk SET ?",
    {
      nama_pupuk,
      jenis_pupuk,
      harga_pupuk,
      stok,
      tanggal_masuk,
    },
    (err) => {
      if (err) throw err;
      res.redirect("/pupuk");
    }
  );
});

// Halaman edit pupuk
app.get("/pupuk/edit/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM pupuk WHERE id_pupuk = ?", [id], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.render("edit_pupuk", { pupuk: results[0] }); // Kirim data pupuk ke halaman edit
    } else {
      res.redirect("/pupuk");
    }
  });
});

// Proses edit pupuk
app.post("/pupuk/edit/:id", (req, res) => {
  const id = req.params.id;
  const { nama_pupuk, jenis_pupuk, harga_pupuk, stok, tanggal_masuk } =
    req.body;
  db.query(
    "UPDATE pupuk SET nama_pupuk = ?, jenis_pupuk = ?, harga_pupuk = ?, stok = ?, tanggal_masuk = ? WHERE id_pupuk = ?",
    [nama_pupuk, jenis_pupuk, harga_pupuk, stok, tanggal_masuk, id],
    (err) => {
      if (err) throw err;
      res.redirect("/pupuk");
    }
  );
});

// Hapus pupuk
app.post("/pupuk/hapus/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM pupuk WHERE id_pupuk = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/pupuk");
  });
});
