import React, { Component } from 'react';
import Item from './components/Item';
import ItemCreationModal from './components/itemCreation/ItemCreationModal';
import Toolbar from './components/toolbar/Toolbar'
import * as ItemApi from './api/itemApi';
import { Icon } from './elements';
import './styles/collection.scss';

class Collection extends Component {
	constructor(props) {
		super(props);
		this.state = { items: [], itemRequirements: {}, showModal: false };
		this.getItems = this.getItems.bind(this);
	}

	componentDidMount() {
		this.getItems();
	}

	getItems() {
		ItemApi.getItems(this.state.itemRequirements, response => {
			this.setState({ items: response.data });
		})
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
		for (let item of this.state.items) {
			itemElements.push(
				<Item key={item.title} item={item} deleteItem={i => ItemApi.deleteItem(i.id, this.getItems)} />
			);
		}

		return (
			<div className='main'>
				<div className='header'>
					<h1 className='title is-marginless'>Collection</h1>
					<div className="tabs is-boxed">
						<ul>
							<li><a href='/'>Dashboard</a></li>
							<li className="is-active"><a href='/'>Games</a></li>
							<li><a href='/'>Movies</a></li>
						</ul>
					</div>
				</div>
				<Toolbar changeItemRequirements={n => this.changeItemRequirements(n)} />
				<div className='item-group'>{itemElements}</div>
				<div className='new-item-btn button is-link is-large' onClick={() => this.showModal()}>
					<Icon icon='fas fa-plus fa-lg'/>
				</div>
				<ItemCreationModal active={this.state.showModal} createItem={i => ItemApi.createItem(i, this.getItems)}
					closeModal={() => this.closeModal()} />
			</div>
		);
	}
}

export default Collection;
