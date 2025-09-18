const express = require('express');
const router = express.Router();
const userService = require('../service/userService');
const { generateToken } = require("../util/jwt");
const logger = require("../util/logger");

router.post("/register", async (req, res) => {
    logger.info(`Incoming userController POST "/register" request: ${JSON.stringify(req.body)}`);

    try {
        const newUserdata = await userService.registerUser(req.body);
        
        return newUserdata
            ? res.status(201).json({message: "Created user", user: newUserdata})
            : res.status(400).json({message: `Invalid request: user not created. Must contain a unique username and a password.`});  
    } catch (err) {
        logger.error(`Error in userController POST "/register": ${err}`);
    }
});

router.post("/login", async (req, res) => {
    logger.info(`Incoming userController POST "/login" request: ${JSON.stringify(req.body)}`);

    try {
        const { username, password } = req.body;
        const user = await userService.validateLogin(username, password);

        if (user){
            const payload = { id: user.user_id, username: username, role: user.role };
            const token = generateToken(payload);
            return res.status(200).json({message: "Successful login", token});
        } else {
            return res.status(401).json({message: `Invalid username or password`});  
        }
    } catch (err) {
        logger.error(`Error in userController POST "/login": ${err}`);
    }
});

module.exports = router;