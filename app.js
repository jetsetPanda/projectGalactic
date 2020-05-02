const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql'); // used in place where express expects middleware func
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const EventFX = require('./models/event');

const app = express();

const globalEvents = []; // global per no db

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type RootQueryFX {
            events: [EventFX!]!
        }
        
        type EventFX {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        type RootMutationFX {
            createEvent(inputArg: EventInput): EventFX
        }
        
        schema {
            query: RootQueryFX
            mutation: RootMutationFX
        }
    `),
    rootValue: { // points to resolver functions, should match to schema names
        events: () => {
            return EventFX.find()
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
            const event = new EventFX({
                title: args.inputArg.title,
                description: args.inputArg.description,
                price: +args.inputArg.price, //converted to float
                date: new Date(args.inputArg.date)
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
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@upgalactic-b8cic.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`).then(() => { app.listen(3000); }).catch(err => { console.log(err); });
