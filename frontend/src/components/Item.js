import React from 'react';
import { connect } from 'react-redux';
import { Actions } from '../actions';
import { gameImageResize } from '../helpers';
import { Icon } from '../elements';
import './styles/item.scss';

function Item(props) {
	const item = props.item;
	const modalElements = [
		{ key: 'platform', label: 'Platform', type: 'text' },
		{ key: 'cost', label: 'Cost', type: 'money' },
		{ key: 'type', label: 'Type', type: 'text' },
		{ key: 'purchaseDate', label: 'Purchase Date', type: 'text' },
		{ key: 'rating', label: 'Rating', type: 'rating', readonly: false, onChange: props.updateItem },
		{ key: 'completed', label: 'Completed', type: 'checkbox', readonly: false, onChange: props.updateItem },
		{ key: 'gift', label: 'Gift', type: 'checkbox', readonly: false, onChange: props.updateItem }
	];

	return (
		<div>
			<div className='item' onClick={() => props.showItemModal(item, modalElements)}>
				<img className='item-pic' src={item.image.uniform} alt={item.title} title={item.title} />
				<div className='item-summary'>
					{getBadges(item)}
				</div>
			</div>
		</div>
	);
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

function mapDispatchToProps(dispatch) {
	return {
		showItemModal: (item, elements) => dispatch(Actions.showItemModal(item, elements)),
	};
}

export default connect(null, mapDispatchToProps)(Item);
