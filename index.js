const express = require("express")
const app = express()
const path = require("path")
const mongoose = require("mongoose")
const fileUpload = require("express-fileupload")
const Album = require("./models/Album")
const AlbumRouter = require("./routes/album.route")
const session = require("express-session")
const flash = require("connect-flash")



const port = 3000

app.set('view engine',"ejs")
app.set("views",path.join(__dirname,"views"))
app.use(express.static("public"))

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(fileUpload())

app.set('trust proxy', 1)
app.use(session({
  secret: 'dev-secret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash());

app.get('/',(req,res)=>{
    res.redirect("/albums")
})

app.use('/',AlbumRouter)

app.use((req,res)=>{
    res.status(404).json({message:"page non trouver"})
    console.log("page non trouver")
})
app.use((err,req,res,next)=>{
  console.log(err)
  res.status(500)
  res.send("Erreur interne du serveur")
})

app.listen(port,(req,res)=>{
  try {
    mongoose.connect("mongodb://localhost/phototeques")
  } catch (error) {
    console.log(error)
  }
})