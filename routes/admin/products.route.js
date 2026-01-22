const express = require('express');

const router = express.Router()
const multer = require("multer");
const storageMulter = require("../../helpers/storageMulter");
const upload = multer({ storage: storageMulter() });
const controller = require("../../controllers/admin/products.controller");
const validate = require("../../validates/admin/product.validate");
router.get('/', controller.index)
router.get('/trash', controller.trash);
router.patch('/change-status/:status/:id', controller.changeStatus)
router.patch('/change-multi', controller.changeMulti)
router.delete('/delete/:id', controller.deleteItem);
router.delete('/delete-forever/:id', controller.deleteForever);
router.patch('/recover-item/:id', controller.recoverItem);
router.get('/create', controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  validate.createPost,//ham trung gian ( la th B) B pass moi chay den A
  controller.createPost
);
router.get('/edit/:id', controller.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  controller.editPatch
);
router.get('/details/:id', controller.details);
// router.post("/details/:id", upload.single("thumbnail"), controller.editPost);
module.exports = router;