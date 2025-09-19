const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand, QueryCommand, PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const logger = require("../util/logger");

const client = new DynamoDBClient(); // can add region if you want to change, it is defaulting to my env variable aws_region: {region: "us-east-1"}
const ddbDocClient = DynamoDBDocumentClient.from(client);
const TableName = "tickets_table";

// get a single ticket
const getTicketById = async (ticket_id) => {
    const command = new GetCommand({
        TableName,
        Key: {ticket_id}
    })
    try {
        const data = await ddbDocClient.send(command);
        logger.info(`Data Item from getTicketById in ticketDAO: ${JSON.stringify(data.Item)}`);
        return data;
    } catch (err) {
        logger.error(`Error in getTicketById in ticketDAO: ${err}`);
    }
    return null;
}

// get all tickets (for an employee)
const getAllTickets = async () => {
    const command = new ScanCommand({
        TableName
    })
    try {
        const data = await ddbDocClient.send(command);
        logger.info(`Data from getAllTickets in ticketDAO: ${JSON.stringify(data)}`);
        return data;
    } catch (err) {
        logger.error(`Error in getAllTickets in ticketDAO: ${err}`);
    }
    return null; 
}

// get all tickets (for an employee)
const getAllTicketsByUserId = async (user_id) => {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#user_id = :user_id",
        ExpressionAttributeNames: {"#user_id" : "user_id"},
        ExpressionAttributeValues: {":user_id": user_id}
    })
    try {
        const data = await ddbDocClient.send(command);
        logger.info(`Data from getAllTicketsByUserId in ticketDAO: ${JSON.stringify(data)}`);
        return data;
    } catch (err) {
        logger.error(`Error in getAllTicketsByUserId in ticketDAO: ${err}`);
    }
    return null; 
}

// get all tickets (for an employee) by id and status
const getAllTicketsByUserIdAndStatus = async (user_id, status) => {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#user_id = :user_id AND #status = :status",
        ExpressionAttributeNames: {
            "#user_id" : "user_id",
            "#status" : "status"
        },
        ExpressionAttributeValues: {
            ":user_id": user_id,
            ":status": status,
        }
    })
    try {
        logger.info({message: "In getAllTicketsByUserIdAndStatus of ticketDAO", user_id: user_id, status: status})
        const data = await ddbDocClient.send(command);
        logger.info(`Data from getAllTicketsByUserIdAndStatus in ticketDAO: ${JSON.stringify(data)}`);
        return data.Items;
    } catch (err) {
        logger.error(`Error in getAllTicketsByUserIdAndStatus in ticketDAO: ${err}`);
    }
    return null; 
}

// this just returns metadata by default but see AWS Options attribute for PutCommand to return createdData
const createTicket = async (ticket) => {
    const command = new PutCommand({
        TableName,
        Item: ticket
    })
    try {
        const data = await ddbDocClient.send(command);
        logger.info(`Data from createTicket in ticketDAO: ${JSON.stringify(data)}`);
        return data;
    } catch (err) {
        logger.error(`Error in createTicket in ticketDAO: ${err}`);
    }
    return null;
}

// get all tickets (for managers)
const getAllTicketsByStatus = async (status) => {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#status = :status",
        ExpressionAttributeNames: {"#status" : "status"},
        ExpressionAttributeValues: {":status": status}
    });
    try {
        const data = await ddbDocClient.send(command);
        logger.info(`Data from getAllPendingTickets in ticketDAO: ${JSON.stringify(data)}`);
        return data;
    } catch (err) {
        logger.error(`Error in getAllPendingTickets in ticketDAO: ${err}`);
    }
    return null;
}

// update a pending ticket status (for managers)
const updateTicketStatusById = async (ticket_id, status, processedAt) => {
    const command = new UpdateCommand({
        TableName,
        Key: {ticket_id},
        UpdateExpression: "SET #status = :statusUpdate, #processedAt = :processedAt", 
        ExpressionAttributeNames: {
            "#status": "status",
            "#processedAt": "processedAt"
        },
        ExpressionAttributeValues: {
            ":statusUpdate": status,
            ":processedAt": processedAt,
        },
        ReturnValues: "ALL_NEW",
    });

    try {
        const data = await ddbDocClient.send(command);
        logger.info(`Data from updateTicketStatusById in ticketDAO: ${JSON.stringify(data)}`);
        return data;
    } catch (err) {
        logger.error(`Error in getAllPendingTickets in ticketDAO: ${err}`);
    }
    return null;
}

module.exports = {
    getTicketById,
    getAllTickets,
    getAllTicketsByUserId,
    getAllTicketsByUserIdAndStatus,
    createTicket,
    getAllTicketsByStatus,
    updateTicketStatusById,
}