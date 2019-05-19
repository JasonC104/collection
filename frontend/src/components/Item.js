import React from 'react';
import ItemModal from './ItemModal';
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
		return (
			<div>
				<div className='item' onClick={() => this.showModal()}>
					<img className='item-pic' src={this.props.item.imageUrl} alt={this.props.item.title} />
					<div className='item-summary'>
						<p>{this.props.item.title}</p>
					</div>
				</div>
				<ItemModal active={this.state.showModal} item={this.props.item} deleteItem={(i) => this.props.deleteItem(i)}
					closeModal={() => this.closeModal()} />
			</div>
		);
	}
}

export default Item;
