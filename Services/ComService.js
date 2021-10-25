const { logger } = require('../util/logger');
const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();


const conversation = [];

const MESSAGE_SENT = 'message_sent';


const messages = (parent, args, context) => {
    logger.info(`Rsolving all messages...`);
    return conversation;
}


const sendMessage = (parent, { MessageInput }) => {
    const { from, content } = MessageInput;
    logger.info(`Got MessageInput: ${JSON.stringify(MessageInput)}`);
    const message = { from, content }
    conversation.push(message);
    logger.info(`Sending Messages to all subscribed users...`)
    pubsub.publish(MESSAGE_SENT, { messages: conversation });
    return message;
}

const messagesSub =  (parent, args, context, req) => {
    return pubsub.asyncIterator(MESSAGE_SENT)
}



module.exports = ComService = {
    messages,
    sendMessage,
    messagesSub
}