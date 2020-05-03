const BookingMGS = require('../../models/booking');
const EventMGS = require('../../models/event');
const { dateHelper } = require('../../helpers/index');
const { getUser, getEvent } = require('./getters');

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


module.exports = { //note: resolver functions should match to schema names
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



