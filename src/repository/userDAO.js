const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const logger = require("../util/logger");

const client = new DynamoDBClient(); // region is default east
const ddbDocClient = DynamoDBDocumentClient.from(client);
const TableName = "users_table";

// get all users 
const getUserByUsername = async (username) => {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#username = :username",
        ExpressionAttributeNames: {"#username" : "username"},
        ExpressionAttributeValues: {":username": username}
    })

    try {
        const data = await ddbDocClient.send(command);
        logger.info(`Data from getUserByUsername in userDAO: ${JSON.stringify(data)}`);
        return data.Items[0];
    } catch (err) {
        logger.error(`Error in getUserByUsername in userDAO: ${err}`);
    }
    return null; 
}

// register a new user 
const registerUser = async (user) => {
    const command = new PutCommand({
        TableName,
        Item: user,
    })

    try {
        const data = await ddbDocClient.send(command);
        logger.info(`Data from registerUser in userDAO: ${JSON.stringify(data)}`);
        return data;
    } catch (err) {
        logger.error(`Error in registerUser in userDAO: ${err}`);
    }
    return null; 
}

module.exports = {
    registerUser,
    getUserByUsername
}

