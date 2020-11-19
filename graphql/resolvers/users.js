require('dotenv').config()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

const { validateRegisterInput, validateLoginInput } = require('../../utils/validators')
const checkAuth = require('../../utils/check-auth')
const User = require('../../models/User')

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        pseudo: user.pseudo
    }, process.env.SECRET_KEY, { expiresIn: '1h' })
}

module.exports = {
    Query: {
        async getUsers() {
            try {
                const users = await User.find();
                return users;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getUser(_, { userId }) {
            try {
                const user = await User.findById(userId);
                if (user) {
                    return user
                } else {
                    throw new Error('User not found')
                }
            } catch (err) {
                throw new Error('User not found')
            }
        }
    },
    Mutation: {
        async login(_, { pseudo, password }) {
            const { valid, errors } = validateLoginInput(pseudo, password)
            const user = await User.findOne({ pseudo })

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }
            if (!user) {
                errors.general = 'User not found'
                throw new UserInputError('User not found', { errors })
            }

            const match = await bcrypt.compare(password, user.password)

            if (!match) {
                errors.general = 'Wrong credentials'
                throw new UserInputError('Wrong credentials', { errors })
            }

            const token = generateToken(user)
            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        async register(_, { registerInput: { pseudo, password, confirmPassword } }) {
            // Validate user data
            const { valid, errors } = validateRegisterInput(pseudo, password, confirmPassword)
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }
            // Make sure user doesn't already exist
            const user = await User.findOne({ pseudo })
            if (user) {
                throw new UserInputError('User already exist', {
                    errors: {
                        email: 'This pseudo is taken'
                    }
                })
            }
            // hash password and create auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                pseudo,
                password
            })

            const res = await newUser.save()

            const token = generateToken(res)

            return {
                ...res._doc,
                id: res._id,
                token
            }
        },
        async deleteUser(_, { userId }, context) {
            const user = checkAuth(context)
            try {
                const user = await User.findById(userId)
                await user.delete()
                return 'User deleted successfuly'
            } catch (err) {
                throw new UserInputError("You must provide a valid user id")
            }
        }
    }
}