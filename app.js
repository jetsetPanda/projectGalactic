const express = require('express');
const bodyParser = require('body-parser');

const graphqlHttp = require('express-graphql'); // used in place where express expects middleware func

const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const withAuth = require('./middleware/withAuth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    // allow every client location allow reqs to api
    res.setHeader('Access-Control-Allow-Origin', '*');
    // control specific reqs sent:
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    // controls type of headers in reqs
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // handle options - block send to graphql
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(withAuth);

app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}));

mongoose
    .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@upgalactic-b8cic.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
    .then(() => {
        app.listen(8000);
    })
    .catch(err => {
        console.log(err);
    });
