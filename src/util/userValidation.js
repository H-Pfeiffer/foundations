const userDAO = require('../repository/userDAO');
const logger = require("../util/logger");
const bcrypt = require('bcrypt'); 

const isValidUsername = async (username) => {
    if (username) {
        const currentUser = await userDAO.getUserByUsername(username);
        logger.info(`Username validation check - username exists: ${!currentUser}`);   
        return !currentUser;
    }
    logger.warn(`Invalid username: ${JSON.stringify(username)}`);    
    return null;
}

// TODO: add more pw validation checks
const isValidPassword = (password) => {
    if (password) { 
        logger.info(`Password validation successful`);   
        return true;  
    }
    logger.warn(`Invalid password`);    
    return null;
}

const createFormattedUser = async (userName, userPass, userRole = "employee") => {
    try {
        const user_id = crypto.randomUUID();
        const salt = 12;
        const password = await bcrypt.hash(userPass, salt);
        const role = userRole.toLowerCase() === "manager" ? "manager" : "employee";  // can move "role" to helper func in utils for better validation
        const username = userName;
        
        const formattedUser = {user_id: user_id, password: password, role: role, username: username};
        return formattedUser;
    } catch (err) {
        logger.error(`Error in createdFormattedUser in userValidation: ${err}`);
    }
    return null;
}

const isManager = async (username) => {
    const currentUser = await userDAO.getUserByUsername(username);
    logger.info({message: 'from isManager in userValidation', user: currentUser});
    const isAManager = currentUser.role === "manager";

    if (!isAManager) {
        logger.warn(`The following user does not have authorization to access pending tickets: ${JSON.stringify(username)}`);         
    }
    return isAManager;
}

module.exports = {
    isValidUsername,
    isValidPassword,
    createFormattedUser,
    isManager,
}