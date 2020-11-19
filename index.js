require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req })
});

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("✅ MongoDB Connected");
        return server.listen({ port: 5000 })
    })
    .then(res => {
        console.log("✅ Server running on url " + res.url)
    }).catch(err => {
        console.error(err)
    })


