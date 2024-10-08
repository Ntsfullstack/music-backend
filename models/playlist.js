const mongoose = require('mongoose');
const Joi = require("joi");
const objectId = mongoose.Schema.Types.ObjectId;
const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
    },
    user: {
        type: objectId,
        ref: "User",
        required: true,
    },
    songs: [{
        type: objectId,
        ref: "Song",
    }],
    description : { 
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
    }, 
    Image: {
        type: String,
        required: true,
    },
});
    const validate = (playlist) => {
        const schema = Joi.object({
            name: Joi.string().min(1).max(255).required(),
            user: Joi.objectId().required(),
            songs: Joi.array().items(Joi.objectId()),
            description: Joi.string().min(1).max(255).required(),
            Image: Joi.string().required(),
        });
        return schema.validate(playlist);
    }
    const Playlist = mongoose.model("Playlist", playlistSchema);
    module.exports = {
        Playlist,
        validate
    };
