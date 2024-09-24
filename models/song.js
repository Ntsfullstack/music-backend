const mongoose = require('mongoose');
const Joi = require("joi");

// Định nghĩa schema cho Song
const SongSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
  },
  singer: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
  },
  song: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
  },
  img: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
});

// Hàm validate với Joi
const validateSong = (song) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    singer: Joi.string().min(1).max(255).required(),
    song: Joi.string().min(1).max(255).required(),
    img: Joi.string().required(),
    duration: Joi.number().required(),
  });

  return schema.validate(song); // Trả về kết quả validate
};
const Song = mongoose.model("Song", SongSchema);
module.exports = {
  Song,
  validateSong
};
