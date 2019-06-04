import React from 'react';
import ItemModalSummary from './ItemModalSummary';
import { Icon } from '../elements';
import './styles/itemModal.scss';

class ItemModal extends React.Component {

	constructor(props) {
		super(props);
		this.state = { deleteClicked: false };
	}

	toggleDelete() {
		const deleteClicked = this.state.deleteClicked;
		if (deleteClicked) {
			this.props.deleteItem(this.props.item);
			this.props.closeModal();
		}
		this.setState({ deleteClicked: !deleteClicked });
	}

	render() {
		const props = this.props;
		const activeModal = props.active ? 'is-active' : '';
		const activeTooltip = this.state.deleteClicked ? 'tooltip' : '';
		const item = props.item;
		return (
			<div className={'modal ' + activeModal}>
				<div className='modal-background' onClick={() => props.closeModal()} />
				<div className='modal-card'>
					<header className='modal-card-head'>
						<p className='modal-card-title'></p>
						<button className='delete' onClick={() => props.closeModal()} />
					</header>
					<section className='modal-card-body is-flex'>
						<ItemModalSummary item={item}/>
					</section>
					<footer className='modal-card-foot is-flex-end'>
						<button className='button is-success'>
							<Icon icon='fas fa-edit'/>
						</button>
						<button className={'button is-danger is-tooltip-left ' + activeTooltip}
							data-tooltip='Click again to confirm delete' onClick={() => this.toggleDelete()}>
							<Icon icon='fas fa-trash'/>
						</button>
					</footer>
				</div>
			</div>
		);
	}

}

export default ItemModal;
