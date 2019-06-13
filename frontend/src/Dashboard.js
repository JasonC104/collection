import React, { Component } from 'react';
import { WidthProvider, Responsive } from "react-grid-layout";
import { format, startOfMonth } from 'date-fns';
import { connect } from 'react-redux';
import { Actions } from './actions';
import { getLastMonths } from './helpers';
import { BarWidget, PieWidget } from './widgets';
import DashboardTest from './DashboardTest';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = { layouts: {}, breakpoint: '', widgets: [] };
	}

	componentDidMount() {
		const layout = [
			{ i: '1', w: 2, h: 2, x: 0, y: 0, minW: 2, minH: 2 },
			{ i: '2', w: 5, h: 5, x: 0, y: 3, minW: 3, minH: 3 },
			{ i: '3', w: 5, h: 5, x: 0, y: 10, minW: 3, minH: 3 },
			{ i: '4', w: 5, h: 5, x: 0, y: 15, minW: 3, minH: 3 }
		];
		this.setState({ layouts: { 'lg': layout, 'md': layout } });
	}

	componentDidUpdate(prevProps) {
		// calculate widget data if data has changed
		if (prevProps.games.length != this.props.games.length) {

			this.setState({ widgets: getWidgetData(this.props.games, data => this.handleClick(data)) });
		}
	}

	// onLayoutChange(layout, layouts) {
	//     this.setState({ layouts });
	// }

	onBreakpointChange(breakpoint) {
		this.setState({ breakpoint });
	}

	onResize(layout, oldItem, newItem) {
		const currentLayout = this.state.layouts[this.state.breakpoint];
		if (currentLayout.h !== newItem.h || currentLayout.w !== newItem.w) {
			console.log(currentLayout, newItem);
			this.setState({
				layouts: {
					...this.state.layouts,
					[this.state.breakpoint]: layout
				}
			});
		}
	}

	handleClick(data) {
		this.props.setGames(data.items);
		this.props.history.push('/games');
	}

	render() {

		// return (
		// 	<div>
		// 		<PieWidget data={[platformData]} />
		// 		<BarWidget data={gamesInLastMonths} dataKey={['value']} colors={COLORS} onClick={data => this.handleClick(data)} />
		// 		<BarWidget data={gamesInLastMonthsByPlatform} dataKey={['PS4', '3DS']} colors={COLORS} onClick={data => this.handleClick(data)} />
		// 		<BarWidget data={gamesCostInLastMonths} dataKey={['spent']} colors={COLORS} onClick={data => this.handleClick(data)} />
		// 	</div>
		// );

		let layouts = {};
		let gridElements = [];
		if (this.state.breakpoint && this.state.widgets.length !== 0) {
			layouts = this.state.layouts
			gridElements = layouts[this.state.breakpoint].map((layout, index) => {
				const widget = this.state.widgets[index];
				const props = {
					...widget.props,
					width: layout.w * 100,
					height: layout.h * 50
				};
				return (
					<div key={layout.i} data-grid={layout}>
						{React.createElement(widget.type, props)}
					</div>
				);
			});
		}

		return (
			<ResponsiveReactGridLayout
				className="layout"
				breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
				cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
				rowHeight={50}
				layouts={layouts}
				//onLayoutChange={(layout, layouts) => this.onLayoutChange(layout, layouts)}
				onResize={(layout, oldItem, newItem) => this.onResize(layout, oldItem, newItem)}
				onBreakpointChange={newBreakpoint => this.onBreakpointChange(newBreakpoint)}
			>
				{/* <div key="1" data-grid={{ w: 2, h: 2, x: 0, y: 0, minW: 2, minH: 2 }}>
                    <PieWidget data={[platformData]} width={width} height={height} />
                </div> */}
				{/* <div key="2" data-grid={{ w: 2, h: 3, x: 0, y: 9 }}>
                    <BarWidget data={gamesInLastMonths} dataKey={['value']} width={500} height={250} colors={COLORS} />
                </div> */}
				{gridElements}
			</ResponsiveReactGridLayout>
		);
	}
}

function getWidgetData(games, handleClick) {
	const platformData = Object.entries(groupBy(games, i => i.platform))
		.map(entry => {
			const [key, groupedItems] = entry;
			return { label: key, value: groupedItems.length, items: groupedItems };
		});

	const gamesByMonth = groupBy(games, i => startOfMonth(new Date(i.purchaseDate)));
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
		return { label: format(month, 'MMM'), spent: cost.toFixed(2), items: gamesByMonth[month] };
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

	const widgets = [
		{
			type: PieWidget,
			props: {
				data: [platformData],
				onClick: handleClick
			}
		},
		{
			type: BarWidget,
			props: {
				data: gamesInLastMonths,
				dataKey: ['value'],
				colors: COLORS,
				onClick: handleClick
			}
		},
		{
			type: BarWidget,
			props: {
				data: gamesInLastMonthsByPlatform,
				dataKey: ['PS4', '3DS'],
				colors: COLORS,
				onClick: handleClick
			}
		},
		{
			type: BarWidget,
			props: {
				data: gamesCostInLastMonths,
				dataKey: ['spent'],
				colors: COLORS,
				onClick: handleClick
			}
		}
	];
	return widgets;
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

function mapStateToProps(state) {
	return {
		games: state.items.games
	};
}

function mapDispatchToProps(dispatch) {
	return {
		setGames: (games) => dispatch(Actions.setFilteredGames(games))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
