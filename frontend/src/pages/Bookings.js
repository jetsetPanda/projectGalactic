import React, {Component} from 'react';

import {ScalingSquaresSpinner} from "react-epic-spinners";
import AuthContext from "../context/AuthContext";

import BookingList from "../components/Bookings/BookingList";
import BookingChart from "../components/Bookings/BookingChart";
import TabController from "../components/Bookings/TabController";

class BookingsPage extends Component {
    state = {
        isLoading: false,
        bookingsList: [],
        currentTab: 'list'
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
                        price
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

    handleTabSwitch = newTab => {
        if (newTab === 'list') {
            this.setState({ currentTab: 'list' })
        } else {
            this.setState({ currentTab: 'chart' })
        }
    };

    render() {
        let content = <ScalingSquaresSpinner color='purple'/>;
        if (!this.state.isLoading) {
            content = (
                <React.Fragment>
                    <div>
                        <TabController
                            activeTab={this.state.currentTab}
                            onChange={this.handleTabSwitch}
                        />
                    </div>
                    <div>
                        {this.state.currentTab === 'list' ? (
                            <BookingList
                                bookingsList={this.state.bookingsList}
                                onDelete={this.handleDeleteBooking}
                            />
                        ) : (
                            <BookingChart
                                bookingsList={this.state.bookingsList}
                            />
                        )
                        }

                    </div>
                </React.Fragment>
            );
        }
        return (
            <div>
                    <h1>My Booked Events</h1>
                    <React.Fragment>
                        {content}
                    </React.Fragment>
            </div>
        );
    }
}

export default BookingsPage;