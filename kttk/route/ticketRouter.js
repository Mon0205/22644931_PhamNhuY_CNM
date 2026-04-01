const express = require("express");
const router = express.Router();
const controller = require("../controller/ticketControler");

const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3 } = require("../config/aws");

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    }
  })
});

router.get("/", controller.index);
router.get("/create", controller.createForm);
router.post("/create", upload.single("image"), controller.create);

router.get("/detail/:ticketId", controller.detail);

router.get("/edit/:ticketId", controller.editForm);
router.post("/edit/:ticketId", upload.single("image"), controller.update);

router.get("/delete/:ticketId", controller.delete);

module.exports = router;