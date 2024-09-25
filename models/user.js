const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    gender: {
        type: String,
        required: true,
    },
    birthDate: {  // Sử dụng kiểu Date thay vì lưu riêng lẻ tháng, ngày, năm
        type: Date,
        required: true,
    },
    likedSongs: [{  // Giả sử bạn lưu ID của các bài hát dưới dạng ObjectId
        type: [String],
        default: []
    }],
    playlists: [{  // Giả sử bạn lưu ID của các playlist dưới dạng ObjectId
        type: [String],
        default: []
    }],
    isAdmin: {
        type: Boolean,
        default: false
    }
});

// Tạo phương thức để sinh JWT
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, name: this.name, isAdmin: this.isAdmin }, process.env.JWTPRIVATEKEY, { expiresIn: '1h' });
    return token;
}



const validate = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: passwordComplexity().required(),
        gender: Joi.string().valid("male", "female", "other").required(),
        birthDate: Joi.date().required(), // Validate cho trường birthDate
        
    });
    return schema.validate(user);
};
const User = mongoose.model('User', userSchema);
module.exports = { User, validate };
