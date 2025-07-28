const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
name: {
    type: String,
    require: true,
    unique: true
},
description:{
    type:String,
    require:true
},
icon: {
    type:String,
    require:false
},
status: {
    type:String,
    require:true
}
}, {
timestamps: true,
});



module.exports= mongoose.model('Category',categorySchema);