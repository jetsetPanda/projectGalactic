const EventMGS = require('../../models/event');
const { transformEvent } = require('./getters');

module.exports = {
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
    createEvent: async (args, req) => {
        if (!req.withAuth) {
            throw new Error('Error: Not Authenticated');
        }
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
    }
};






