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

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`

        
        type EventFX {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        type UserFX {
            _id: ID!
            username: String
            email: String!
            password: String
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
                .then(events => {
                    return events.map(event => {
                        return { ...event._doc }; // IMPT: no longer necessary
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
                date: new Date(args.eventArg.date)
            });
            return event
                .save()
                .then(result => {
                    console.log(result);
                    return {...result._doc} //property provided by mgse sans metadata (deprecated)
                }).catch(err => {
                    console.log(err);
                    throw err;
                }); //mongoose method
        },
        createUser: (args) => {
            return bcrypt
                .hash(args.userArg.password, 12)
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
