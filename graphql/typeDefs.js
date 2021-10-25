const typeDefs =`
    input MessageInputData {
        from: String!
        content: String!
    }

    input LoginInputData {
        email: String!
        password: String!
    }

    input SignupInputData {
        email: String!
        username: String!
        password: String!
    }

    type Message {
        _id: ID!
        from: String!
        content: String!
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        password: String!
    }

    type AuthData {
        token: String!
        userId: ID!
    }

    type Query{
        user(id: ID!): User!
        messages: [Message!]
    }
    
    type Mutation {
        sendMessage(MessageInput: MessageInputData): Message!
        signup(SignupInput: SignupInputData): User!
        login(LoginInput: LoginInputData): AuthData!
    }

    type Subscription {
        messages: [Message!]
    }

    schema {
        query: Query
        mutation: Mutation
        subscription: Subscription
    }

`;

module.exports = typeDefs;