const ticketDAO = require('../repository/ticketDAO.js');
const logger = require("../util/logger");

const isUnprocessedTicket = async (ticket_id) => {
    try {
        const ticket = await ticketDAO.getTicketById(ticket_id);
        if (!ticket.Item || ticket.Item.status !== "pending" || ticket.Item.processedAt) {

            logger.warn('The following request status is invalid. Valid pending tickets may only be processed once.');
            return false;
        }
        logger.info('ticket is has not been proccessed and may be updated from: isUnprocessedTicket in ticketSystemsValidation');
        return true;
    } catch (err) {
        logger.error(`Error in isUnprocessedTicket in ticketSystemsValidation: ${err}`);
    }
}

const isValidStatus = (updatedStatus) => {
    const isAValidStatus = updatedStatus === "approved" || updatedStatus === "denied";

    if (!isAValidStatus){
        logger.warn(`The following updated status is invalid: must assign approved or denied": ${JSON.stringify(updatedStatus)}`);         
    }
    return isAValidStatus;
}

const isValidStatusToViewTickets = (status) => {
    const isAValidStatus = status.toLowerCase() === "approved" || status === "denied" || status === "pending";

    if (!isAValidStatus){
        logger.warn({message: "The following updated status is invalid: must assign approved, denied, or pending", status: status});         
    }
    return isAValidStatus;
}

module.exports = {
    isUnprocessedTicket,
    isValidStatus,
    isValidStatusToViewTickets
}