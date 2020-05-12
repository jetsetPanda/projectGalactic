//mergers --

const DataLoader = require('dataloader');

const EventMGS = require('../../models/event');
const UserMGS = require('../../models/user');
const { dateHelper } = require('../../helpers/index');

const eventLoader = new DataLoader((eventIds) => {
    return getEvents(eventIds);
});

const userLoader = new DataLoader((userIds) => {
    return  UserMGS.find({ _id: { $in: userIds } });
});

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
        event: getSingleEvent.bind(this, bookingObj._doc.event),
        createdAt: dateHelper(bookingObj._doc.createdAt),
        updatedAt: dateHelper(bookingObj._doc.updatedAt)
    }
};

//
// const transformUser = userObj => {
//     return {
//         ...user._doc,
//         _id: user.id,
//         password: "hashed", //ako ra remove
//         //below: summons function upon graphQL query
//         createdEvents: eventLoader.loadMany.bind(this, user._doc.createdEvents)
//     };
// }

const getEvents = async eventIds => { //args: array
    try {
        const events = await EventMGS.find({ _id: { $in: eventIds } }); //mgse query to look inside args arr
        return events.map(event => {
            return transformEvent(event);
        });
    } catch(err) {
        throw err;
    }
};

const getSingleEvent = async eventId => {
    try {
        return await eventLoader.load(eventId.toString());
    } catch (err) {
        throw err;
    }
};

const getUser = async userId => {
    try {
        const user = await userLoader.load(userId.toString()); //invoke toStr to bypass proto type error // ids are objs in mdb
        return {
            ...user._doc,
            _id: user.id,
            //password: "hashed", //ako ra remove
            //below: summons function upon graphQL query
            createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
        };
    } catch (err) {
        throw err;
    }
};

// const getUsers = async userIds => {
//     try {
//         const users = await UserMGS.find({ _id: { $in: userId } });
//         return users.map(user => {
//             return transformUser(user);
//         });
//     } catch (err) {
//         throw err;
//     }
// };

// exports.getEventsList = getEventsList;
// exports.getEvent = getSingleEvent;
// exports.getUser = getUser;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;