const eventsResolver = require('./events');
const userAuthResolver = require('./userauth');
const bookingsResolver = require('./bookings');

const rootResolver = {
    ...eventsResolver,
    ...userAuthResolver,
    ...bookingsResolver
};

module.exports = rootResolver;