import React from 'react';
import {
    BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip
} from 'recharts';

function BarWidget(props) {
    const bar = [];
    props.dataKey.forEach((key, index) => {
        bar.push(
            <Bar key={key} dataKey={key} stackId='a' fill={props.colours[index]}
                onClick={data => props.onClick(data.items[key])} isAnimationActive={false} />
        );
    });

    return (
        <BarChart width={props.width} height={props.height} data={props.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            {bar}
        </BarChart>
    );
}

export default BarWidget;
