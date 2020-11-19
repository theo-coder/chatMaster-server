const { gql } = require('apollo-server')

module.exports = gql`
    type User{
        id: ID!
        pseudo: String!
        token: String!
    }
    type Server{
        id: ID!
        creator: User!
        members: [User]!
        messages: [Message]!
    }
    type Message{
        id: ID!
        read: Boolean!
        sender: User!
        content: String!
        receiver: Server!
        createdAt: String!
    }

    input RegisterInput{
        pseudo: String!
        password: String!
        confirmPassword: String!
    }

    type Query{
        getMessages: [Message]
        getUsers: [User]
        getUser(userId: ID!): User
    }
    type Mutation{
        register(registerInput: RegisterInput): User!
        login(pseudo: String!, password: String!): User!
        deleteUser(userId: ID!): String!
    }
`