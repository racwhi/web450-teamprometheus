const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let projectSchema = new Schema({
projectId:{ type: Number, required: true, unique: true },
name: {type:String,required :true,},
description: {type: String},
startDate: {type: Date},
endDate: {type: Date},
dateCreated: { type: Date, default: Date.now },
dateModified:{ type: Date}
});



module.exports = {
Project: mongoose.model('Project', projectSchema)
}



/*projectSchema.pre('save', function(next){ 
    if (!this.isNew) {
this.dateModified = new Date(); 
}
next(); 
})*/