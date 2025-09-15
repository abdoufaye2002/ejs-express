const express = require("express")
const router = express.Router()

const albumController = require("../controllers/album.controller")

router.get("/albums/create",albumController.createAlbumForm)
router.post("/albums/create",albumController.createAlbum)

router.get("/albums",albumController.albums)
router.get("/albums/:id",albumController.album)
router.post("/albums/:id/images",albumController.addImage)

router.get("/albums/:id/delete",albumController.deleteAlbum)
router.get("/albums/:id/delete/:index",albumController.deleteImage)



module.exports = router