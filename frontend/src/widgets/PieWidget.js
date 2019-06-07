import React from 'react';
import {
    PieChart, Pie, LabelList, Tooltip, Cell
} from 'recharts';

const COLORS = ['#7ff0af', '#07bec3', '#ff7c7c', '#ddabff', '#a3ff00'];
const COLORS2 = ['#04dfff', '#22ff00'];

function PieWidget(props) {

    let secondLayer = null;
    if (props.data[1]) {
        secondLayer =
            <Pie data={props.data[1]} dataKey="value" nameKey="label" innerRadius={20} outerRadius={80}
                isAnimationActive={false} labelLine={false}>
                {props.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS2[index % 2]} />
                ))}
            </Pie>
    }

    return (
        <PieChart width={730} height={250}>
            <Tooltip />
            <Pie data={props.data[0]} dataKey="value" nameKey="label" outerRadius={100}
                isAnimationActive={false} labelLine={false}>
                <LabelList dataKey="label" position="outside" offset={10} />
                {props.data[0].map((entry, index) =>
                    <Cell key={`cell-${index}`} fill={COLORS[index]} stroke={COLORS[index]} />
                )}
            </Pie>
            {secondLayer}
        </PieChart>
    );
}

export default PieWidget;
