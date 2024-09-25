const router = require('express').Router();
const { User, validate } = require('../models/user'); // Ensure validate is imported
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const validateObjectId = require('../middlewares/validObjectId');

// Create user
router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    // Check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) return res.status(400).send("User already registered.");
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    // Create new user
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        gender: req.body.gender, // Ensure this field is populated
        birthDate: req.body.birthDate, // Ensure this field is populated
    });

    try {
        await newUser.save();
        newUser.password = undefined; // Don't send password back
        res.status(201).send({ data: newUser, message: "User created successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error.");
    }
});
//get all usser
router.get("/", async (req, res) => {
    const users = await User.find().select("-password-_v");
    res.status(200).send({data: users});
});
//get user by id
router.get("/:id", validateObjectId, async (req, res) => {
    const user = await User.findById(req.params.id).select("-password-_v");
    if (!user) return res.status(404).send("User not found.");
    res.status(200).send({data: user});
});
//update user by id
router.put("/:id", [auth, validateObjectId], async (req, res) => {
   const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body,
        },
        { new: true }
  
   ).select("-password-_v");
   res.status(200).send({data: user});
    
});
//delete user by id
router.delete("/:id", [admin, validateObjectId], async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "User deleted successfully." });
});

module.exports = router;
