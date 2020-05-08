import React from 'react';

import EventItem from "../EventItem";
import './EventList.css';

const EventList = props => {
    const eventOutput = props.eventsList.map(event => {
        return <EventItem key={event._id} eventId={event._id} event={event} cUser={props.authUserId}/>
    });

    return (
            <ul className="events-list">
                {eventOutput}
            </ul>
    );

};

export default EventList;