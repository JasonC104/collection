import React, { Component } from 'react';
import RGL, { WidthProvider } from "react-grid-layout";
import { connect } from 'react-redux';
import { Storage } from './api';
import { Actions } from './actions';
import { ChartCreator, WidgetCreator } from './helpers';
import { Icon } from './elements';
import { WidgetCreationModal, ItemModal } from './modals';
import './styles/dashboard.scss';

const ResponsiveReactGridLayout = WidthProvider(RGL);


function getWidgetDefaultLayout(widgetInfo) {
	let layout = {};
	const widgetType = widgetInfo['Widget Type'];
	if (widgetType === 'chart') {

		const chartType = widgetInfo['Chart Type'];
		if (chartType === 'PieWidget') {
			layout = { w: 5, h: 4, minW: 5, minH: 4 };
		} else if (chartType === 'BarWidget') {
			layout = { w: 8, h: 4, minW: 6, minH: 4 };
		}

	} else if (widgetType === 'news') {
	} else {
		layout = { w: 8, h: 10, minW: 4, minH: 7 };
	}
	return { w: 5, h: 4, x: 0, y: Infinity, minW: 5, minH: 4, ...layout };
}


class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = { layout: [], widgetsInfo: [], showWidgetCreationModal: false, widgetClick: false, widgetDrag: false };
	}

	componentDidMount() {
		this.setState({
			layout: Storage.get('layout', []),
			widgetsInfo: Storage.get('widgetsInfo', [])
		}, () => this.calculateWidgetData());
	}

	componentDidUpdate(prevProps) {
		// calculate widget data if data has changed
		if (this.state.widgetsInfo && prevProps.games.length !== this.props.games.length) {
			this.calculateWidgetData();
		}
	}

	getWidgetOnClick(widgetInfo) {
		const widgetType = widgetInfo['Widget Type'];
		if (widgetType === 'chart') {
			return data => {
				this.props.setGames(data.items);
				this.props.history.push('/games');
			}
		} else if (widgetType === 'news') {
		} else {
			return item => {
				const modalElements = [
					{ key: 'summary', label: 'Description', type: 'text' },
					{ key: 'genres', label: 'Genres', type: 'list' },
					{ key: 'themes', label: 'Themes', type: 'list' },
					{ key: 'platforms', label: 'Platforms', type: 'list' },
					{ key: 'releaseDate', label: 'Release Date', type: 'text' },
				];
				this.props.showItemModal(item, modalElements);
			}
		}
	}

	async calculateWidgetData() {
		if (!this.props.games) return;

		const widgetsData = [];
		for (let widgetInfo of this.state.widgetsInfo) {
			const onClick = this.getWidgetOnClick(widgetInfo);
			if (widgetInfo['Widget Type'] === 'chart') {
				const dataset = this.props[widgetInfo['Data Set']];
				widgetsData.push(ChartCreator.createWidgetData(dataset, widgetInfo, onClick));
			} else if (widgetInfo['Widget Type'] === 'news') {
			} else {
				widgetsData.push(await WidgetCreator.createItemList(widgetInfo, onClick));
			}
		}
		this.props.setWidgetsData(widgetsData);
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
		widgetData.props.onClick = this.getWidgetOnClick(widgetInfo);
		this.props.addWidgetData(widgetData);

		const widgetsInfo = [...this.state.widgetsInfo];
		widgetsInfo.push(widgetInfo);

		const newLayout = { i: this.getNextLayoutKey(), ...getWidgetDefaultLayout(widgetInfo) };
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

	getNextLayoutKey() {
		const currentLayout = this.state.layout;
		if (currentLayout.length === 0) return '0';

		const nextLayoutKey = parseInt(currentLayout[currentLayout.length - 1].i) + 1;
		return nextLayoutKey.toString();
	}

	toggleModal(modal) {
		this.setState({ [modal]: !this.state[modal] });
	}

	startWidgetDrag() {
		if (!this.state.widgetClick) {
			this.setState({ widgetClick: true });
		} else if (!this.state.widgetDrag) {
			this.setState({ widgetDrag: true });
		}
	}

	/**
	 * If we are clicking, we want to reset the state right away. If we do a timeout, 
	 * then there could be the case where the state will attempt to change when we are 
	 * on another page (like if we click a chart)
	 * 
	 * If we are dragging, we want to reset the state after a set time because we do not
	 * want to accidently trigger the widget's onClick function after we stop dragging.
	 */
	stopWidgetDrag() {
		const widgetState = { widgetClick: false, widgetDrag: false };
		if (this.state.widgetDrag) {
			setTimeout(() => this.setState(widgetState), 500);
		} else if (this.state.widgetClick) {
			this.setState(widgetState);
		}
	}

	render() {
		let gridElements = [];
		if (this.props.widgetsData.length !== 0) {
			gridElements = this.state.layout.map((layout, index) => {
				const widgetData = this.props.widgetsData[index];
				const props = {
					...widgetData.props,
					width: layout.w * 30,
					height: layout.h * 28
				};
				// remove the onClick function if the widget is being dragged
				if (this.state.widgetDrag) props.onClick = () => { };

				return (
					<div key={layout.i} data-grid={layout} className='has-background-light'>
						<p className='title is-6 is-marginless has-text-centered has-default-cursor'>{this.state.widgetsInfo[index].Title}</p>
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
					cols={40}
					layouts={this.state.layout}
					onLayoutChange={(layout) => this.onLayoutChange(layout)}
					onResize={(layout, oldItem, newItem) => this.onResize(layout, newItem)}
					onDrag={() => this.startWidgetDrag()}
					onDragStop={() => this.stopWidgetDrag()}
				>
					{gridElements}
				</ResponsiveReactGridLayout>
				<div className='new-item-btn button is-link is-large' onClick={() => this.toggleModal('showWidgetCreationModal')}>
					<Icon icon='fas fa-plus fa-lg' />
				</div>
				<WidgetCreationModal active={this.state.showWidgetCreationModal} games={this.props.games}
					addWidget={(info, data) => this.addWidget(info, data)}
					closeModal={() => this.toggleModal('showWidgetCreationModal')} />
				<ItemModal footer={getItemModalFooter()} />
			</div>
		);
	}
}

function getItemModalFooter() {
	return (
		<div>
			<button className='button is-success'>
				<p>Add to Wishlist</p>
			</button>
		</div>
	);
}

function mapStateToProps(state) {
	return {
		widgetsData: state.widgetsData
	};
}

function mapDispatchToProps(dispatch) {
	return {
		setGames: games => dispatch(Actions.setFilteredGames(games)),
		addWidgetData: widgetData => dispatch(Actions.addWidgetData(widgetData)),
		setWidgetsData: widgetsData => dispatch(Actions.setWidgetsData(widgetsData)),
		removeWidgetData: index => dispatch(Actions.removeWidgetData(index)),
		showItemModal: (item, elements) => dispatch(Actions.showItemModal(item, elements)),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
