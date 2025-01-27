const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express();
app.use(express.json());


router.get('/view/all', async (req, res) => {
    try {
        const file = await User.find();

        // res.render('index', { datas: file })
        res.status(200).json({
            files: file
        });



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
        const file = await User.findById(req.params.id);
        res.status(200).json({
            files: file
        });

        if (!file) {
            return res.status(404).send('File not found');
        }
        res.status(200);


    } catch (err) {
        res.status(500).send('Error retrieving file from database');
    }
});



router.post('/register', async (req, res) => {
    const { username, role, email, password, phonenumber } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, role, email, password: hashedPassword, phonenumber });

        await newUser.save();

        const payload = { userId: newUser.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, message: 'Success' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt with:', { email, password });
    req.session.email = email
    console.log(req.session.email);

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(password, user.password);
        console.log('Password comparison result:', isMatch);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, message: 'Success' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/sendOTP', async (req, res) => {
    try {


        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const otp = crypto.randomBytes(3).toString('hex');

        const otpExpires = Date.now() + 3600000; // 1 hour
        req.session.otp = otp;

        console.log(req.session.otp, otp);


        req.session.otpExpires = Date.now() + 3600000; // 1 hour

        const mailOptions = {
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send(error.toString());
            }
            res.status(200).send('Success');
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error' });
    }
})



router.post('/resetPassword', async (req, res) => {
    try {
        // Get user's email and OTP from request body
        const { email, otp, newPassword } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify OTP
        if (req.session.otp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password
        user.password = hashedPassword;
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        // Return JWT token and success message
        res.status(200).json({ token, message: 'Success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

})

module.exports = router;