const router = require("express").Router();
const { Category, validate } = require("../models/category");
const { Playlist } = require("../models/playlist");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

// Lấy tất cả categories
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find()
            .populate("playlists", "name description Image");
        res.status(200).send({ data: categories });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Lấy categories theo type
router.get("/type/:type", async (req, res) => {
    try {
        const categories = await Category.find({ type: req.params.type })
            .populate("playlists", "name description Image");
        res.status(200).send({ data: categories });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Lấy category theo ID
router.get("/:id", [validateObjectId], async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate("playlists", "name description Image");
        if (!category)
            return res.status(404).send({ message: "Category not found" });

        res.status(200).send({ data: category });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Tạo category mới (chỉ admin)
router.post("/", [auth, admin], async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const category = await Category(req.body).save();
        res.status(201).send({ data: category });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Thêm playlist vào category (chỉ admin)
router.put("/add/:id", [validateObjectId, auth, admin], async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category)
            return res.status(404).send({ message: "Category not found" });

        const playlist = await Playlist.findById(req.body.playlistId);
        if (!playlist)
            return res.status(404).send({ message: "Playlist not found" });

        if (category.playlists.indexOf(req.body.playlistId) === -1) {
            category.playlists.push(req.body.playlistId);
        }
        
        await category.save();
        res.status(200).send({ data: category });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Xóa playlist khỏi category (chỉ admin)
router.put("/remove/:id", [validateObjectId, auth, admin], async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category)
            return res.status(404).send({ message: "Category not found" });

        const index = category.playlists.indexOf(req.body.playlistId);
        if (index === -1)
            return res.status(404).send({ message: "Playlist not found in category" });
            
        category.playlists.splice(index, 1);
        await category.save();
        
        res.status(200).send({ data: category });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Cập nhật thông tin category (chỉ admin)
router.put("/:id", [validateObjectId, auth, admin], async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!category)
            return res.status(404).send({ message: "Category not found" });

        res.status(200).send({ data: category });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Xóa category (chỉ admin)
router.delete("/:id", [validateObjectId, auth, admin], async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category)
            return res.status(404).send({ message: "Category not found" });

        res.status(200).send({ message: "Category removed successfully" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;