import React, { Component } from 'react';
import Item from './components/Item';
import ItemCreationModal from './components/itemCreation/ItemCreationModal';
import * as ItemApi from './api/itemApi';
import './styles/collection.scss';

class Collection extends Component {
	constructor(props) {
		super(props);
		this.state = { items: [], showModal: false };
		this.getItems = this.getItems.bind(this);
	}

	componentDidMount() {
		this.getItems();
	}

	getItems() {
		ItemApi.getItems(response => {
			this.setState({ items: response.data });
		})
	}

	showModal() {
		this.setState({ showModal: true });
	}

	closeModal() {
		this.setState({ showModal: false });
	}

	render() {
		const itemElements = [];
		for (let item of this.state.items) {
			itemElements.push(
				<Item key={item.title} item={item} deleteItem={i => ItemApi.deleteItem(i.id, this.getItems)} />
			);
		}

		return (
			<div className='main'>
				<h1 className='title'>Collection</h1>
				<div className='item-group'>{itemElements}</div>
				<div className='new-item-btn button' onClick={() => this.showModal()}>
					<span className='icon'>
						<i className='fas fa-plus fa-lg' />
					</span>
				</div>
				<ItemCreationModal active={this.state.showModal} createItem={i => ItemApi.createItem(i, this.getItems)}
					closeModal={() => this.closeModal()} />
			</div>
		);
	}
}

export default Collection;
