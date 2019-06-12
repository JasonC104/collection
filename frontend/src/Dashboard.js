import React, { Component } from 'react';
import { differenceInCalendarMonths, format, startOfMonth } from 'date-fns';
import { getLastMonths } from './helpers';
import { BarWidget, PieWidget } from './widgets';
import { CountedSet } from './helpers';
import {
	BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip
} from 'recharts';

class Dashboard extends Component {
	constructor(props) {
		super(props);
	}

	handleClick(data) {
		this.props.setItems(data.items);
		this.props.history.push('/games');
	}

	render() {

		const platformData = Object.entries(groupBy(this.props.items, i => i.platform))
			.map(entry => {
				const [key, groupedItems] = entry;
				return { label: key, value: groupedItems.length };
			});

		const gamesByMonth = groupBy(this.props.items, i => startOfMonth(new Date(i.purchaseDate)));
		const lastMonths = getLastMonths(12).reverse();
		const gamesInLastMonths = lastMonths.map(month => {
			let count = (gamesByMonth[month]) ? gamesByMonth[month].length : 0;
			return { label: format(month, 'MMM'), value: count, items: gamesByMonth[month] };
		});

		const gamesCostInLastMonths = lastMonths.map(month => {
			let cost = 0;
			if (gamesByMonth[month]) {
				cost = gamesByMonth[month].reduce((total, item) => {
					if (item.gift) return total
					else return total + item.cost;
				}, 0);
			}
			return { label: format(month, 'MMM'), spent: cost.toFixed(2), items: gamesByMonth[month]  };
		});

		const gamesByMonthByPlatform = {};
		Object.entries(gamesByMonth).forEach(entry => {
			const [key, groupedItems] = entry;
			gamesByMonthByPlatform[key] = groupBy(groupedItems, i => i.platform);
		});
		const gamesInLastMonthsByPlatform = lastMonths.map(month => {
			const data = { label: format(month, 'MMM'), items: gamesByMonth[month] };
			if (gamesByMonthByPlatform[month]) {
				Object.entries(gamesByMonthByPlatform[month]).forEach(entry => {
					const [key, groupedItems] = entry;
					data[key] = groupedItems.length;
				});
			}
			return data;
		});

		const COLORS = ['#07bec3', '#7ff0af', '#ff7c7c', '#ddabff', '#a3ff00'];

		return (
			<div>
				<PieWidget data={[platformData]} />
				<BarWidget data={gamesInLastMonths} dataKey={['value']} colors={COLORS} onClick={data => this.handleClick(data)} />
				<BarWidget data={gamesInLastMonthsByPlatform} dataKey={['PS4', '3DS']} colors={COLORS} onClick={data => this.handleClick(data)} />
				<BarWidget data={gamesCostInLastMonths} dataKey={['spent']} colors={COLORS} onClick={data => this.handleClick(data)} />
			</div>
		);
	}
}

function groupBy(collection, groupFunction) {
	const result = {};
	collection.forEach(obj => {
		const key = groupFunction(obj);
		if (key in result) {
			result[key].push(obj);
		} else {
			result[key] = [obj];
		}
	});
	return result;
}

export default Dashboard;
