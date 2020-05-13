import React from 'react';
import { Bar as BarChart } from 'react-chartjs-2';

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
    const chartData = {labels: [], datasets: []};
    let values = [];
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
        values.push(filteredBookingsCount);
        chartData.labels.push(param);
        chartData.datasets.push({
            fillColor: "rgba(76,220,14,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: values
        });
        values = [...values];
        values[values.length -1] = 0;
    }
    console.log(chartData);
    return <BarChart data={chartData}/>
};

export default BookingChart;

