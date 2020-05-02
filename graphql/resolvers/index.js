const bcrypt = require('bcryptjs');

const EventMGS = require('../../models/event');
const UserMGS = require('../../models/user');

const getEvents = eventIdPool => {
    return EventMGS.find({ _id: { $in: eventIdPool } })
        .then(events => {
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    //overwrite id & user by hoisting
                    creator: getUser.bind(this, event.creator)
                };
            });
        })
        .catch(err => {
            throw err;
        });
};

const getUser = userId => {
    return UserMGS.findById(userId)
        .then(user => {
            return {
                ...user._doc,
                _id: user.id,
                //below: summons function upon graphQL query
                createdEvents: getEvents.bind(this, user._doc.createdEvents)
            };
        })
        .catch(err=> {
            throw err;
        });
};

module.exports = { //note: resolver functions should match to schema names
    events: () => {
        return EventMGS.find()
            // .populate('creator') //IMPT: finds reference by ref key
            .then(events => {
                return events.map(event => {
                    return {
                        ...event._doc,
                        _id: event.id,
                        date: new Date(event._doc.date).toISOString(),
                        creator: getUser.bind(this, event._doc.creator)
                    };
                });
            })
            .catch(err => {
                throw err;
            }); //mgse constructor methods "all"
    },
        createEvent: (args) => {
    const event = new EventMGS({
        title: args.eventArg.title,
        description: args.eventArg.description,
        price: +args.eventArg.price, //converted to float
        date: new Date(args.eventArg.date),
        creator: '5eacfc356fb89b44e45ea4b2'
    });
    let createdEvent;
    return event
        .save()
        .then(result => {
            createdEvent = {
                ...result._doc,
                _id: result._doc._id.toString(),
                date: new Date(event._doc.date).toISOString(),
                //merging below via graphQL method parser
                creator: getUser.bind(this, result._doc.creator)
            };
            return UserMGS.findById('5eacfc356fb89b44e45ea4b2');
        })
        .then(user=> {
            if (!user) {
                throw new Error('User cannot be found.');
            }
            user.createdEvents.push(event); //mgse method linking to user via schema
            return user.save();
        })
        .then(result => {
            return createdEvent;
        })
        .catch(err => {
            console.log(err);
            throw err;
        }); //mongoose method
},
    createUser: args => {
    return UserMGS.findOne({email: args.userArg.email})
        .then(user=>{
            if (user) {
                throw new Error('User already created.');
            }
            return bcrypt.hash(args.userArg.password, 12)
        })
        .then(hashedPassword => {
            const user = new UserMGS({
                username: args.userArg.username,
                email: args.userArg.email,
                password: hashedPassword,
            });
            return user.save();
        })
        .then(result => {
            return { ...result._doc, password: null };
        })
        .catch(err => {
            throw err;
        });
    }
};