const bcrypt = require('bcryptjs');

const EventMGS = require('../../models/event');
const UserMGS = require('../../models/user');
const BookingMGS = require('../../models/booking');
const { dateHelper } = require('../../helpers/index');

const transformEvent = eventObj => {
    return {
        ...eventObj._doc,
        _id: eventObj.id,
        //overwrite id & user by hoisting
        date: dateHelper(eventObj._doc.date),
        creator: getUser.bind(this, eventObj.creator)
    };
};

const transformBooking = bookingObj => {
    return {
        ...bookingObj._doc,
        _id: bookingObj.id,
        user: getUser.bind(this, bookingObj._doc.user),
        event: getEvent.bind(this, bookingObj._doc.event),
        createdAt: dateHelper(bookingObj._doc.createdAt),
        updatedAt: dateHelper(bookingObj._doc.updatedAt)
    }
};

const getEventsList = async eventIdList => { //args: array
    try {
        const events = await EventMGS.find({ _id: { $in: eventIdList } }); //mgse query to look inside args arr
        return events.map(event => {
            return transformEvent(event);
        });
    } catch(err) {
      throw err;
    }
};

const getEvent = async eventId => {
    try {
        const event = await EventMGS.findById(eventId);
        return transformEvent(event);
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
            password: "hashed", //ako ra remove
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
                return transformEvent(event);
            });
        } catch(err) {
                throw err;
            } //mgse constructor methods "all"
    },
    bookings: async () => {
      try {
          const bookings = await BookingMGS.find();
          return bookings.map(booking => {
              return transformBooking(booking);
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
            createdEvent = transformEvent(result);
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
            return transformBooking(result);
    },
    cancelBooking: async args => {
        try {
            const targetBooking = await BookingMGS.findById(args.bookingId).populate('event');
            const targetEvent = transformEvent(targetBooking.event);
            // return targetBooking.destroy()
            await BookingMGS.deleteOne({ _id: args.bookingId });
            console.log(targetEvent);
            return targetEvent;
        } catch (err) {
            throw err;
        }
    }
};
