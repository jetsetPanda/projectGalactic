const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql'); // used in place where express expects middleware func
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

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
            return globalEvents;
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.inputArg.title,
                description: args.inputArg.description,
                price: +args.inputArg.price, //converted to float
                date: args.inputArg.date//new Date().toISOString()
            };
            globalEvents.push(event);
            return event;
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@upgalactic-b8cic.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`).then(() => { app.listen(3000); }).catch(err => { console.log(err); });
