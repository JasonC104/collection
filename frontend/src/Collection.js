import React, { Component } from 'react';
import axios from 'axios';
import Item from './components/Item';
import './styles/collection.scss';
import ItemCreationModal from './components/itemCreation/ItemCreationModal';

class Collection extends Component {
	constructor(props) {
		super(props);
		this.state = { items, showModal: false };
	}

	componentDidMount() {
		this.getItems();
	}

	getItems() {
		axios.get('http://localhost:3001/api/items').then(response => {
			this.setState({ items: response.data.data });
		});
	}

	showModal() {
		this.setState({ showModal: true });
	}

	closeModal() {
		this.setState({ showModal: false });
	}

	createItem(newItem) {
		axios.post('http://localhost:3001/api/items', newItem)
			.then(() => this.getItems());
	}

	deleteItem(item) {
		axios.delete('http://localhost:3001/api/items', { data: { id: item.id } })
			.then(() => this.getItems());
	}

	render() {
		const itemElements = [];
		for (let item of this.state.items) {
			itemElements.push(<Item key={item.title} item={item} deleteItem={i => this.deleteItem(i)} />);
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
				<ItemCreationModal active={this.state.showModal} createItem={i => this.createItem(i)} closeModal={() => this.closeModal()} />
			</div>
		);
	}
}

export default Collection;
