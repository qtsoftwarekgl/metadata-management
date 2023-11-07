const express = require('express');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const router = express.Router();
const Controller = require("./controller");
const controller = new Controller();

router
  .route("/")
  .post(
    multer({ storage: storage }).single('dump'),
    controller.upload.bind(controller)
  );

router
  .route("/find-dump")
  .get(
    controller.findDump.bind(controller)
  );

router
  .route("/file-download")
  .get(
    controller.fileDownload.bind(controller)
  );

router
  .route("/acknowledgement")
  .post(
    controller.acknowledgement.bind(controller)
  );

router
  .route("/acknowledgement-list")
  .get(
    controller.acknowledgementList.bind(controller)
  )

router
  .route("/list")
  .get(
    controller.fileList.bind(controller)
  )

router
  .route("/update/:id")
  .put(
    controller.update.bind(controller)
  )

router
  .route("/latest-version")
  .get(
    controller.latestVersion.bind(controller)
  )

module.exports = router;