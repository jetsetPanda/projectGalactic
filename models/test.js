// //gql queries
// query {
//     login(email:"echidna@sonic.com", password:"sekretz"){
//         userId
//         token
//         tokenExpiration
//     }
// }
//
// # mutation {
//     #   cancelBooking(bookingId:"5eadfd87988f9855948c380e") {
//         #     title
//         #     creator {
//             #       username
//             #       email
//             #     }
//         #   }
//     # }
//
//
// # query {
//     #   bookings {
//         #     _id
//         #     createdAt
//         #     event {
//             #       title
//             #       creator {
//                 #         email
//                 #       }
//             #     }
//         #   }
//     # }
//
// #
//
// # mutation {
//     #   createBooking(eventId:"5ead00591415461c4c7edb88") {
//         #     _id
//         #     createdAt
//         #     user{
//             #       email
//             #     }
//         #   }
//     # }
//
//
// # mutation {
//     #   # createUser(userArg:{username:"knuckles", email:"echidna@sonic.com", password:"sekretz"}) {
//         #   # _id
//         #   #   username
//         #   #   email
//         #   #   password
//         #   # }
//     # }
//
// # mutation {
//     #   createEvent(eventArg:{title:"Fhloston Paradise", description:"hosted by MC Ruby Rod", price:39789.33, date:"2081-05-02T05:43:05.194Z"
//         #   }) {
//         #     title
//         #     creator{
//             #       email
//             #     }
//         #   }
//     # }
//
// # query{
//     #   events{
//         #     _id
//         #     title
//         #     description
//         #     creator{
//             #       username
//             #       createdEvents {
//                 #         title
//                 #       }
//             #     }
//         #   }
//
//     # }
//
// # mutation {
//     #   createBooking(eventId:"5ead00591415461c4c7edb88") {
//         #     _id
//         #     createdAt
//         #     user{
//             #       username
//             #       email
//             #       createdEvents {
//                 #         title
//                 #         description
//                 #       }
//             #     }
//         #   }
//     # }
//
// # query {
//     #   bookings {
//         #     event {
//             #       title
//             #       description
//             #       creator {
//                 #         username
//                 #         password
//                 #       }
//             #       date
//             #     }
//         #     user {
//             #       username
//             #       password
//             #     }
//         #     createdAt
//         #     updatedAt
//         #   }
//     # }
//
// #  query {
//     #   events {
//         #     title
//         #     date
//         #     creator {
//             #     	username
//             #       email
//             #       createdEvents {
//                 #         title
//                 #         date
//                 #         description
//                 #         _id
//                 #       }
//             #     }
//         #   }
//     # }
//
// # mutation {
//     #   createEvent(eventArg:{title:"Sedetious Experiment", description:"waldenhurst ich einen", price:233.51, date:"2025-05-02T05:43:05.194Z"
//         #   }){
//         #     title
//         #     description
//         #     date
//         #     creator {
//             #       email
//             #       createdEvents {
//                 #         title
//                 #         creator {
//                     #           email
//                     #         }
//                 #       }
//             #     }
//         #   }
//     # }
//
// # query {
//     #   events {
//         #     title
//         #     creator{
//             #       email
//             #     }
//         #   }
//     # }
//
// # createUser(userArg: {username: "robotnik", email:"villain@sonic.com", password:"s3cretC0d3"}){
//     #   email
//     #   password
//     # }
// # }
//
// # query {
//     #   events {
//         # 		creator {
//             # 			email
//             #       createdEvents {
//                 #         title
//                 #         creator {
//                     #           email
//                     #         }
//                 #       }
//             #     }
//         #   }
//     # }