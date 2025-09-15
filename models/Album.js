const {Schema, model, default: mongoose} = require("mongoose")

const albumSchema = new Schema({
    title:{type:String,required:true},
    images:[String],
    auteur:{type:Schema.Types.ObjectId,ref:"User"}
},{timestamps:true})
module.exports= model("Album",albumSchema)