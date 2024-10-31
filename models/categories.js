const mongoose = require('mongoose');
const Joi = require("joi");
const objectId = mongoose.Schema.Types.ObjectId;

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
    },
    description: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
    },
    Image: {
        type: String,
        required: true,
    },
    playlists: [{
        type: objectId,
        ref: "Playlist",
    }],
    // Thêm trường để phân loại category
    type: {
        type: String,
        enum: ['trending', 'mood', 'genre', 'artist'],
        required: true
    }
});

const validate = (category) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(255).required(),
        description: Joi.string().min(1).max(255).required(),
        Image: Joi.string().required(),
        playlists: Joi.array().items(Joi.objectId()),
        type: Joi.string().valid('trending', 'mood', 'genre', 'artist').required()
    });
    return schema.validate(category);
};

const Category = mongoose.model("Category", categorySchema);

module.exports = {
    Category,
    validate
};