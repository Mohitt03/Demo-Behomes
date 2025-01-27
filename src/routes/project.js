const express = require('express');
const router = express.Router();
const Project = require('../models/Project')
const mongoose = require('mongoose');


router.get('/view', async (req, res) => {

    try {
        const Data = await Project.find();
        // res.json(response)
        // console.log("Succesful");
        res.status(200).json({ msg: "Success", Datas: Data });


    } catch (err) { 
        console.error(err.message)
        res.status(500).json({ msg: "Server error" })
    }
})


// Finding data by Project Id
router.get('/view/:id', async (req, res) => {

    const id = req.params.id;

    try {

        let query = {};

        // Check if the id is a MongoDB ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            query._id = id;
        } else {
            query.projectId = id;
        }
        // console.log(id, query);


        const response = await Project.findOne(query);
        if (!response) return res.status(404).json({ msg: "Project doesn't exists" })

            res.status(200).json({ msg: "Success", response: response });


    } catch (err) {
        console.error(err.message);
        res.json({ msg: "Server error" })
    }
})


router.post('/create', async (req, res) => {
    const { projectId, projectName } = req.body;

    try {
        // const projectIdExists = await Project.findOne({ projectId });
        // if (projectIdExists) return res.status(400).json({ msg: 'Project Id already exists' });

        // const projectNameExists = await Project.findOne({ projectName });
        // if (projectNameExists) return res.status(400).json({ msg: 'Project Name already exists' });

        const newProject = Project.create(req.body)



        return res.status(200).json({ msg: "Success" })
    } catch (err) {
        console.error(err.message);
        res.json({ msg: "Server error" })

    }
})
// Working
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id

        const query = {};
        console.log(id);
        if (mongoose.Types.ObjectId.isValid(id)) {
            query._id = id;
        } else {
            query.projectId = id;
        }
        console.log(id, query);
        console.log(req.body);


        const response = await Project.findOneAndUpdate(query, req.body)
        if (!response) return res.status(400).json({ msg: "Project not found" })


        res.status(200).json({ msg: "Success" })
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ msg: err.message })

    }
});



router.put('/projects/:id', async (req, res) => {
    try {


        const id = req.params.id

        const query = {};
        console.log(id);
        if (mongoose.Types.ObjectId.isValid(id)) {
            query._id = id;
        } else {
            query.projectId = id;
        }


        const response = await Project.findOneAndUpdate(query, req.body)
        if (!response) return res.status(400).json({ msg: "Project not found" })


        res.status(200).json({ msg: "Success" })
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: 'Internal Server Error' });
    }
});




router.delete('/delete/:id', async (req, res) => {

    const id = req.params.id
    try {
        const query = {};
        console.log(id);
        if (mongoose.Types.ObjectId.isValid(id)) {
            query._id = id;
        } else {
            query.projectId = id;
        }

        const response = await Project.findOneAndDelete(query)
        res.status(200).json({ msg: "Success" });

    }
    catch (error) {
        res.status(500).json({ msg: "Internal Server Error" })
    }
})
module.exports = router;