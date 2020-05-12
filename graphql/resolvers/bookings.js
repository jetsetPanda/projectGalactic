const BookingMGS = require('../../models/booking');
const EventMGS = require('../../models/event');
const { transformEvent, transformBooking } = require('./getters');

module.exports = { //note: resolver functions should match to schema names
    bookings: async (args, req) => {
        if (!req.withAuth) {
            throw new Error('Error: Not Authenticated');
        }
        try {
            const bookings = await BookingMGS.find({user:req.userId});
            return bookings.map(booking => {
                return transformBooking(booking);
            });

        }  catch(err) {
            throw err;
        }
    },
    createBooking: async (args, req) => {
        if (!req.withAuth) {
            throw new Error('Error: Not Authenticated');
        }
        const targetEvent = await EventMGS.findOne({ _id: args.eventId });
        const createdBooking = new BookingMGS({
            user: req.userId,
            event: targetEvent
        });

        const result = await createdBooking.save();
        return transformBooking(result);
    },
    cancelBooking: async (args, req) => {
        if (!req.withAuth) {
            throw new Error('Error: Not Authenticated');
        }
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



