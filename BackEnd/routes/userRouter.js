const express = require('express');
const router = express.Router()
const User = require('../models/userModel')
const AllUsers=require('../controllers/AllUsers')
const {protect}=require('../middleware/authToken')

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')



/*sign up start*/
router.post('/createuser', body('email').isEmail(),
    // password must be at least 5 chars long
    body('name').isLength({ min: 5 }),
    body('password', "incorrect Password").isLength({ min: 5 })
    , async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success:'length' });
            }
            let { name, email, password, pic } = req.body;
            if(!pic){
                pic='https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
            }
            const userexists = await User.findOne({ email });
            if (userexists) {
                return res.status(400).json({ success:'Already Exists'})
            }
            const salt = await bcrypt.genSalt(10);
            const securepassword = await bcrypt.hash(password, salt);
            await User.create({
                name,
                email,
                password: securepassword,
                pic,
            })
            res.json({ success: true })
        } catch (err) {
            console.log(err);
            res.json({ success: false });
        }
    })

/*sign up end*/

/*login start*/
router.post('/loginuser', body('email').isEmail(),
    body('password', "incorrect Password").isLength({ min: 5 }), async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let email = req.body.email
        try {
            let userData = await User.findOne({ email })
            if (!userData) {
                return res.status(400).json({ errors: 'Try logging valid credentials' });
            }
            const pwdCompare = await bcrypt.compare(req.body.password, userData.password)

            if (!pwdCompare) {
                return res.status(400).json({ errors: 'Try logging valid credentials' });
            }

            const data = {
                userData: {
                    id: userData.id
                }
            }
            const authToken =await jwt.sign(data,process.env.JWT_SECRET)

         return   res.json({ success: true,  _id: userData._id,
                name: userData.name,
                email: userData.email,
                isAdmin: userData.isAdmin,
                pic: userData.pic,
                token: authToken });
        }

        catch (error) {
            console.log(error);
            res.json({ success: false });
        }
    });
    /*login end*/




router.get('/userData',protect,AllUsers);
module.exports = router;
