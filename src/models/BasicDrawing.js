const mongoose = require('mongoose');
const Project = require('../models/Project')

const fileSchema = new mongoose.Schema({
    ProjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project" // Reference to the Pdf model
    },
    dwgFileName: String,
    svgFileName: String,
    dwgFileData: Buffer,
    svgFileData: Buffer,
    contentType: String,
    createdDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('File', fileSchema);