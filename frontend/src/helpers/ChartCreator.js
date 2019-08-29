import { BarWidget, PieWidget } from '../widgets';

const COLOURS = ['#07bec3', '#7ff0af', '#ff7c7c', '#ddabff', '#a3ff00'];

export function createWidgetData(widgetData, onClick) {
	const chartType = widgetData['Chart Type'];
	switch (chartType) {
		case 'PieWidget':
			return createPieWidgetData(widgetData, onClick);
		case 'BarWidget':
			return createBarWidgetData(widgetData, onClick);
		default:
			return {};
	}
}

export function createPieWidgetData(widgetData, onClick) {
	return {
		type: PieWidget,
		props: {
			data: [widgetData.data],
			onClick,
			width: 200,
			height: 200
		}
	}
}

export function createBarWidgetData(widgetData, onClick) {
	return {
		type: BarWidget,
		props: {
			data: widgetData.data,
			dataKey: widgetData.datakey,
			colours: COLOURS,
			onClick,
			width: 400,
			height: 200
		}
	}
}
