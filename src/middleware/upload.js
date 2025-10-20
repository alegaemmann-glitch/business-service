// middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure subfolders exist
const baseUploadDir = "uploads";
const logoDir = path.join(baseUploadDir, "logo");
const productsDir = path.join(baseUploadDir, "products");

[baseUploadDir, logoDir, productsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "logo") {
      cb(null, logoDir);
    } else if (file.fieldname === "productImage") {
      cb(null, productsDir);
    } else {
      cb(new Error("Unknown field name"));
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({ storage });
