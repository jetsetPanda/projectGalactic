const EventMGS = require('../../models/event');
const UserMGS = require('../../models/user');
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

// exports.getEventsList = getEventsList;
exports.getEvent = getEvent;
exports.getUser = getUser;
exports.transformEvent = transformEvent;