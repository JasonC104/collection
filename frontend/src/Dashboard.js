import React, { Component } from 'react';
import { WidthProvider, Responsive } from "react-grid-layout";
import { format, startOfMonth } from 'date-fns';
import { connect } from 'react-redux';
import { Actions } from './actions';
import { getLastMonths, ChartCreator } from './helpers';
import { BarWidget, PieWidget } from './widgets';
import { Icon } from './elements';
import { WidgetCreationModal } from './modals';
import DashboardTest from './DashboardTest';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = { layouts: {}, breakpoint: '', widgets: [], nextLayoutKey: 1, showModal: false };
	}

	getDefaultLayout() {
		return [
			{ i: '1', w: 2, h: 4, x: 0, y: 0, minW: 2, minH: 4 },
			{ i: '2', w: 5, h: 6, x: 0, y: 3, minW: 3, minH: 3 },
			{ i: '3', w: 5, h: 6, x: 0, y: 10, minW: 3, minH: 3 },
			{ i: '4', w: 5, h: 6, x: 0, y: 15, minW: 3, minH: 3 }
		];
	}

	componentDidMount() {
		this.setState({ layouts: { 'lg': this.getDefaultLayout(), 'md': this.getDefaultLayout() }, nextLayoutKey: 5 });
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
		const currentLayout = this.getCurrentLayout();
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

	addWidget(widgetData) {
		const widgets = this.state.widgets;
		widgets.push(widgetData);
		const layouts = { ...this.state.layouts };
		const newLayout = { i: this.state.nextLayoutKey.toString(), w: 2, h: 4, x: 0, y: Infinity, minW: 2, minH: 4 };
		Object.keys(layouts).forEach(key => {
			layouts[key].push(newLayout);
		});
		// TODO try only pushing the new layout to the current breakpoint
		this.setState({ widgets, layouts, nextLayoutKey: this.state.nextLayoutKey + 1 });
	}

	handleClick(data) {
		this.props.setGames(data.items);
		this.props.history.push('/games');
	}

	getCurrentLayout() {
		return this.state.layouts[this.state.breakpoint];
	}

	toggleModal() {
		this.setState({ showModal: !this.state.showModal });
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
			gridElements = this.getCurrentLayout().map((layout, index) => {
				const widget = this.state.widgets[index];
				const props = {
					...widget.props,
					width: layout.w * 100,
					height: layout.h * 34
				};
				return (
					<div key={layout.i} data-grid={layout} className='has-background-light'>
						{React.createElement(widget.type, props)}
					</div>
				);
			});
		}

		return (
			<div>
				<ResponsiveReactGridLayout
					className="layout"
					breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
					cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
					rowHeight={25}
					layouts={layouts}
					//onLayoutChange={(layout, layouts) => this.onLayoutChange(layout, layouts)}
					onResize={(layout, oldItem, newItem) => this.onResize(layout, oldItem, newItem)}
					onBreakpointChange={newBreakpoint => this.onBreakpointChange(newBreakpoint)}
				>
					{gridElements}
				</ResponsiveReactGridLayout>
				<div className='new-item-btn button is-link is-large' onClick={() => this.toggleModal()}>
					<Icon icon='fas fa-plus fa-lg' />
				</div>
				<WidgetCreationModal active={this.state.showModal} addWidget={w => this.addWidget(w)} closeModal={() => this.toggleModal()}/>
			</div>
		);
	}
}

function getWidgetData(games, handleClick) {
	const platformData = Object.entries(ChartCreator.groupBy(games, i => i.platform))
		.map(entry => {
			const [key, groupedItems] = entry;
			return { label: key, value: groupedItems.length, items: groupedItems };
		});

	const gamesByMonth = ChartCreator.groupBy(games, i => startOfMonth(new Date(i.purchaseDate)));
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
		gamesByMonthByPlatform[key] = ChartCreator.groupBy(groupedItems, i => i.platform);
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
