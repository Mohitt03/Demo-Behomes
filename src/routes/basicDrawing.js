const express = require('express')
const multer = require('multer')
const axios = require('axios')
const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
dotenv.config();
const convertapi = require('convertapi')("secret_aagcISoaQKDW4gCQ")
const router = express.Router(process.env.CONVER_API_KEY)
const CadFile = require('../models/BasicDrawing');
const Project = require('../models/Project');
const { log } = require('console');

const app = express();


app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Set up for Multer for file uploads

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/temp'); // Save files in the temp folder
    },
    filename: (req, file, cb) => {
        // Save the file with its original name
        cb(null, file.originalname);
    },
});

// Multer instance with limits and filters
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Allow only DWG files
        if (path.extname(file.originalname).toLowerCase() === '.dwg') {
            cb(null, true);
        } else {
            cb(new Error('Only DWG files are allowed!'), false);
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

// To get Uploader Page
router.get('/upload', (req, res) => {
    try {
        res.status(200).render('upload', { data: { message: 'Success' } });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error retrieving files' });
    }
});



// Updating Status
router.post("/status/:id", async (req, res) => {
    try {
        const file = await CadFile.findByIdAndUpdate(req.params.id, req.body)
        if (!file) { return res.status(400).json(msg = "File not found") }
        res.status(200).json(msg = "Success")
    } catch (err) {
        console.log(err.message);
        res.status(500).json(msg = err.message || "Something went wrong")
    }
})




router.get('/files', async (req, res) => {
    try {
        const files = await CadFile.find({}, '-dwgFileData -svgFileData').exec();

        res.status(200).json({
            files: files,
            message: 'Success'
        });


    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error retrieving files' });
    }
});

// History of the document
router.get('/history', async (req, res) => {
    try {
        const File = await CadFile.find({}, "createdDate"); // Fetch one document, including only the uploadDate field
        res.status(200).json(File); // Respond with the found document
    } catch (error) {
        res.status(500).json({ message: 'Error fetching PDFs', error: error.message });
    }
});


router.get('/files/:id', async (req, res) => {
    const id = req.params.id;
    try {

        const query = {};
        // console.log(id);
        if (mongoose.Types.ObjectId.isValid(id)) {
            query._id = id
        } else {
            query.projectId = id;
        }
        console.log(query);

        const files = await CadFile.findOne(query, '-dwgFileData -svgFileData').exec();
        res.status(200).json({
            files: files,
            message: 'Success'
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error retrieving files' });
    }
});

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

        const files = await CadFile.findOne(query, 'ProjectId dwgFileName svgFileName').exec();
        res.status(200).json({
            files: files,
            message: 'Success'
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error retrieving files' });
    }
});


// History of the document
router.get('/history', async (req, res) => {
    try {
        const File = await CadFile.find({}, "createdDate"); // Fetch one document, including only the uploadDate field
        res.status(200).json(File); // Respond with the found document
    } catch (error) {
        res.status(500).json({ message: 'Error fetching PDFs', error: error.message });
    }
});


router.post('/upload', upload.single('cadFile'), async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const tempDir = path.join('/tmp')


        // Ensure temp directory exists
        if (!fs.existsSync(tempDir)) {
            await fs.promises.mkdir(tempDir, { recursive: true }).catch((err) => {
                console.error('Failed to create temp directory:', err);
                throw new Error('Could not create temp directory');
            });
        }
        console.log('Temp Directory:', tempDir);
        // Create temporary file
        const dwgFilePath = path.join(tempDir, `${req.file.originalname}`);
        console.log('DWG File Path:', dwgFilePath);
        // const dwgFilePath = req.file.path;
        const dwgFileName = req.file.originalname;

        // Convert DWG to SVG
        const result = await convertapi.convert('svg', { File: dwgFilePath }, 'dwg');

        const svgName = result.file.fileInfo.FileName;
        const svgFilePath = path.join(tempDir, `${path.parse(req.file.originalname).name}.svg`);
        console.log('SVG File Path:', svgFilePath);

        // Save the converted SVG to the temp folder
        await result.file.save(svgFilePath);

        // Read the converted file as a buffer
        const svgBuffer = fs.readFileSync(svgFilePath);

        // Read both files
        const Projid = '678b1aca07e57cdf6ce5697c';

        // Step 2: Save both the original .dwg and converted .svg to MongoDB
        const newFile = new CadFile({
            dwgFileName: req.file.originalname,
            svgFileName: svgName,
            dwgFileData: req.file.buffer,
            svgFileData: svgBuffer,
            ProjectId: Projid
        });

        await newFile.save();

        // Clean up temp files
        fs.unlinkSync(dwgFilePath);
        fs.unlinkSync(svgFilePath);

        res.status(200).send({ message: 'Success' });


    } catch (err) {
        console.error(err);
        res.json({ msg: err.message })
    }
});


// Route to download the DWG file
router.get('/download/:id', async (req, res) => {
    try {
        const fileId = req.params.id;
        const file = await CadFile.findById(fileId);

        if (!file) {
            return res.status(404).send('File not found');
        }

        // Set headers for download
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${file.dwgFileName}"`,
        });

        res.status(200).json({
            msg: "Success",
            fileData: file.dwgFileData.toString('base64')
        })

    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving the DWG file');
    }
});

// Route to download the SVG file
router.get('/Svg/download/:id', async (req, res) => {
    try {
        const fileId = req.params.id;
        const file = await CadFile.findById(fileId);

        if (!file) {
            return res.status(404).send('File not found');
        }

        // Set headers for download
        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename="${file.svgFileName}"`,
        })

        res.status(200).json({
            msg: "Success",
            fileData: file.svgFileData.toString('base64')
        })

    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving the DWG file');
    }
});


router.get('/view/all', async (req, res) => {
    try {
        const file = await CadFile.find();

        res.render('index', { datas: file })


        if (!file) {
            return res.status(404).send('File not found');
        }
        // res.render('index',{files:file.data})
        // Send the SVG file as a response
        // res.set('Content-Type', 'image/svg+xml');
        // res.send(Buffer.from(file.svgContent, 'base64'));
    } catch (err) {
        res.status(500).send('Error retrieving file from database');
    }
});


// Endpoint to retrieve and serve SVG file
router.get('/view/:id', async (req, res) => {
    try {
        const file = await CadFile.findById(req.params.id);
        if (!file) {
            return res.status(404).send('File not found');
        }
        // console.log(Buffer.from(file.svgFileData, 'base64');

        // Send the SVG file as a response  
        res.set('Content-Type', 'image/svg+xml');
        // res.status(200).send(Buffer.from(file.svgFileData, 'base64'));
        res.status(200).json({
            msg: "Success",
            file: file.svgFileData.toString('base64')
        });


    } catch (err) {
        res.status(500).send('Error retrieving file from database');
    }
});

router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {

        const query = {};
        console.log(id);
        if (mongoose.Types.ObjectId.isValid(id)) {
            query._id = id;
        } else {
            query.projectId = id;
        }
        console.log(query);

        const response = await CadFile.findOneAndDelete(query)
        res.status(200).send({ msg: 'Success' });

    } catch (err) {
        console.error(err.msg);
        res.status(400).send({ msg: 'Server Error' });
    }
});


module.exports = router;
