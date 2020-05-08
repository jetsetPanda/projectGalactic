import React, {Component} from 'react';
// import {TrinityRingsSpinner} from "react-epic-spinners";
import DotSpinner from "../components/Spinners/DotSpinner";

import Modal from "../components/Modal";
import Backdrop from "../components/Backdrop";
import EventList from "../components/Events/EventList";
import AuthContext from "../context/AuthContext";
import './Events.css';

class EventsPage extends Component {
    state = {
        isLoading: true,
        creating: false,
        eventsList: []
    };

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleRef = React.createRef();
        this.priceRef = React.createRef();
        this.dateRef = React.createRef();
        this.descRef = React.createRef();
    }

    componentDidMount() {
        this.fetchEvents();
    }

    handleCreateEvent = () => {
        this.setState({creating: true});
    };

    handleModalConfirm = () => {
        this.setState({creating: false});
        const title = this.titleRef.current.value;
        const price = +this.priceRef.current.value; // conv str to num
        const date = this.dateRef.current.value.toString();
        const description = this.descRef.current.value;


        if (
            title.trim().length === 0 ||
            price <= 0 ||
            date.trim().length === 0 ||
            description.trim().length === 0
        ) {
            return;
        }

        //below: ESNext, same key/val shorthand:
        const event = {title, price, date, description};
        console.log('event: ', event);

        const requestBody = {
            query: `
                mutation {
                    createEvent(
                        eventArg: {
                          title: "${title}"
                          description: "${description}"
                          date: "${date}"
                          price: ${price}
                    }) {
                      _id
                      title
                      date
                      price
                      description
                    }
                
                }
            `
        };

        const token = this.context.token;

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Req Failed.');
            }
            return res.json();
        }).then(resData => {
            this.setState(prevState => {
                let {createEvent} = resData.data;
                const updatedEventsList = [...prevState.eventsList];
                updatedEventsList.push({
                    _id: createEvent._id,
                    title: createEvent.title,
                    date: createEvent.date,
                    price: createEvent.price,
                    description: createEvent.description,
                    creator:  {
                        _id: this.context.userId
                    }
                });
                return {eventsList : updatedEventsList}
            })
        }).catch(err => {
            console.log(err)
        });

    };

    handleModalCancel = () => {
        this.setState({creating: false});
    };

    fetchEvents() {
        const requestBody = {
            query: `
                query {
                    events {
                      _id
                      title
                      date
                      price
                      description
                      creator {
                        _id
                        username
                        email
                      }
                    }
                }
            `
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                //below: auth not reqd in query
                // 'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Req Failed.');
            }
            return res.json();
        }).then(resData => {
            console.log(resData);
            const events = resData.data.events;
            this.setState({eventsList: events, isLoading: false });
        }).catch(err => {
            console.log(err);
            this.setState({ isLoading: false });
        });

    }
    render() {
        return (
            <React.Fragment>
                {this.state.creating && <Backdrop/>}
                {this.state.creating && <Modal
                    title='Add New Event'
                    canCancel
                    canConfirm
                    onConfirm={this.handleModalConfirm}
                    onCancel={this.handleModalCancel}
                >
                    <h5>Enter Event Fields Below</h5>
                    <form>
                        <div className="form-item">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={this.titleRef}/>
                        </div>
                        <div className="form-item">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" ref={this.priceRef}/>
                        </div>
                        <div className="form-item">
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" id="date" ref={this.dateRef}/>
                        </div>
                        <div className="form-item">
                            <label htmlFor="description">Description</label>
                            <textarea rows="4" id="description" ref={this.descRef}/>
                        </div>
                    </form>
                </Modal>
                }

                <h1>Events </h1>
                {this.context.token && (
                    <div className='events-control'>
                        <p>Control Panel</p>
                        <button className='btn' onClick={this.handleCreateEvent}>Create Event</button>
                    </div>
                )}
                {this.state.isLoading ?
                    <DotSpinner/> :
                    <EventList
                        eventsList={this.state.eventsList}
                        authUserId={this.context.userId}
                    />
                }
            </React.Fragment>

        );
    }
}

export default EventsPage;