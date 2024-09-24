
const express = require('express');
const { uploadSong, getSongs } = require('../controllers/songController');
const multer = require('multer');
const upload = multer(); // Dùng để upload file

const router = express.Router();

router.post('/upload', upload.single('file'), uploadSong); // Route tải nhạc lên
router.get('/songs', getSongs); // Route lấy danh sách bài hát

module.exports = router;
