import express from "express";
import Users from ".././model/userModel.js";
import db from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import auth from ".././middleware/auth.js";
import path from "path";
import fs from "fs";
import { loginValidation, registerValidation, updateProfileValidation } from "./validation/userValidation.js";
//
import like_log from ".././model/like_logModel.js";
import quans from ".././model/quansModel.js";
import tag_quans from ".././model/tag_quansModel.js";
import tag from ".././model/tagModel.js";
import user from ".././model/userModel.js";

let router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // cb(null, file.fieldname + "-" + uniqueSuffix);
    const uniqueSuffix = path.parse(file.originalname).name + Date.now() + path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    await db.authenticate();
    await quans.sync();
    await like_log.sync();
    await tag.sync();
    await tag_quans.sync();
    await user.sync();
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.log(error);
  }
});

router.get("/myAccount", async (req, res) => {
  const id = req.query.id;
  const find = await Users.findAll({
    where: {
      id: id,
    },
    attributes: ["name", "email", "job", "image_profile", "createdAt"],
  });
  res.json(find);
});

router.put("/myAccount", async (req, res) => {
  const { name, email, job } = req.body;
  await Users.update(
    { name: name, email: email, job: job },
    {
      where: {
        id: 8, //ini tar ganti jadi id yang bener dari token
      },
    }
  )
    .then((result) => {
      return 1;
    })
    .catch((err) => {
      return res.status(404).json({ msg: "gagal" });
    });
});

router.post("/login", loginValidation, async (req, res) => {
  try {
    const find = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });
    // return console.log(find);
    if (!find) {
      return res.status(400).json({ msg: "email tidak terdaftar" });
    }

    const cek_pass = await bcrypt.compare(req.body.password, find[0].password);

    if (!cek_pass) {
      return res.status(400).json({ msg: "password salah" });
    }
    const userId = find[0].id;
    let token = jwt.sign({ iduser: find[0].id, name: find[0].name, email: find[0].email }, process.env.token, { expiresIn: "15s" });
    let refreshToken = jwt.sign({ iduser: find[0].id, name: find[0].name, email: find[0].email }, process.env.refreshToken, { expiresIn: "24h" });
    await Users.update(
      { refreshtoken: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 100,
      secure: false,
      // secure: true, jika https
    });
    res.json({ token });
  } catch (error) {
    return res.status(400).json({ msg: "email tidak ditemukan" });
  }
});

router.post("/register", registerValidation, async (req, res) => {
  if (req.body.confirmpass !== req.body.password) {
    return res.status(400).json({ msg: "password dan confirm password tidak cocok" });
  }

  let find = null;

  try {
    find = await Users.findAll({
      where: {
        email: req.body.email,
      },
    });

    if (find.length > 0) {
      return res.status(400).json({ msg: "email telah terpakai, coba daftar dengan email lain" });
    }

    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(req.body.password, salt);

    const insert = await Users.create({ name: req.body.name, job: req.body.job, email: req.body.email, password: hash });

    return res.json(insert);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
  // console.log("User's auto-generated ID:", insert);
});

router.delete("/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(204).json({ msg: "refresh token tidak valid" });
  }
  const user = await Users.findAll({
    where: {
      refreshtoken: refreshToken,
    },
  });
  if (!user[0]) {
    return res.status(204).json({ msg: "tidak terdapat data user" });
  }

  const userId = user[0].id;
  await Users.update(
    { refreshtoken: null },
    {
      where: {
        id: userId,
      },
    }
  );

  res.clearCookie("refreshToken");
  return res.json({ msg: "berhasil logout" });
});

router.get("/profile", async (req, res) => {
  try {
    const id = req.query.id;
    const get = await Users.findAll({
      where: { id: id },
    });
    return res.json(get);
  } catch (error) {
    return res.status(404).json({ msg: error });
  }
});

router.put("/profile", upload.single("image"), updateProfileValidation, async (req, res) => {
  try {
    const { id, name, email, job } = req.body;

    let update = false;
    if (req.file) {
      let findDataUser = await Users.findAll({ where: { id: id } });
      if (!findDataUser) {
        return res.status(404).json({ msg: "data user tidak ditemukan" });
      }

      let checkFileExist = fs.readFile(`./public/uploads/${findDataUser[0].image_profile}`, (err) => {
        if (err) {
          return err;
        }
        fs.unlink(`./public/uploads/${findDataUser[0].image_profile}`, function (err) {
          if (err) {
            return err;
          }
          return true;
        });
      });

      let imageUrl = req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;
      update = await Users.update({ name: name, email: email, job: job, image_profile: req.file.filename }, { where: { id: id } });
    } else {
      console.log("else data");
      update = await Users.update({ name: name, email: email, job: job }, { where: { id: id } });
    }
    const getUserData = await Users.findAll({
      where: { id: id },
      attributes: ["name", "email", "job", "image_profile", "createdAt"],
    });
    res.json({ msg: update, data: getUserData });
  } catch (err) {
    return res.status(404).json({ msg: err.message });
  }
});

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    let imageUrl = req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;
    res.json({ status: "success", image: imageUrl });
  } catch (error) {
    return res.status(404).json({ msg: error });
  }
});

export default router;
