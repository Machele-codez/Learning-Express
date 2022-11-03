const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getAuthToken } = require("../utils");
const BlacklistedToken = require("../models/BlacklistedToken");
require("dotenv/config");

router.post('/register', async (req, res) => {
    let {username, email, password} = {...req.body};
    const hashed_password = bcrypt.hashSync(password, 10);
    
    const user = new User({
        username,
        email,
        password: hashed_password
    });

    
    try {
        const UserObj = await user.save();
        return res.json({
            data: UserObj,
            message: "",
            success: true
        });
    } catch (error) {
        return res.json({
            data: null,
            message: error,
            success: false
        });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = {...req.body};
    let user;

    // validate data
    if (!username?.toString())
        return res.json({
            data: null,
            message: "No username provided",
            success: false    
        })
        
    if (!password?.toString())
        return res.json({
            data: null,
            message: "No password provided",
            success: false    
        })

    // query db for user matching username
    try {
        user = await User.findOne({username});
        
        // if user is not found 
        if (user === null) {
            return res.json({
                data: null,
                message: "No such user",
                success: false    
            })
        }

    } catch (error) {
        return res.json({
            data: null,
            message: error,
            success: false
        });
    }
    
    // verify password
    if (!bcrypt.compareSync(password.toString(), user.password)) {
        return res.json({
            data: null,
            message: "Invalid password",
            success: false
        });    
    }

    // generate token
    const token = jwt.sign({username: user.username}, process.env.SECRET_KEY, {expiresIn: '1h'});
    res.json({
        data: {
            username: user.username,
            token
        },
        message: "",
        success: true
    })

});

router.get('/logout', async (req, res) => {
    // invalidate token by adding it to a blacklist in the DB
    token = getAuthToken(req);
    if (!token) {
        return res.status(400).json({
            data: null,
            message: "No auth token",
            success: false
        });
    }

    let blacklistedToken = new BlacklistedToken({
        token: token
    })

    try {
        await blacklistedToken.save();

        return res.json({
            data: null,
            message: "Logged Out",
            success: true
        });
    } catch (error) {
        return res.json({
            data: null,
            message: error,
            success: false
        })
    }
});

module.exports = router;