const usersResolvers = require('./users')
const messagesResolvers = require('./messages')
const serversResolvers = require('./servers')

module.exports = {
    Query: {
        ...usersResolvers.Query,
        ...serversResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...serversResolvers.Mutation
    }
}