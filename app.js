const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql'); // used in place where express expects middleware func
const { buildSchema } = require('graphql');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const EventMGS = require('./models/event');
const UserMGS = require('./models/user');

const app = express();

app.use(bodyParser.json());

const getEvents = eventIdPool => {
    return EventMGS.find({_id: {$in: eventIdPool}})
        .then(events => {
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    //overwrite id & user by hoisting
                    creator: getUser.bind(this, event.creator)}
            })
        })
        .catch(err => {
            throw err;
        })
};

const getUser = userID => {
    return UserMGS.findById(userID)
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

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type EventFX {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: UserFX!
        }
        
        type UserFX {
            _id: ID!
            username: String
            email: String!
            password: String
            createdEvents: [EventFX!]
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input UserInput {
            username: String
            email: String!
            password: String!
        }            
        
        type RootQueryFX {
            events: [EventFX!]!
        }
        
        type RootMutationFX {
            createEvent(eventArg: EventInput): EventFX
            createUser(userArg: UserInput): UserFX
        }
        
        schema {
            query: RootQueryFX
            mutation: RootMutationFX
        }
    `),
    rootValue: { // points to resolver functions, should match to schema names
        events: () => {
            return EventMGS.find()
                // .populate('creator') //IMPT: finds reference by ref key
                .then(events => {
                    return events.map(event => {
                        return {
                            ...event._doc,
                            _id: event.id,
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
                    createdEvent = {...result._doc};
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
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@upgalactic-b8cic.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`).then(() => { app.listen(3000); }).catch(err => { console.log(err); });
