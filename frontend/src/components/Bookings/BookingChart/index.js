import React from 'react';

const BOOKING_PARAMS = {
    Low: {
        min: 0,
        max: 1000
    },
    Med: {
        min: 1001,
        max: 5000
    },
    High: {
        min: 5000,
        max: 9999999
    },
};

const BookingChart = props => {
    const output = [];
    for (const param in BOOKING_PARAMS) {
        const filteredBookingsCount = props.bookingsList.reduce((prev, currentBkg) => {
            if (
                currentBkg.event.price > BOOKING_PARAMS[param].min &&
                currentBkg.event.price < BOOKING_PARAMS[param].max
            ) {
                return prev + 1;
            } else {
                return prev;
            }
        }, 0);
        output[param] = filteredBookingsCount;
    }
    console.log(output);
    return (
        <div>
            <button className="btn">Chart!</button>
        </div>
    )
};

export default BookingChart;

