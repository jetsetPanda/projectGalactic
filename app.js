const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql'); // used in place where express expects middleware func
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

// app.get('/', (req, res, next) => {
//     res.send('Hallo Vorld!');
// }) vvvvv sub below

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type RootQueryFX {
            events: [String!]!
        }
        
        type RootMutationFX {
            createEvent(name: String): String
        }
        
        schema {
            query: RootQueryFX
            mutation: RootMutationFX
        }
    `),
    rootValue: {
        events: () => {
            return ['Galactic', 'jetset af', 'The only way to space'];
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    } // points to resolver functions, should match to schema names
}));

app.listen(3000);
