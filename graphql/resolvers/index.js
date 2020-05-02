const bcrypt = require('bcryptjs');

const EventMGS = require('../../models/event');
const UserMGS = require('../../models/user');
const BookingMGS = require('../../models/booking');

const getEventsList = async eventIdPool => { //args: array
    try {
        const events = await EventMGS.find({ _id: { $in: eventIdPool } }); //mgse query to look inside args arr
        return events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                //overwrite id & user by hoisting
                date: new Date(event._doc.date).toISOString(),
                creator: getUser.bind(this, event.creator)
            };
        });
    } catch(err) {
      throw err;
    }
};

const getEvent = async eventId => {
    try {
        const event = await EventMGS.findById(eventId);
        return {
            ...event._doc,
            _id: event.id,
            creator: getUser.bind(this, event.creator)
        };
    } catch (err) {
        throw err;
    }
};

const getUser = async userId => {
    try {
        const user = await UserMGS.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            //below: summons function upon graphQL query
            createdEvents: getEventsList.bind(this, user._doc.createdEvents)
        };
    } catch (err) {
        throw err;
    }
};

//     return UserMGS.findById(userId)
//         .then(user => {
//             return {
//                 ...user._doc,
//                 _id: user.id,
//                 //below: summons function upon graphQL query
//                 createdEvents: getEventsList.bind(this, user._doc.createdEvents)
//             };
//         })
//         .catch(err=> {
//             throw err;
//         });
// };

module.exports = { //note: resolver functions should match to schema names
    events: async () => {
        try {
            const events = await EventMGS.find();
            // .populate('creator') //IMPT: finds reference by ref key
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: getUser.bind(this, event._doc.creator)
                };
            });
        } catch(err) {
                throw err;
            } //mgse constructor methods "all"
    },
    bookings: async () => {
      try {
          const bookings = await BookingMGS.find();
          return bookings.map(booking => {
              return {
                  ...booking._doc,
                  _id: booking.id,
                  user: getUser.bind(this, booking._doc.user),
                  event: getEvent.bind(this, booking._doc.event),
                  createdAt: new Date(booking._doc.createdAt).toISOString(),
                  updatedAt: new Date(booking._doc.updatedAt).toISOString()
                  };
          });

      }  catch(err) {
          throw err;
      }
    },
    createEvent: async args => {
        const event = new EventMGS({
            title: args.eventArg.title,
            description: args.eventArg.description,
            price: +args.eventArg.price, //converted to float
            date: new Date(args.eventArg.date),
            creator: '5ead19fb2a9f056318fce297'
        });
        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = {
                ...result._doc,
                _id: result._doc._id.toString(),
                date: new Date(event._doc.date).toISOString(),
                //merging below via graphQL method parser
                creator: getUser.bind(this, result._doc.creator)
            };
            const eventCreator = await UserMGS.findById('5ead19fb2a9f056318fce297');

            if (!eventCreator) {
                throw new Error('User cannot be found.');
            }
            eventCreator.createdEvents.push(event); //mgse method linking to user via schema
            await eventCreator.save();

            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    createUser: async args => {
        try {
            const userExists = await UserMGS.findOne({ email: args.userArg.email });
            if (userExists) {
                throw new Error('User already created.');
            }
            const hashedPassword = await bcrypt.hash(args.userArg.password, 12);

            const createdUser = new UserMGS({
                username: args.userArg.username,
                email: args.userArg.email,
                password: hashedPassword,
            });

            const result = await createdUser.save();
            return { ...result._doc, password: null, _id: result.id };

        } catch (err) {
            throw err;
        }
    },
    createBooking: async args => {
            const targetEvent = await EventMGS.findOne({ _id: args.eventId });
            const createdBooking = new BookingMGS({
                user: '5ead19fb2a9f056318fce297',
                event: targetEvent
            });

            const result = await createdBooking.save();
            return {
                ...result._doc,
                _id: result.id,
                user: getUser.bind(this, result._doc.user),
                event: getEvent.bind(this, result._doc.event),
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString()
            }
    },
    cancelBooking: async args => {
        try {
            const targetBooking = await BookingMGS.findById(args.bookingId).populate('event');
            const targetEvent = {
                ...targetBooking.event._doc,
                _id: targetBooking.event.id,
                creator: getUser.bind(this, targetBooking.event._doc.creator)
            };
            // return targetBooking.destroy()
            await BookingMGS.deleteOne({ _id: args.bookingId });
            console.log(targetEvent);
            return targetEvent;
        } catch (err) {
            throw err;
        }

    }
};
