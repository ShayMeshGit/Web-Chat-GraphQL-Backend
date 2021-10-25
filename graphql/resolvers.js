const {
    user,
    signup,
    login
} = require('../Services/AuthService');

const {
    messages,
    sendMessage,
    messagesSub
} = require('../Services/ComService');



const resolvers = {

    Query: {
        user,
        messages,
    },
    Mutation: {
        sendMessage,
        login,
        signup
    },
    Subscription: {
        messages: {
            subscribe: messagesSub
        }
    }

}

module.exports = resolvers;