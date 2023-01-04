const fs = require("fs");
const path = require('path');
const express = require("express");
const tesseract = require("node-tesseract-ocr");
const multer = require("multer");
const app = express();
app.use(express.static(path.join(__dirname + "/uploads")));
app.set("view engine", "ejs");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });
app.get("/", (req, res) => {
  res.render("index", { data: "" });
});
app.post("/extractfromimage", upload.single("file"), (req, res) => {
  console.log(req.file.path);
  const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
  };
  tesseract
    .recognize(req.file.path, config)
    .then((text) => {
      console.log("result:", text);

      res.render("index", { data: text });
    })
    .catch((error) => {
      console.log(error.message);
    });
});
app.listen(5000, () => {
  console.log("app is running on 5000");
});
