const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

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

app.post("/pupuk/hapus/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM pupuk WHERE id_pupuk = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/pupuk");
  });
});

app.post("/bibit/tambah", (req, res) => {
  const { nama_bibit, jenis_tanaman, harga_bibit, stok, tanggal_masuk } =
    req.body;
  db.query(
    "INSERT INTO bibit SET ?",
    { nama_bibit, jenis_tanaman, harga_bibit, stok, tanggal_masuk },
    (err) => {
      if (err) {
        console.log("Error adding seedling:", err);
        return res.status(500).send("Failed to add seedling.");
      }
      res.redirect("/bibit");
    }
  );
});

app.get("/bibit/edit/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM bibit WHERE id_bibit = ?", [id], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.render("edit_bibit", { bibit: results[0] });
    } else {
      res.redirect("/bibit");
    }
  });
});

app.post("/bibit/edit/:id", (req, res) => {
  const id = req.params.id;
  const { nama_bibit, jenis_tanaman, harga_bibit, stok, tanggal_masuk } =
    req.body;
  db.query(
    "UPDATE bibit_tanaman SET nama_bibit = ?, jenis_tanaman = ?, harga_bibit = ?, stok = ?, tanggal_masuk = ? WHERE id_bibit = ?",
    [nama_bibit, jenis_tanaman, harga_bibit, stok, tanggal_masuk, id],
    (err) => {
      if (err) throw err;
      res.redirect("/bibit");
    }
  );
});

app.post("/bibit/hapus/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM bibit_tanaman WHERE id_bibit = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/bibit");
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
