const ticketDAO = require('../repository/ticketDAO.js');
const { isValidAmount, isValidDescription, createFormattedTicket } = require('../util/ticketValidation');
const logger = require("../util/logger");

// create a new ticket
const createTicket = async (amount, description, user_id) => {
    if (isValidAmount(amount) 
        && isValidDescription(description)) {
        try {
            const formattedTicket = createFormattedTicket(amount, description, user_id);
            await ticketDAO.createTicket(formattedTicket);
            logger.info(`Returned data from createTicket in ticketService: ${JSON.stringify(formattedTicket)}`);
            return formattedTicket;
        } catch (err) {
            logger.error(`Error in createTicket in ticketService: ${err}`);
        }
    }
    return null;
}

// get all tickets for employee
const getAllTicketsByUserId = async (id) => {
    if (id) {
        try {
            const tickets = await ticketDAO.getAllTicketsByUserId(id);
            logger.info(`Returned data from getAllTicketsByUserId in ticketService: ${JSON.stringify(tickets)}`);
            return tickets;
        } catch (err) {
            logger.error(`Error in getAllTicketsByUserId in ticketService: ${err}`);
        }
    }
    return null;      
}


module.exports = {
    createTicket,
    getAllTicketsByUserId,
}

