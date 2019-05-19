import React from 'react';
import './styles/itemModal.scss';

function ItemModal(props) {
	const modalClass = props.active ? 'modal is-active' : 'modal';
	const item = props.item;
	return (
		<div className={modalClass}>
			<div className='modal-background' onClick={() => props.closeModal()} />
			<div className='modal-card'>
				<header className='modal-card-head'>
					<p className='modal-card-title'>{item.title}</p>
					<button className='delete' onClick={() => props.closeModal()} />
				</header>
				<section className='modal-card-body is-flex'>
					<img className='modal-pic' src={item.imageUrl} alt={item.title} />
					<div className='modal-summary'>
						<p>{item.platform}</p>
						<p>${item.cost}</p>
						<p>{item.rating} stars</p>
					</div>
				</section>
				<footer className='modal-card-foot is-flex-end'>
					<button className='button is-success'>
						<span className='icon'>
							<i className='fas fa-edit' />
						</span>
					</button>
					<button className='button is-danger' onClick={() => deleteItem(props)}>
						<span className='icon'>
							<i className='fas fa-trash' />
						</span>
					</button>
				</footer>
			</div>
		</div>
	);
}

function deleteItem(props) {
	props.deleteItem(props.item);
	props.closeModal();
}

export default ItemModal;
