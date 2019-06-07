import React, { Component } from 'react';
import Item from './components/Item';
import { ItemCreationModal } from './modals';
import Toolbar from './components/toolbar/Toolbar'
import * as ItemApi from './api/itemApi';
import { Icon } from './elements';
import './styles/collection.scss';

class GamesCollection extends Component {
	constructor(props) {
		super(props);
		this.state = { itemRequirements: {}, showModal: false };
		this.getItems = this.getItems.bind(this);
	}

	getItems() {
		ItemApi.getItems(this.state.itemRequirements, response => {
			this.props.setItems(response.data);
		});
	}

	changeItemRequirements(newRequirements) {
		this.setState({
			itemRequirements: {
				...this.state.itemRequirements,
				...newRequirements
			}
		}, () => this.getItems());
	}

	showModal() {
		this.setState({ showModal: true });
	}

	closeModal() {
		this.setState({ showModal: false });
	}

	render() {
		const itemElements = [];
		for (let item of this.props.items) {
			itemElements.push(
				<Item key={item.title} item={item} deleteItem={i => ItemApi.deleteItem(i.id, this.getItems)} />
			);
		}

		return (
			<div>
				<Toolbar changeItemRequirements={n => this.changeItemRequirements(n)} />
				<div className='item-group'>{itemElements}</div>
				<div className='new-item-btn button is-link is-large' onClick={() => this.showModal()}>
					<Icon icon='fas fa-plus fa-lg' />
				</div>
				<ItemCreationModal active={this.state.showModal} createItem={i => ItemApi.createItem(i, this.getItems)}
					closeModal={() => this.closeModal()} />
			</div>
		);
	}
}

export default GamesCollection;
