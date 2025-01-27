const express = require('express');
const router = express.Router();
const multer = require('multer');
const Pdf = require('../models/Pdf');
const mongoose = require('mongoose')

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only PDFs are allowed!'), false); // Reject the file
    }
};

// Configure multer storage
const upload = multer({
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});


// Get all PDFs without buffer data
router.get('/all', async (req, res) => {
    try {
        const pdfs = await Pdf.find({}, '-data');
        res.status(200).json(pdfs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching PDFs', error: error.message });
    }
});



// History of the document 
router.get('/history', async (req, res) => {
    try {
        const pdf = await Pdf.find({}, "uploadDate name"); // Fetch one document, including only the uploadDate field
        res.status(200).json(pdf); // Respond with the found document
    } catch (error) {
        res.status(500).json({ message: 'Error fetching PDFs', error: error.message });
    }
});

// Get specific PDFs without buffer data
router.get('/files/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const query = {};
        // console.log(id);
        if (mongoose.Types.ObjectId.isValid(id)) {
            query._id = id;
        } else {
            query.projectId = id;
        }
        const pdfs = await Pdf.find(query, '-data');
        res.status(200).json(pdfs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching PDFs', error: error.message });
    }
});

// Get specific PDFs without buffer data through project ID
router.get('/files/proj/:id', async (req, res) => {
    const id = req.params.id;
    try {

        const query = {};
        // console.log(id);
        if (mongoose.Types.ObjectId.isValid(id)) {
            query.ProjectId = id;
        } else {
            query.projectId = id;
        }
        console.log(query);

        const files = await CadFile.findOne(Pdf, '-data').exec();
        res.status(200).json({
            files: files,
            message: 'Success'
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error retrieving files' });
    }
});

// Handle file upload
router.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        console.log(req.file);


        const newPdf = new Pdf({
            name: req.file.originalname,
            data: req.file.buffer,
            contentType: req.file.mimetype
        });

        await newPdf.save();
        res.status(200).json({ message: 'PDF uploaded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
});



// Endpoint to retrieve and serve PDF file
router.get('/view/:id', async (req, res) => {
    try {
        const file = await Pdf.findById(req.params.id);
        if (!file) {
            return res.status(404).send('File not found');
        }

        // Send the PDF file as a response  
        res.set('Content-Type', 'application/pdf');
        // res.status(200).send(Buffer.from(file.svgFileData, 'base64'));
        res.status(200).send(file.data);


    } catch (err) {
        res.status(500).send('Error retrieving file from database');
    }
});


// Route to download the PDF file
router.get('/download/:id', async (req, res) => {
    try {
        // Find the file in the database by ID
        const file = await Pdf.findById(req.params.id);

        if (!file) {
            return res.status(404).send('File not found');
        }

        // Set headers for downloading the PDF
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${file.name || 'download.pdf'}"`, // Use file name or default
        });

        // Send the file data as a binary stream
        res.send(file.data); // Assuming `file.data` contains the binary PDF data
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving the PDF file');
    }
});


// Updating Status
router.post("/status/:id", async (req, res) => {
    try {
        const file = await Pdf.findByIdAndUpdate(req.params.id, req.body)
        if (!file) { return res.status(400).json(msg = "File not found") }
        res.status(200).json(msg = "Success")
    } catch (err) {
        console.log(err.message);
        res.status(500).json(msg = err.message || "Something went wrong")
    }
})

// Updating Status
router.delete("/delete/:id", async (req, res) => {
    try {
        const file = await Pdf.findByIdAndDelete(req.params.id)
        if (!file) { return res.status(400).json(msg = "File not found") }
        res.status(200).json(msg = "Success")
    } catch (err) {
        console.log(err.message);
        res.status(500).json(msg = err.message || "Something went wrong")
    }
})





module.exports = router;