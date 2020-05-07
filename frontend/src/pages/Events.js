import React, {Component} from 'react';

import Modal from "../components/Modal/Modal";
import './Events.css';

class EventsPage extends Component {
    render() {
        return (
            <React.Fragment>
                <Modal>
                    Modals
                </Modal>
                <h1>Events Control Panel</h1>
                <div className='events-control'>
                    <p>Design an Event</p>
                    <button className='btn'>Create Event</button>
                </div>
            </React.Fragment>

        );
    }
}

export default EventsPage;