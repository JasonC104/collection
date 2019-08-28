import React, { Component } from 'react';
import RGL, { WidthProvider } from "react-grid-layout";
import { Storage, WidgetsApi } from './api';
import { ChartCreator, WidgetCreator } from './helpers';
import { Icon } from './elements';
import { ItemModal, WidgetCreationModal } from './modals';
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


export default class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			layout: [],
			widgetsInfo: [],
			widgetClick: false,
			widgetDrag: false,
			widgets: [],
			modalData: null
		};
	}

	componentDidMount() {
		this.setState({
			layout: Storage.get('layout', []),
			widgetsInfo: Storage.get('widgetsInfo', [])
		}, () => this.calculateWidgetData(this.state.widgetsInfo)
			.then(widgets => this.setState({ widgets }))
		);
	}

	getWidgetOnClick(widgetInfo) {
		const widgetType = widgetInfo['Widget Type'];
		if (widgetType === 'chart') {
			return ids =>
				this.props.getGames({ ids })
					.then(() => this.props.history.push('/games'));
		} else if (widgetType === 'news') {
		} else {
			return item => this.setState({ modalData: { type: 'ItemModal', item, dataSet: widgetInfo['Data Set'] } });
		}
	}

	calculateWidgetData(widgetsInfo) {
		return WidgetsApi.getWidgetsData(widgetsInfo).then(widgetsData => {
			return widgetsData.map(widgetData => {
				const onClick = this.getWidgetOnClick(widgetData);
				switch (widgetData['Widget Type']) {
					case 'chart':
						return ChartCreator.createWidgetData(widgetData, onClick);
					case 'news':
						return null;
					case 'other':
						return WidgetCreator.createItemList(widgetData, onClick);
					default:
						return null;
				}
			});
		});
	}

	onLayoutChange(layout) {
		// Only save the layout changes when there are widgets on the dashboard
		if (this.state.widgets.length !== 0) {
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

	addWidget(widgetInfo, widget) {
		widget.props.onClick = this.getWidgetOnClick(widgetInfo);

		const widgetsInfo = [...this.state.widgetsInfo, widgetInfo];
		const widgets = [...this.state.widgets, widget];

		const newLayout = { i: this.getNextLayoutKey(), ...getWidgetDefaultLayout(widgetInfo) };
		const layout = [...this.state.layout, newLayout];

		Storage.save('layout', layout);
		Storage.save('widgetsInfo', widgetsInfo);
		this.setState({ widgetsInfo, layout, widgets, modalData: null });
	}

	removeWidget(layoutKey, widgetIndex) {
		const layoutIndex = this.state.layout.findIndex(e => e.i === layoutKey);
		const layout = [...this.state.layout];
		layout.splice(layoutIndex, 1);

		const widgets = [...this.state.widgets];
		widgets.splice(widgetIndex, 1);

		const widgetsInfo = [...this.state.widgetsInfo];
		widgetsInfo.splice(widgetIndex, 1);

		Storage.save('layout', layout);
		Storage.save('widgetsInfo', widgetsInfo);
		this.setState({ layout, widgetsInfo, widgets });
	}

	getNextLayoutKey() {
		const currentLayout = this.state.layout;
		if (currentLayout.length === 0) return '0';

		const nextLayoutKey = parseInt(currentLayout[currentLayout.length - 1].i) + 1;
		return nextLayoutKey.toString();
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
		if (this.state.widgets.length !== 0) {
			gridElements = this.state.layout.map((layout, index) => {
				const widgetData = this.state.widgets[index];
				const props = {
					...widgetData.props,
					width: layout.w * 30,
					height: layout.h * 28
				};
				// remove the onClick function if the widget is being dragged
				if (this.state.widgetDrag) props.onClick = () => { };

				return (
					<div key={layout.i} data-grid={layout} className='has-background-light'>
						<p className='title is-6 is-marginless has-text-centered has-default-cursor'>
							{this.state.widgetsInfo[index].Title || ''}
						</p>
						{React.createElement(widgetData.type, props)}
						<button className="widget-delete delete is-small" onClick={() => this.removeWidget(layout.i, index)} />
					</div>
				);
			});
		}

		let modal = null;
		if (this.state.modalData) {
			if (this.state.modalData.type === 'ItemModal')
				modal = <ItemModal item={this.state.modalData.item} schema={getItemModalSchema(this.state.modalData.dataSet)} onUpdate={null} onDelete={null} />;
			else if (this.state.modalData.type === 'WidgetCreationModal')
				modal = <WidgetCreationModal calculateWidgetData={this.calculateWidgetData.bind(this)} addWidget={this.addWidget.bind(this)} />;
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
				<div className='new-item-btn button is-link is-large' onClick={() => this.setState({ modalData: { type: 'WidgetCreationModal' } })}>
					<Icon icon='fas fa-plus fa-lg' />
				</div>
				{modal}
			</div>
		);
	}
}

const gameSchema = [
	{ type: 'text', key: 'summary', label: 'Description', readonly: true },
	{ type: 'list', key: 'genres', label: 'Genres', readonly: true },
	{ type: 'list', key: 'themes', label: 'Themes', readonly: true },
	{ type: 'list', key: 'platforms', label: 'Platforms', readonly: true },
	{ type: 'text', key: 'releaseDate', label: 'Release Date', readonly: true },
];
const movieSchema = [
	{ type: 'text', key: 'summary', label: 'Description', readonly: true },
	{ type: 'list', key: 'genres', label: 'Genres', readonly: true },
	{ type: 'text', key: 'releaseDate', label: 'Release Date', readonly: true },
];
function getItemModalSchema(dataSet) {
	switch (dataSet) {
		case 'games': return gameSchema;
		case 'movies': return movieSchema;
		default: return [];
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
