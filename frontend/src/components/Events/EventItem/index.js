import React from 'react';

import './EventItem.css';
import DotSpinner from "../../Spinners/DotSpinner";

const EventItem = props => (
    <li key={props.eventId} className="events-list-item">
        <DotSpinner/>
        <div>
            <h1>{props.event.title}</h1>
            <h2>${props.event.price} | {new Date(props.event.date).toLocaleDateString('us-US')}</h2>
            {/*<p>{props.event.description}</p>*/}
        </div>
        <div>
            {(props.cUser === props.event.creator._id) ?
                <p className='btn'>View Your Event.</p> :
                <button className='btn'>Event Details</button>
            }
        </div>
    </li>
);

export default EventItem;

