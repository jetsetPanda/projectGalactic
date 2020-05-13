import React from 'react';

import './BookingList.css';

const BookingList = props => (
    <ul className="booking-list">
        {props.bookingsList.map(booking => {
            return (
                <li className="booking-item" key={booking._id}>
                    <div className="booking-item-data">
                        <h1>{booking.event.title}</h1>
                        <h2>{booking.event.price} | {new Date(booking.event.date).toLocaleDateString()}</h2>
                    </div>
                    <div className="booking-item-actions">
                        <button className="btn-cxl" onClick={props.onDelete.bind(this, booking._id)}>Cancel</button>
                    </div>
                </li>
            )
        })}
    </ul>
);

export default BookingList;
