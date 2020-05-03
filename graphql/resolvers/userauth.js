const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserMGS = require('../../models/user');

module.exports = { //note: resolver functions should match to schema names
    createUser: async args => {
        try {
            const userExists = await UserMGS.findOne({ email: args.userArg.email });
            if (userExists) {
                throw new Error('User already created.');
            }
            const hashedPassword = await bcrypt.hash(args.userArg.password, 12);

            const createdUser = new UserMGS({
                username: args.userArg.username,
                email: args.userArg.email,
                password: hashedPassword,
            });

            const result = await createdUser.save();
            return {
                ...result._doc,
                password: null,
                _id: result.id
            };

        } catch (err) {
            throw err;
        }
    },
    login: async ({email, password}) => { // destruct fr args
        try {
            const loggedUser = await UserMGS.findOne({ email: email });
            //todo: merge auth errors below w general msg
            if (!loggedUser) {
                throw new Error('Auth Error: User does not exist.');
            }
            const authMatch = await bcrypt.compare(password, loggedUser.password);

            if (!authMatch) {
                throw new Error('Auth Error: Invalid password.')
            }

            const token = jwt.sign({ // maken einen token
                userId: loggedUser.id,
                email: loggedUser.email
            },
            'secrethashprivatekeyalsoreplaceinserver',
            {expiresIn: '1h'},
            );

            return {
                userId: loggedUser.id,
                token: token,
                tokenExpiration: 1
            }

        } catch (err) {
            throw err;
        }

    }
};
