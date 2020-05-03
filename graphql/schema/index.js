const { buildSchema } = require('graphql');

module.exports = buildSchema(`
        type BookingFX {
            _id: ID!
            event: EventFX!
            user: UserFX!
            createdAt: String!
            updatedAt: String!
        }
        
        type EventFX {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            category: String
            discount: Boolean
            creator: UserFX!
            
        }
        
        type UserFX {
            _id: ID!
            username: String
            email: String!
            password: String
            createdEvents: [EventFX!]
        
        }
        
        type AuthData {
            userId: ID!
            token: String!
            tokenExpiration: Int!
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
            bookings: [BookingFX!]!
            login(email: String!, password: String!): AuthData!
            
        }
        
        type RootMutationFX {
            createEvent(eventArg: EventInput): EventFX
            createUser(userArg: UserInput): UserFX
            createBooking(eventId: ID!): BookingFX!
            cancelBooking(bookingId: ID!): EventFX!
        }
        
        schema {
            query: RootQueryFX
            mutation: RootMutationFX
        }
    `);