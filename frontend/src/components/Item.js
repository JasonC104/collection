import React from 'react';
import { ItemModal } from '../modals';
import { Icon } from '../elements';
import './styles/item.scss';

class Item extends React.Component {
	constructor(props) {
		super(props);
		this.state = { showModal: false };
	}

	showModal() {
		this.setState({ showModal: true });
	}

	closeModal() {
		this.setState({ showModal: false });
	}

	render() {
		const item = this.props.item;
		return (
			<div>
				<div className='item' onClick={() => this.showModal()}>
					<img className='item-pic' src={item.imageUrl} alt={item.title} />
					<div className='item-summary'>
						{getBadges(item)}
					</div>
				</div>
				<ItemModal active={this.state.showModal} item={item} deleteItem={(i) => this.props.deleteItem(i)}
					closeModal={() => this.closeModal()} />
			</div>
		);
	}
}

function getBadges(item) {
	const iconBadges = [];
	if (item.platform === 'PS4') {
		iconBadges.push(
			<Icon key='ps4-icon' icon='fab fa-playstation' />
		);
	}
	if (item.completed) {
		iconBadges.push(
			<Icon key='completed-icon' className='has-text-success' icon='fas fa-check-circle' />
		);
	}
	if (item.cost === 0) {
		iconBadges.push(
			<Icon key='free-icon' className='has-text-danger' icon='fas fa-tag' />
		);
	}
	if (item.gift) {
		iconBadges.push(
			<Icon key='gift-icon' className='has-text-danger' icon='fas fa-gift' />
		);
	}
	return iconBadges;
}

export default Item;
