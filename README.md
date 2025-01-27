# Demo_Project
<!-- sserver old  -->

// const express = require('express');
// const session = require('express-session');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv');
// const cors = require('cors');

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json())
// app.use(express.urlencoded({ extended: false }))
// app.set('view engine', 'ejs');
// app.use('/uploads', express.static('uploads'));

// app.use(session({
//   secret: 'your-secret-key',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false }
// }));

// app.use(bodyParser.json());

// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.log(err));

// app.use('/auth', require('./routes/auth'));
// app.use('/project', require('./routes/project'));
// app.use('/basicDrawing', require('./routes/basicDrawing'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

<!-- project route old -->
// const express = require('express');
// const router = express.Router();
// const Project = require('../models/Project')
// const mongoose = require('mongoose');


// router.get('/view', async (req, res) => {

//     try {
//         const response = await Project.find();
//         // res.json(response)
//         // console.log("Succesful");
//         res.status(200).json({ msg: "Success", response: response });


//     } catch (err) {
//         console.error(err.message)
//         res.status(500).json({ msg: "Server error" })
//     }
// })


// // Finding data by Project Id
// router.get('/view/:id', async (req, res) => {

//     const id = req.params.id;

//     try {

//         let query = {};

//         // Check if the id is a MongoDB ObjectId
//         if (mongoose.Types.ObjectId.isValid(id)) {
//             query._id = id;
//         } else {
//             query.projectId = id;
//         }
//         console.log(id, query);


//         const response = await Project.findOne(query);
//         if (!response) return res.status(404).json({ msg: "Project doesn't exists" })

//             res.status(200).json({ msg: "Success", response: response });


//     } catch (err) {
//         console.error(err.message);
//         res.json({ msg: "Server error" })
//     }
// })


// router.post('/create', async (req, res) => {
//     const { projectId, projectName } = req.body;

//     try {
//         // const projectIdExists = await Project.findOne({ projectId });
//         // if (projectIdExists) return res.status(400).json({ msg: 'Project Id already exists' });

//         // const projectNameExists = await Project.findOne({ projectName });
//         // if (projectNameExists) return res.status(400).json({ msg: 'Project Name already exists' });

//         const newProject = Project.create(req.body)



//         return res.status(200).json({ msg: "Success" })
//     } catch (err) {
//         console.error(err.message);
//         res.json({ msg: "Server error" })

//     }
// })
// // Working
// router.patch('/update/:id', async (req, res) => {
//     try {
//         const id = req.params.id

//         const query = {};
//         console.log(id);
//         if (mongoose.Types.ObjectId.isValid(id)) {
//             query._id = id;
//         } else {
//             query.projectId = id;
//         }
//         console.log(id, query);
//         console.log(req.body);


//         const response = await Project.findOneAndUpdate(query, req.body)
//         if (!response) return res.status(400).json({ msg: "Project not found" })


//         res.status(200).json({ msg: "Success" })
//     } catch (err) {
//         console.error(err.message);
//         res.status(400).json({ msg: err.message })

//     }
// });



// router.put('/projects/:id', async (req, res) => {
//     try {


//         const id = req.params.id

//         const query = {};
//         console.log(id);
//         if (mongoose.Types.ObjectId.isValid(id)) {
//             query._id = id;
//         } else {
//             query.projectId = id;
//         }


//         const response = await Project.findOneAndUpdate(query, req.body)
//         if (!response) return res.status(400).json({ msg: "Project not found" })


//         res.status(200).json({ msg: "Success" })
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ msg: 'Internal Server Error' });
//     }
// });




// router.delete('/delete/:id', async (req, res) => {

//     const id = req.params.id
//     try {
//         const query = {};
//         console.log(id);
//         if (mongoose.Types.ObjectId.isValid(id)) {
//             query._id = id;
//         } else {
//             query.projectId = id;
//         }

//         const response = await Project.findOneAndDelete(query)
//         res.status(200).json({ msg: "Success" });

//     }
//     catch (error) {
//         res.status(500).json({ msg: "Internal Server Error" })
//     }
// })
// module.exports = router;

<!-- Project model old -->
// const mongoose = require('mongoose');
// const validate = require('express-validator')

// const projectSchema = new mongoose.Schema({
//     // projectId: {
//     //     type: String,
//     //     unique: true,
//     //     required: true
//     // },
//     projectName: {
//         type: String,
//         required: true
//     },
//     projectType: {
//         type: String,
//         enum: [
//             "Residential",
//             "Commercial",
//             "Office",
//             "Retail",
//             "Hospitality"
//         ]
//     },
//     projectDate: {
//         start: String,
//         end: String
//     },
//     assigned: {
//         type: String
//     },
//     projectAddress: {
//         fulladdres: String,
//         city: String,
//         pincode: Number
//     },
//     client: {
//         clientType: {
//             type: String,
//             enum: ['corporate', 'individual'],
//             required: true
//         },
//         // Company name only required if clientType is corporate
//         companyName: {
//             type: String,
//             required: function () {
//                 return this.clientType === 'corporate';
//             }
//         },
//         clientName: String,
//         contactNumber: String,
//         emailAddress: String,

//     },
//     referral: {
//         referredBy: String
//     },
//     architectName: String,
//         architectCompanyName: String,
//             phone: String,
//             email: String,
//             // address: String
//     projectStatus: {
//         type: String,
//         enum: [
//             "Planned",
//             "In Progress",
//             "Completed",
//             "On Hold",
//             "Cancelled"
//         ]
//     },
//     currentStage: {
//         type: String,
//         enum: [
//             "Presentation",
//             "Quotation",
//             "Measurement",
//             "Finalization",
//             "Execution"
//         ]
//     },
//     designPreferences: {
//         style: {
//             type: String,
//             enum: [
//                 "Contemporary",
//                 "Minimalist",
//                 "Industrial",
//                 "Traditional"
//             ]
//         },
//         theme: String
//     },
//     assignedDesigners: [{ type: String }],
//     projectTerms: String,
//     paymentTerms: String,
//     aboutProject: {
//         type: String
//     }
// });
// // projectSchema.pre('save', function (next) {
// //     if (this.client.clientType === 'individual' && this.client.companyName) {
// //         this.client.companyName = undefined;
// //     }
// //     next();
// // });


// module.exports = mongoose.model('Project', projectSchema);


<!-- basic drawing old -->
const express = require('express')
const multer = require('multer')
const axios = require('axios')
const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
dotenv.config();
const convertapi = require('convertapi')("secret_JxzAZULuF2RxAG0a")
const router = express.Router(process.env.CONVER_API_KEY)
const CadFile = require('../models/BasicDrawing');

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
});

// To get Uploader Page
router.get('/upload', (req, res) => {
    try {
        // res.status(200).json({
        //     message: 'Success'
        // }).render('upload')
        res.status(200).render('upload', { data: { message: 'Success' } });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error retrieving files' });
    }
});



router.get('/files', async (req, res) => {
    console.log(process.env.TESTING);

    try {
        const files = await CadFile.find().exec();

        res.status(200).json({
            files: files,
            message: 'Success'
        });


    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error retrieving files' });
    }
});


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
        const files = await CadFile.findOne(query).exec();
        res.status(200).json({
            files: files,
            message: 'Success'
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error retrieving files' });
    }
});

router.post('/upload', upload.single('cadFile'), async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Create temporary file
        const dwgFilePath = path.join('src/temp', `${req.file.originalname}`);
        // const dwgFilePath = req.file.path;
        const dwgFileName = req.file.originalname;

        console.log(`Converting ${dwgFileName} to SVG...`);

        // Convert DWG to SVG
        const result = await convertapi.convert('svg', { File: dwgFilePath }, 'dwg');
        console.log("done1");

        const svgName = result.file.fileInfo.FileName;
        const svgFilePath = path.join('src/temp', `${path.parse(req.file.originalname).name}.svg`);
        console.log("done2", svgFilePath, svgName);

        // Save the converted SVG to the temp folder
        await result.file.save(svgFilePath);

        // Read the converted file as a buffer
        const svgBuffer = fs.readFileSync(svgFilePath);
        console.log("done3", svgBuffer);

        // Read both files
        const dwgBuffer = fs.readFileSync(dwgFilePath);
        console.log("done4", dwgBuffer);

        // Step 2: Save both the original .dwg and converted .svg to MongoDB
        const newFile = new CadFile({
            dwgFileName: req.file.originalname,
            svgFileName: svgName,
            dwgFileData: dwgBuffer,
            svgFileData: svgBuffer
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

<!-- basic drawing model -->
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    dwgFileName: String,
    svgFileName: String,
    dwgFileData: Buffer,
    svgFileData: Buffer,
    timestamps: {
        createdAt: Date,
        uploadedAt: Date,
        convertedAt: Date
    }
});

module.exports = mongoose.model('File', fileSchema);


# Demo-Behomes
