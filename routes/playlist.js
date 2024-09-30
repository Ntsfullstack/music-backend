const router = require('express').Router();
const { Playlist, validate } = require('../models/playlist');
const auth = require('../middlewares/auth');
const User = require('../models/user');
const admin = require('../middlewares/admin');
const validateObjectId = require('../middlewares/validObjectId');
const Joi = require('joi');
// create playlist

router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
     const user = await User.findById(req.user._id);
     const playlist = await Playlist({...req.body, user: user._id} ).save();
     user.playlists.push(playlist._id);
        await user.save();
        res.status(201).send({ data: playlist, message: "Playlist created successfully." });
});
//edit playlist by id
router.put("/edit:id", validateObjectId, async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(255).required(),
        description: Joi.string().min(3).max(255).required(),
        img: Joi.string().min(3).max(255).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const playlist = await Playlist.findById(req.params.id)
    if (!playlist) return res.status(404).send("Playlist not found.");
    const user = await User.findById(req.user._id);
    if (!user._id.equals(playlist.user)) return res.status(403).send("Access denied.");
    playlist.name = req.body.name;
    playlist.description = req.body.description;
    playlist.img = req.body.img;
    await playlist.save();
    res.status(200).send({data: playlist, message: "Playlist updated successfully."});
})
//add song to playlist
router.put("/addSong/:id", [auth, validateObjectId], async (req, res) => {
    const schema = Joi.object({
        playlistId: Joi.string().min(3).max(255).required(),
        songId: Joi.string().min(3).max(255).required(),

    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
   const user = await User.findById(req.user._id);
    const playlist = await Playlist.findById(req.body.playlistId);
    if (!user._id.equals(playlist.user)) return res.status(403).send("Access denied.");
    if (playlist.songs.indexOf(req.body.songId) === -1) {
        playlist.songs.push(req.body.songId);
        await playlist.save();
        res.status(200).send({ data: playlist, message: "Song added to playlist successfully." });
    }
});
//remove song from playlist
router.put("/removeSong/:id", [auth, validateObjectId], async (req, res) => {
    const schema = Joi.object({
        playlistId: Joi.string().min(3).max(255).required(),
        songId: Joi.string().min(3).max(255).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const user = await User.findById(req.user._id);
    const playlist = await Playlist.findById(req.body.playlistId);
    if (!user._id.equals(playlist.user)) 
        return res.status(403).send("Access denied.");
    const index = playlist.songs.indexOf(req.body.songId);
    playlist.songs.splice(index, 1);
    await playlist.save();
    res.status(200).send({ data: playlist, message: "Song removed from playlist successfully." });
});
//user favourite playlist
router.get("/favourite", auth, async (req, res) => {
    const user = await User.findById(req.user._id);
    const playlists = await Playlist.find({_id: user.playlists});
    res.status(200).send({ data: playlists });

});
//get random playlist
router.get("/random", async (req, res) => {
    const playlists = await Playlist.aggregate([{ $sample: { size: 1 } }]);
    res.status(200).send({ data: playlists });
});

// get playlist by id
router.get("/:id", validateObjectId, async (req, res) => {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).send("Playlist not found.");
    const songs = await Song.find({ _id: { $in: playlist.songs } });
    res.status(200).send({ data: playlist, songs });
});
//get all playlist
router.get("/", auth, async (req, res) => {
    const playlists = await Playlist.find();
    res.status(200).send({ data: playlists }); 
});

//delete playlist by id
router.delete("/:id", [auth, validateObjectId], async (req, res) => {
    const user = await User.findById(req.user._id);
    const playlist = await Playlist.findById(req.params.id);
    if (!user._id.equals(playlist.user)) return res.status(403).send("Access denied.");
    const index = user.playlists.indexOf(req.params.id);
    user.playlists.splice(index, 1);
    await user.save();
    await playlist.remove();
    res.status(200).send({ message: "Playlist deleted successfully." });
});


module.exports = router;