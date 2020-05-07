import React, {Component} from 'react';

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import './Events.css';

class EventsPage extends Component {
    state = {
        creating: false
    }

    handleCreateEvent = () => {
        this.setState({creating: true});
    }

    handleModalConfirm = () => {
        this.setState({creating: false});
    };

    handleModalCancel = () => {
        this.setState({creating: false});
    };

    render() {
        return (
            <React.Fragment>
                {this.state.creating && <Backdrop/>}
                {this.state.creating && <Modal
                    title='Add Event'
                    canCancel
                    canConfirm
                    onConfirm={this.handleModalConfirm}
                    onCancel={this.handleModalCancel}
                >
                    Loremus Ipsimus
                </Modal>
                }

                <h1>Events Control Panel</h1>
                <div className='events-control'>
                    <p>Design an Event</p>
                    <button className='btn' onClick={this.handleCreateEvent}>Create Event</button>
                </div>
            </React.Fragment>

        );
    }
}

export default EventsPage;