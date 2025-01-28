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
    uploadDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: [
            "Finalized",
            "Not-Finalized"
        ],
        default: "Not-Finalized"
    }
});

module.exports = mongoose.model('File', fileSchema);