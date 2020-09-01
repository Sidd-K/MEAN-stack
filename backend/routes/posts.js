const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts');
const checkAuth = require('../middleware/check-auth');
const fileExtract = require('../middleware/fileMulter');

router.post("", checkAuth, fileExtract, postController.creatPost);
router.put("/:id", checkAuth, fileExtract, postController.updatePost);
router.get("/:id", postController.getPost);
router.get("", postController.getAllPost);
router.delete('/:id', checkAuth,postController.deletePost);

module.exports = router;


