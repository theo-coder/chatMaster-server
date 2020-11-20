const Server = require('../../models/Server')
const User = require('../../models/User')
const checkAuth = require('../../utils/check-auth')

module.exports = {
    Query: {
        async getServers() {
            try {
                const servers = await Server.find();
                return servers;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getServer(_, { serverId }) {
            try {
                const server = await Server.findById(serverId);
                if (server) {
                    return server
                } else {
                    throw new Error('Server not found')
                }
            } catch (err) {
                throw new Error('Server not found')
            }
        }
    },
    Mutation: {
        async createServer(_, { label }, context) {
            const server = await Server.findOne({ label })
            if (server) {
                throw new Error('Server already exist')
            }
            const user = checkAuth(context)
            const newServer = new Server({
                label,
                creator: {
                    id: user.id,
                    pseudo: user.pseudo
                },
                members: [
                    {
                        id: user.id,
                        pseudo: user.pseudo
                    }
                ]
            })

            const res = await newServer.save()

            return res
        },
        async deleteServer(_, { serverId }, context) {
            const user = checkAuth(context)
            try {
                const server = await Server.findById(serverId)
                await server.delete()
                return 'Server deleted successfuly'
            } catch (err) {
                throw new Error("You must provide a valid server id")
            }
        },
        async addUserToServer(_, { serverId }, context) {
            const user = checkAuth(context)
            try {
                const server = await Server.findById(serverId)

                for (let i = 0; i < server.members.length; i++) {
                    if (user.id === server.members[i].id) {
                        throw new Error('User already in server')
                    }
                }
                await server.members.push({ id: user.id, pseudo: user.pseudo })
                await server.save()

                return 'User added'
            } catch (err) {
                throw new Error(err)
            }
        },
        async deleteUserFromServer(_, { serverId }, context) {
            const user = checkAuth(context)
            try {
                const server = await Server.findById(serverId)

                for (let i = 0; i < server.members.length; i++) {
                    if (user.id === server.members[i].id) {
                        if (server.members.length === 1) {
                            await server.delete()
                            return 'Server deleted, No users left'
                        }
                        await server.members.pull(server.members[i]._id)
                        await server.save()
                        return 'User removed from server'
                    }
                }
                throw new Error("User not in server")
            } catch (err) {
                throw new Error(err)
            }
        }
    }
}