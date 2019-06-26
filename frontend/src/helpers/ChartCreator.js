import { BarWidget, PieWidget } from '../widgets';
import { format, startOfMonth } from 'date-fns';
import { getLastMonths } from './';

const COLOURS = ['#07bec3', '#7ff0af', '#ff7c7c', '#ddabff', '#a3ff00'];

export function createWidgetData(dataset, widgetInfo, handleClick) {
	const chartType = widgetInfo['Chart Type'];
	switch (chartType) {
		case 'PieWidget':
			return createPieWidgetData(dataset, widgetInfo['Attribute'], handleClick);
		case 'BarWidget':
			return createBarWidgetData(dataset, widgetInfo, handleClick);
		default:
			return {};
	}
}

export function createPieWidgetData(dataset, attribute, handleClick) {
	// group the data set by the attribute and then transform each group to the wanted format
	const widgetData = Object.entries(groupBy(dataset, attribute, i => i[attribute]))
		.map(entry => {
			const [key, groupedItems] = entry;
			return { label: key, value: groupedItems.length, items: groupedItems };
		});

	return {
		type: PieWidget,
		props: {
			data: [widgetData],
			onClick: handleClick,
			width: 200,
			height: 200
		}
	}
}

export function createBarWidgetData(dataset, widgetInfo, handleClick) {
	const attribute = widgetInfo['Attribute'];
	const xAxis = widgetInfo['X-Axis'];
	let widgetData = [];
	let dataKey = new Set();
	if (xAxis === 'purchaseDate') {
		// group items by their purchase month
		const itemsByMonth = groupBy(dataset, attribute, i => startOfMonth(new Date(i.purchaseDate)));
		// since not all months will be represented, get the last x months
		const duration = widgetInfo['Duration'];
		const lastMonths = getLastMonths(duration).reverse();

		widgetData = lastMonths.map(month => {
			const barData = (itemsByMonth[month]) ? calculateBarData(itemsByMonth[month], attribute) : {};
			Object.keys(barData).forEach(key => dataKey.add(key));
			return { label: format(month, 'MMM'), ...barData, items: itemsByMonth[month] };
		});
	}

	return {
		type: BarWidget,
		props: {
			data: widgetData,
			dataKey: [...dataKey],
			colours: COLOURS,
			onClick: handleClick,
			width: 500,
			height: 200
		}
	}
}

function calculateBarData(dataset, attribute) {
	// if the attribute does not exist, then return the size of the dataset
	if (dataset[0] && dataset[0][attribute]) {
		// if the attribute is a Number type, then return the accumulation,
		// otherwise return the size of the grouped subset
		if (typeof (dataset[0][attribute]) === 'number') {
			const accumulation = dataset.reduce((total, item) => {
				// special case
				if (attribute === 'cost' && item.gift) return total;
				else return total + item[attribute];
			}, 0);
			return { [attribute]: accumulation };
		} else {
			// group the dataset and return the length of each subgroup
			const groupedData = groupBy(dataset, attribute, i => i[attribute]);
			Object.entries(groupedData).forEach(entry => {
				const [key, groupedItems] = entry;
				groupedData[key] = groupedItems.length;
			});
			return groupedData;
		}
	}

	return { [attribute]: dataset.length };
}

export function groupBy(collection, attribute, groupFunction) {
	const result = {};
	collection.forEach(obj => {
		const key = getLabel(groupFunction(obj), attribute);
		if (key in result) {
			result[key].push(obj);
		} else {
			result[key] = [obj];
		}
	});
	return result;
}

function getLabel(key, attribute) {
	if (typeof (key) === 'boolean') {
		if (key) return attribute;
		else return `Not ${attribute}`;
	}
	return key;
}
