import React, { Component } from 'react';
import RGL, { WidthProvider, Responsive } from "react-grid-layout";
import { format, startOfMonth } from 'date-fns';
import { connect } from 'react-redux';
import * as Storage from './api/localStorage';
import { Actions } from './actions';
import { getLastMonths, ChartCreator } from './helpers';
import { BarWidget, PieWidget } from './widgets';
import { Icon } from './elements';
import { WidgetCreationModal } from './modals';
import './styles/dashboard.scss';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = { layout: [], widgetsInfo: [], showModal: false };
	}

	componentDidMount() {
		this.setState({
			layout: Storage.get('layout', []),
			widgetsInfo: Storage.get('widgetsInfo', [])
		});
	}

	componentDidUpdate(prevProps) {
		// calculate widget data if data has changed
		if (this.state.widgetsInfo && prevProps.games.length != this.props.games.length) {
			const widgetsData = this.state.widgetsInfo.map(widgetInfo => {
				const dataset = this.props[widgetInfo['Data Set']];
				return ChartCreator.createWidgetData(dataset, widgetInfo, data => this.handleClick(data));
			});
			this.props.setWidgetsData(widgetsData);
		}
	}

	onLayoutChange(layout) {
		// Only save the layout changes when there are widgets on the dashboard
		if (this.props.widgetsData.length !== 0) {
			Storage.save('layout', layout);
			this.setState({ layout });
		}
	}

	onResize(layout, newItem) {
		// try to only rerender if the layout has changed
		// TODO: since setState is not synchronous, this does not always work
		Storage.save('layout', layout);
		this.setState({ layout });
	}

	addWidget(widgetInfo, widgetData) {
		widgetData.props.onClick = data => this.handleClick(data);
		this.props.addWidgetData(widgetData);

		const widgetsInfo = [...this.state.widgetsInfo];
		widgetsInfo.push(widgetInfo);

		const newLayout = { i: this.getNextLayoutKey(), w: 2, h: 4, x: 0, y: Infinity, minW: 2, minH: 4 };
		const layout = [...this.state.layout, newLayout];

		Storage.save('layout', layout);
		Storage.save('widgetsInfo', widgetsInfo);
		this.setState({ widgetsInfo, layout });
	}

	removeWidget(layoutKey, widgetIndex) {
		const layoutIndex = this.state.layout.findIndex(e => e.i === layoutKey);
		const layout = this.state.layout.splice(layoutIndex, 1);

		this.props.removeWidgetData(widgetIndex);

		const widgetsInfo = [...this.state.widgetsInfo];
		widgetsInfo.splice(widgetIndex, 1);

		Storage.save('layout', layout);
		Storage.save('widgetsInfo', widgetsInfo);
		this.setState({ layout, widgetsInfo });
	}

	handleClick(data) {
		this.props.setGames(data.items);
		this.props.history.push('/games');
	}

	getNextLayoutKey() {
		const currentLayout = this.state.layout;
		if (currentLayout.length === 0) return '0';

		const nextLayoutKey = parseInt(currentLayout[currentLayout.length - 1].i) + 1;
		return nextLayoutKey.toString();
	}

	toggleModal() {
		this.setState({ showModal: !this.state.showModal });
	}

	render() {
		let gridElements = [];
		if (this.props.widgetsData.length !== 0) {
			gridElements = this.state.layout.map((layout, index) => {
				const widgetData = this.props.widgetsData[index];
				const props = {
					...widgetData.props,
					width: layout.w * 100,
					height: layout.h * 34
				};
				return (
					<div key={layout.i} data-grid={layout} className='has-background-light'>
						{React.createElement(widgetData.type, props)}
						<button className="widget-delete delete is-small" onClick={() => this.removeWidget(layout.i, index)} />
					</div>
				);
			});
		}

		return (
			<div>
				<ResponsiveReactGridLayout
					className="layout"
					rowHeight={25}
					layouts={this.state.layout}
					onLayoutChange={(layout) => this.onLayoutChange(layout)}
					onResize={(layout, oldItem, newItem) => this.onResize(layout, newItem)}
				>
					{gridElements}
				</ResponsiveReactGridLayout>
				<div className='new-item-btn button is-link is-large' onClick={() => this.toggleModal()}>
					<Icon icon='fas fa-plus fa-lg' />
				</div>
				<WidgetCreationModal active={this.state.showModal} addWidget={(info, data) => this.addWidget(info, data)}
					closeModal={() => this.toggleModal()} />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		games: state.items.games,
		widgetsData: state.widgetsData
	};
}

function mapDispatchToProps(dispatch) {
	return {
		setGames: games => dispatch(Actions.setFilteredGames(games)),
		addWidgetData: widgetData => dispatch(Actions.addWidgetData(widgetData)),
		setWidgetsData: widgetsData => dispatch(Actions.setWidgetsData(widgetsData)),
		removeWidgetData: index => dispatch(Actions.removeWidgetData(index))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
