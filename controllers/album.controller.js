const Album = require("../models/Album")
const path = require("path")
const fs = require("fs")
const { rimraf } = require("rimraf");
const CatchAsync = require("../helper/CatchAsync")

const albums =CatchAsync(async(req,res,next)=>{
  const albums =await Album.find();
  res.render("albums",{title:"Nouvel album",albums})
})
const album = CatchAsync( async(req,res)=>{
  try {
    const id = req.params.id
    const albumItem= await Album.findById(id);
    res.render("album",{albumItem,title:`Mon album ${albumItem.title}`,errors:req.flash("error")})
  } catch (error) {
    console.log("id non trouver")
    res.redirect("/404")
  }
})
const addImage = CatchAsync(async(req,res)=>{
  const idAlbum = req.params.id
  const album = await Album.findById(idAlbum)

  if(!req?.files?.image){
    req.flash("error","Aucun fichier mis en ligne")
     res.redirect(`/albums/${idAlbum}`)
     return;
  }
 const image = req.files.image
  if(image.mimetype != 'image/jpeg' && image.mimetype != 'image/png'){
     req.flash("error","Fichier JPEG ET PNG acceptés uniquement!")
     res.redirect(`/albums/${idAlbum}`)
     return;
  } 

  const folderPath = path.join(__dirname,'../public/uploads',idAlbum)
  fs.mkdirSync(folderPath,{recursive:true})

  const imageName = image.name;
  const localPath = path.join(folderPath,imageName)
  await image.mv(localPath)

  album.images.push(imageName)
  await album.save()

  res.redirect(`/albums/${idAlbum}`)
})

const createAlbumForm= CatchAsync((req,res)=>{
  res.render("new-album",{title:"Nouvel album", errors: req.flash("error")})
})
const createAlbum=CatchAsync(async(req,res)=>{
try {
    if(!req.body.albumTitle){
    req.flash("error", "Le titre ne doit pas etre vide ❌") 
    res.redirect("/albums/create")
    return;
    }
   await Album.create({
    title:req.body.albumTitle,
   })
res.redirect("/albums")
} catch (error) {
  req.flash("error", "Impossible de créer l’album ❌")
  res.redirect("/albums/create")
}
})

const deleteAlbum =CatchAsync(async(req,res)=>{
 try {
  const id = req.params.id
  await Album.findByIdAndDelete(id)

  const albumPath = path.join(__dirname,'../public/uploads',id)
  await rimraf(albumPath);
  res.redirect("/albums");
 } catch (error) {
  console.log(error)
 }
})

const deleteImage =CatchAsync(async(req,res)=>{
 try {
  const {id,index} = req.params;
  const album = await Album.findById(id)
  const image = album.images[index]
  if (!image) {
     res.redirect(`/albums/${id}`)
     return;
  }
  album.images.splice(index,1)
  await album.save()
  const imagepath = path.join(__dirname,'../public/uploads',id,image)
  fs.unlinkSync(imagepath)
  res.redirect(`/albums/${id}`)
 } catch (error) {
  console.log(error)
   res.redirect(`/albums/${id}`)
 }
})
module.exports={createAlbumForm,createAlbum,albums,album,addImage,deleteImage,deleteAlbum}