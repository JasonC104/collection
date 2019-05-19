import React, { Component } from 'react';
import axios from 'axios';
import Item from './components/Item';
import './collection.scss';
import ItemCreationModal from './components/ItemCreationModal';

class Collection extends Component {
	constructor(props) {
		super(props);
		const items = [
			// { title: 'Uncharted 4', platform: 'PS4', cost: 20, rating: '5/5', imageHash: 'zvkdiv2dze8tcit6bzza' },
			// { title: 'God of War', platform: 'PS4', cost: 60, rating: '4/5', imageHash: 'cintjlnx6o8qyqtcnajl' },
			// { title: 'Horizon Zero Dawn', platform: 'PS4', cost: 20, rating: '3/5', imageHash: 'cintjlnx6o8qyqtcnajl' },
			// { title: 'Persona 5', platform: 'PS4', cost: 50, rating: '4/5', imageHash: 'cintjlnx6o8qyqtcnajl' }
		];
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
		axios.post('http://localhost:3001/api/items', newItem).then(_ => this.getItems());

		// const items = this.state.items;
		// items.push(newItem);
		// this.setState({ items });
	}

	deleteItem(item) {
		const index = this.state.items.findIndex(i => i.title === item.title);
		const items = this.state.items;
		items.splice(index, 1);
		this.setState({ items });
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
