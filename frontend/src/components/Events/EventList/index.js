import React from 'react';

import EventItem from "../EventItem";
import './EventList.css';

const EventList = props => {
    const eventOutput = props.eventsList.map(event => {
        return <EventItem
            event={event}
            key={event._id}
            eventId={event._id}
            cUser={props.authUserId}
            detailModal={props.onOpenDetailModal}
        />
    });

    return (
            <ul className="events-list">
                {eventOutput}
            </ul>
    );

};

export default EventList;