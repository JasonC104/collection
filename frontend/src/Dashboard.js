import React, { Component } from 'react';
import { differenceInCalendarMonths, format, startOfMonth } from 'date-fns';
import { getLastMonths } from './helpers';
import { BarWidget, PieWidget } from './widgets';
import { CountedSet } from './helpers';

class Dashboard extends Component {
	constructor(props) {
		super(props);
	}

	render() {

		const platformCountedSet = new CountedSet();
		const platformData = [];
		const dateCountedSet = new CountedSet();
		let dateData = getLastMonths(12).reverse();
		this.props.items.forEach(item => {
			platformCountedSet.add(item.platform);

			const purchaseMonth = startOfMonth(new Date(item.purchaseDate));
			if (differenceInCalendarMonths(new Date(), purchaseMonth) < 12) {
				dateCountedSet.add(purchaseMonth);
			}
		});
		for (const [platform, count] of platformCountedSet.entries()) {
			platformData.push({ label: platform, value: count });
		}

		dateData = dateData.map(d => {
			let count = (dateCountedSet.get(d)) ? dateCountedSet.get(d) : 0;
			return { label: format(d, 'MMM'), value: count };
		});

		return (
			<div>
				<PieWidget data={[platformData]} />
				<BarWidget data={dateData} />
			</div>
		);
	}
}

export default Dashboard;
