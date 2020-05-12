import React, {Component} from 'react';

import {ScalingSquaresSpinner} from "react-epic-spinners";
import AuthContext from "../context/AuthContext";

import BookingList from "../components/Bookings/BookingList";

class BookingsPage extends Component {
    state = {
        isLoading: false,
        bookingsList: []
    };

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchBookings();
    }

    fetchBookings() {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                query {
                    bookings {
                      _id
                      createdAt
                      event {
                        _id
                        title
                        date
                      }                                         }
                }
            `
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.context.token}`
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Req Failed.');
            }
            return res.json();
        }).then(resData => {
            console.log(resData);
            const bookings = resData.data.bookings;
            this.setState({bookingsList: bookings, isLoading: false });
        }).catch(err => {
            console.log(err);
            this.setState({ isLoading: false });
        });
    }

    handleDeleteBooking = deletingBookingId => {
        this.setState({ isLoading: true });
        const requestBody = {
            query: `
                mutation CancelTheBooking($deletingId: ID!) { 
                    cancelBooking(bookingId: $deletingId ) {
                        title
                        date
                        creator {
                            _id
                            email
                        }
                    }
                }
            `,
            variables: {
                deletingId : deletingBookingId
            }
        };

        fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.context.token}`
            }
        }).then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Req Failed.');
            }
            return res.json();
        }).then(resData => {
            this.setState(prevState => {
                const updatedBookings = prevState.bookingsList.filter(booking => {
                    return booking._id !== deletingBookingId;
                });
                return {bookingsList: updatedBookings, isLoading: false }
            });
        }).catch(err => {
            console.log(err);
            this.setState({ isLoading: false });
        });
    };

    render() {
        return (
            <React.Fragment>
                <div>
                    <h1>My Booked Events</h1>
                {this.state.isLoading ? (
                    <ScalingSquaresSpinner color='purple'/>
                ) : (
                    <BookingList bookingsList={this.state.bookingsList} onDelete={this.handleDeleteBooking}/>
                )}
                </div>
            </React.Fragment>
        );
    }
}

export default BookingsPage;