import React from 'react';
import { connect } from 'react-redux';
import { Actions } from '../actions';
import { Icon } from '../elements';
import 'lazysizes';
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
		{ key: 'gift', label: 'Gift', type: 'checkbox', readonly: false, onChange: props.updateItem },
		{ key: 'summary', label: 'Description', type: 'text' },
		{ key: 'genres', label: 'Genres', type: 'list' },
		{ key: 'themes', label: 'Themes', type: 'list' }
	];

	return (
		<div>
			<div className='item'>
				<img className='lazyload item-pic' data-src={item.image.uniform} src='/apple.png' alt={item.title} title={item.title}
					onClick={() => props.showItemModal(item, modalElements)} />
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
			<Icon key='ps4-icon' icon='fab fa-playstation' title='PS4'/>
		);
	}
	if (item.completed) {
		iconBadges.push(
			<Icon key='completed-icon' className='has-text-success' icon='fas fa-check-circle' title='Completed' />
		);
	}
	if (item.cost === 0) {
		iconBadges.push(
			<Icon key='free-icon' className='has-text-danger' icon='fas fa-tag' title='Free Game!'/>
		);
	}
	if (item.gift) {
		iconBadges.push(
			<Icon key='gift-icon' className='has-text-danger' icon='fas fa-gift' title='Gift'/>
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
