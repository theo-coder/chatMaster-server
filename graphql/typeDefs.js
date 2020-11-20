const { gql } = require('apollo-server')

module.exports = gql`
    type User{
        id: ID!
        pseudo: String!
        token: String!
        servers: [Server]
    }
    type Server{
        id: ID!
        label: String!
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
        getServers: [Server]
        getServer(serverId: ID!): Server
    }
    type Mutation{
        register(registerInput: RegisterInput): User!
        login(pseudo: String!, password: String!): User!
        deleteUser(userId: ID!): String!
        createServer(label: String!): Server!
        deleteServer(serverId: ID!): String!
        addUserToServer(serverId: ID!): String!
        deleteUserFromServer(serverId: ID!): String!
    }
`