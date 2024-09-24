const router = require('express').Router();
const {} = require('../models/user');
const bcrypt = require('bcrypt');

//create user
router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await User.findOne ({email: req.body.email});
    if (user) return res.status(400).send("User already registered.");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    }).save();
    newUser.password = undefined;
    newUser.__v = undefined;
    res.status(200).send({data: newUser, message: "User created successfully."});
}

)
