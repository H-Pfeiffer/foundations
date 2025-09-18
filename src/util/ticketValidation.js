const logger = require("../util/logger");

const isValidAmount = (amount) => {
    if (!amount) {
        logger.warn(`Invalid amount: ${JSON.stringify(amount)}`);  
        return false;
    }
    return true;
}

const isValidDescription = (description) => {
    if (!description) {
        logger.warn(`Invalid description: ${JSON.stringify(description)}`); 
        return false; 
    }
    return true;
}

const getTimestamp = () => {
    const rawTimestamp = Date.now(); 
    const dateObject = new Date(rawTimestamp);
    const readableTimestamp = dateObject.toLocaleString();
    return readableTimestamp;
}

const createFormattedTicket = (amount, description, user_id) => {
    return {
        ticket_id: crypto.randomUUID(),
        user_id,
        createdAt: getTimestamp(),
        amount,
        description,
        status: "pending"
    }
}

module.exports = {
    isValidAmount,
    isValidDescription,
    createFormattedTicket,
    getTimestamp
}