const router = require('express').Router();
const { User, validate } = require('../models/user');
const bcrypt = require('bcrypt');
router.post("/", async (req, res) => {
    const user = await User.findOne({ email
        : req.body.email });
        if (!user)
        return res.status(400).send("Invalid email or password.");
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword)
        return res.status(400).send("Invalid email or password.");
    const token = user.generateAuthToken();
    res.status(200).send({data:token, message:"Signing in please wait..."})
});
module.exports = router;