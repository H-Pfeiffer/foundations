const ticketDAO = require('../repository/ticketDAO.js');
const { getTimestamp } = require('../util/ticketValidation');
const { isManager } = require('../util/userValidation');
const { isUnprocessedTicket, isValidStatus, isValidStatusToViewTickets } = require('../util/ticketSystemsValidation');
const logger = require("../util/logger");

const getAllTicketsByStatus = async (status) => {
    try {
        if (!status) {
            const tickets = await ticketDAO.getAllTickets();
            return tickets;            
        }
        else if (isValidStatusToViewTickets(status)) {
            const tickets = await ticketDAO.getAllTicketsByStatus(status);
            logger.info(`Returned data from getAllTicketsByStatus in ticketSystemsService: ${JSON.stringify(tickets)}`);
            return tickets;
        }      
    } catch (err) {
        logger.error(`Error in getAllPendingTickets in ticketSystemsService: ${err}`);
    }
    return null;
}

const updateTicketStatus = async (ticket_id, username, updatedStatus) => {
    try {
        const formattedStatus = updatedStatus.toLowerCase().trim();

        if (isManager(username)
            && await isUnprocessedTicket(ticket_id) 
            && isValidStatus(formattedStatus)) {

            const timestamp = getTimestamp();
            const updatedTicket = await ticketDAO.updateTicketStatusById(ticket_id, formattedStatus, timestamp);
            logger.info({message: 'Returned data from updateTicketStatus in ticketSystemsService', tickets: updatedTicket});
            return updatedTicket;
        }
    } catch (err) {
        logger.error(`Error in updateTicketStatus in ticketSystemsService: ${err}`);
    }
    return null;
}

module.exports = {
    getAllTicketsByStatus,
    updateTicketStatus
}