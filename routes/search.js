const router = require('express').Router();
const { Song, validate } = require('../models/song');
const auth = require('../middlewares/auth');
const {Playlist} = require('../models/playlist');

router.get("/", async (req, res) => {
const search = req.query.search; 
if (search !== "") {
const songs = await Song.find({name: { $regex: search, $options: 'i' }}).limit(10);
const playlists = await Playlist.find({name: { $regex: search, $options: 'i' }}).limit(10);
const result = { songs, playlists };
res.status(200).send({ data: result });
} else {
res.status(400).send("Invalid search query.");
}

});