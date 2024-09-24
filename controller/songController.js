const Song = require('../models/song');
const AWS = require('aws-sdk');
const multer = require('multer');

const s3 = new AWS.S3({
  accessKeyId: 'your-access-key',
  secretAccessKey: 'your-secret-key',
  region: 'your-region',
});

const upload = multer();

const uploadFileToS3 = async (file) => {
  const params = {
    Bucket: 'your-s3-bucket-name',
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  return s3.upload(params).promise();
};

exports.uploadSong = async (req, res) => {
  try {
    const file = req.file;
    const s3Response = await uploadFileToS3(file);

    const song = new Song({
      title: req.body.title,
      artist: req.body.artist,
      genre: req.body.genre,
      s3Url: s3Response.Location,
    });

    await song.save();
    res.status(200).json(song);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading song', error });
  }
};

exports.getSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching songs', error });
  }
};
