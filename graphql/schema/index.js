const { buildSchema } = require('graphql');

module.exports = buildSchema(`
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
    `);