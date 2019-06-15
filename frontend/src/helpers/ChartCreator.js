import { BarWidget, PieWidget } from '../widgets';

export function createWidgetData(dataset, chartType, attribute, handleClick) {
	switch (chartType) {
		case 'PieWidget':
			return createPieWidgetData(dataset, attribute, handleClick);
			//break;
		case 'BarWidget':
			break;
		default:
	}
}

export function createPieWidgetData(dataset, attribute, handleClick) {
	// group the data set by the attribute and then transform each group to the wanted format
	const widgetData = Object.entries(groupBy(dataset, i => i[attribute]))
		.map(entry => {
			const [key, groupedItems] = entry;
			return { label: key, value: groupedItems.length, items: groupedItems };
		});

	return {
		type: PieWidget,
		props: {
			data: [widgetData],
			onClick: handleClick
		}
	}
}

export function groupBy(collection, groupFunction) {
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
