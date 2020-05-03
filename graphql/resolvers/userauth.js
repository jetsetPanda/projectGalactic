const bcrypt = require('bcryptjs');

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
    }
};
