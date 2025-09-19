const express = require('express');
const router = express.Router(); 
const { authenticateToken } = require("../util/jwt");
const ticketService = require('../service/ticketService');
const ticketSystemsService = require('../service/ticketSystemsService');
const { isManager } = require('../util/userValidation');
const logger = require("../util/logger");

// submit a ticket
router.post("/", authenticateToken, async (req, res) => {
    logger.info(`Incoming ticketController POST "/" request: ${JSON.stringify(req.body)}`);

    try {
        const { amount, description } = req.body;
        const { id } = req.user;
        const newTicketData = await ticketService.createTicket(amount, description, id);

        return newTicketData
            ? res.status(201).json({message: "Created Ticket: #" + newTicketData.ticket_id})
            : res.status(400).json({message: `Invalid request: ticket not created.`});          
    } catch (err) {
        logger.error(`Error in ticketController POST "/": ${err}`);
    }
});

// get tickets individual employee (with their id) or manager (all tickets)
router.get("/", authenticateToken, async (req, res) => {
    try {
        const { id, username } = req.user; 
        const { status } = req.query;
        logger.info({message: `Incoming ticketController GET "/" request`, user: req.user, status: status});

        const tickets = (await isManager(username))
            ? await ticketSystemsService.getAllTicketsByStatus(status)
            : await ticketService.getAllTicketsByUserIdAndStatus(id, status);

        return tickets
            ? res.status(200).json({message: 'Tickets include:', tickets: tickets})
            : res.status(200).json({message: `There aren't any tickets to display.`});          
    } catch (err) {
        logger.error(`Error in ticketController POST "/": ${err}`);
    }
})

// update ticket status (manager only)
router.patch("/:ticket_id/status", authenticateToken, async (req, res) => {
    logger.info(`Incoming ticketSystemsController PUT "/" request: ${JSON.stringify(req.body)} ${JSON.stringify(req.params)}`);

    try {
        const { ticket_id } = req.params;
        const { status } = req.body;
        const { username } = req.user;

        const updatedTicket = await isManager(username)
            ? await ticketSystemsService.updateTicketStatus(ticket_id, username, status)
            : null;
        
        return updatedTicket 
            ? res.status(200).json({message: 'Ticket has been updated', tickets: updatedTicket.Attributes})
            : res.status(400).json({message: `Invalid request: unable to update status of ticket.`});
    } catch {
        logger.error(`Error in ticketSystemsController PUT "/": ${err}`);
    }
})


module.exports = router;