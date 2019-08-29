import React from 'react';
import { Icon } from '../elements';
import 'lazysizes';
import './styles/item.scss';

export default function Item(props) {
	const item = props.item;
	return (
		<div className='item'>
			<img className='lazyload item-pic' data-src={item.image.uniform} src='/apple.png' alt={item.title} title={item.title}
				onClick={props.onClick} />
			<div className='item-summary'>
				{getBadges(item)}
			</div>
		</div>
	);
}

function getBadges(item) {
	const iconBadges = [];
	if (item.platform === 'PS4') {
		iconBadges.push(
			<Icon key='ps4-icon' icon='fab fa-playstation' title='PS4' />
		);
	}
	if (item.completed) {
		iconBadges.push(
			<Icon key='completed-icon' className='has-text-success' icon='fas fa-check-circle' title='Completed' />
		);
	}
	if (item.cost === 0) {
		iconBadges.push(
			<Icon key='free-icon' className='has-text-danger' icon='fas fa-tag' title='Free Game!' />
		);
	}
	if (item.gift) {
		iconBadges.push(
			<Icon key='gift-icon' className='has-text-danger' icon='fas fa-gift' title='Gift' />
		);
	}
	return iconBadges;
}
