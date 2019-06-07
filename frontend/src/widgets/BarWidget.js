import React from 'react';
import {
    BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip
} from 'recharts';

const COLORS = ['#7ff0af', '#07bec3', '#ff7c7c', '#ddabff', '#a3ff00'];
const COLORS2 = ['#04dfff', '#22ff00'];

function BarWidget(props) {
    return (
        <BarChart width={730} height={250} data={props.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
    );
}

export default BarWidget;
