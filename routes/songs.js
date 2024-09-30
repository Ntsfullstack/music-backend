const router = require('express').Router();
const { Song, validate } = require('../models/song');
const auth = require('../middlewares/auth');
const User = require('../models/user');
const admin = require('../middlewares/admin');
const validateObjectId = require('../middlewares/validObjectId');
// create song
router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const song = await Song(req.body).save();
    res.status(201).send({ data: song, message: "Song created successfully." });
});
//get all song
router.get("/", async (req, res) => {
    const songs = await Song.find();
    res.status(200).send({ data: songs });
});

//update song

router.put("/:id", [auth, validateObjectId], async (req, res) => {
    const song = await Song.findByIdAndUpdate(
        req.params.id,
        {
            $set: req.body,
        },
        { new: true }
    );
    if (!song) return res.status(404).send("Song not found.");
    res.status(200).send({ data: song, message: "Song updated successfully." });   
});
//delete song
router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).send("Song not found.");
    res.status(200).send({ data: song, message: "Song deleted successfully." });
});
//like song
router.put("/like/:id", [auth, validateObjectId], async (req, res) => {
    let resMessage = "";
    const song = await Song.findById(req.params.id);
   if (!song) return res.status(404).send("Song not found.");
   const user = await User.findById(req.user._id);
   const index = user.likedSongs.indexOf(req.params.id);
   if (index === -1) {
    user.likedSongs.push(song._id);
    resMessage = "Song liked successfully.";
   } else {
    user.likedSongs.splice(index, 1);
    resMessage = "Song unliked successfully.";
   }
   res.status(200).send({ data: song, message: resMessage });
});
//get all liked songs
router.get("/liked", auth, async (req, res) => {
    const user = await User.findById(req.user._id).populate("likedSongs");
    const songs = await Song.find({ _id: { $in: user.likedSongs } });
    res.status(200).send({ data: songs });
}
);
module.exports = router;


