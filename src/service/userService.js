const userDAO = require('../repository/userDAO');
const { isValidUsername, isValidPassword, createFormattedUser } = require('../util/userValidation');
const logger = require("../util/logger");
const bcrypt = require('bcrypt'); 


// register a new user 
const registerUser = async (user) => {
    try {
        const { username, password, role } = user;

        if (user && await isValidUsername(username) && isValidPassword(password)) {
            const formattedUser = await createFormattedUser(username, password, role);
            await userDAO.registerUser(formattedUser);
            logger.info(`Returned data from registerUser in userService: ${JSON.stringify(formattedUser)}`);
            return formattedUser;
        }
    } catch (err) {
        logger.error(`Error in registerUser in userService: ${err}`);
    }
    return null;
}

// retrieve a single user data
const getUserByUsername = async (username) => {
    try {
        if (username){
            const user = await userDAO.getUserByUsername(username);
            logger.info(`Returned data from getUserByUsername in userService: ${JSON.stringify(user)}`);
            return user;
        } else {
            logger.warn(`Attempt to getUserByUsername was unsuccessful for: ${JSON.stringify(username)}`);            
        }
    } catch(err) {
        logger.error(`Error in getUserByUsername in userService: ${err}`);
    }
    return null;
}

// authentication function here 
const validateLogin = async (username, password) => {
    try {
        const user = await getUserByUsername(username);
        const isValid = !user ? null : await bcrypt.compare(password, user.password);

        if (user && isValid) {
            logger.info(`Returned data from validateLogin in userService: ${JSON.stringify(user)}`);
            return user;
        } else {
            logger.warn(`Attempt to validate username and/or password failed for: ${JSON.stringify(username)}`);         
        }
    } catch (err) {
        logger.error(`Error in validateLogin in userService: ${err}`); 
    }
    return null;
}


module.exports = {
    registerUser,
    getUserByUsername,
    validateLogin,
}







// testing 

// const newUser = {
//     user_id: "1234567890009877",
//     username: "Jon-Snow",
//     password: "winterIsComing!",
//     role: "manager" 
// }

// registerUser(newUser);

// const run = async () => {
//     const res = await validateLogin("Jon-Snow", "winterIsComing!");
//     console.log(res);
// } 

// run();

// getUserByUsername("Jon-Snow");