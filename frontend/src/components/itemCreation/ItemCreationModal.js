import React from 'react';
import ItemCreationSearch from './ItemCreationSearch';
import ItemCreationForm from './ItemCreationForm';
import Steps from '../Steps';
import * as ItemApi from '../../api/itemApi';
import './itemCreation.scss';

class ItemCreationModal extends React.Component {
	constructor(props) {
		super(props);
		this.initialState = {
			step: 0,
			item: { igdbId: 0, title: '', platform: '', cost: '', rating: '' },
			imageUrl: '',
			platforms: [],
			searchResults: []
		};
		this.state = { ...this.initialState };
	}

	handleChange(e) {
		const { name, value } = e.target;
		const item = Object.assign({}, this.state.item, {
			[name]: value
		});
		this.setState({ item });
	}

	goToPreviousStep() {
		const step = this.state.step - 1;
		this.setState({ step });
	}

	goToFormStep(selectedItem) {
		const step = this.state.step + 1;
		const item = {
			...this.initialState.item,
			igdbId: selectedItem.igdbId,
			title: selectedItem.title,
			platform: selectedItem.platforms[0]
		}
		this.setState({
			step,
			item,
			platforms: selectedItem.platforms,
			imageUrl: selectedItem.imageUrl.replace('t_cover_small', 't_720p')
		});
	}

	createItem() {
		const newItem = { ...this.state.item };
		newItem.cost = Number(newItem.cost);
		this.props.createItem(newItem);
		this.props.closeModal();
		this.setState(this.initialState);
	}

	searchItem() {
		ItemApi.searchItem(this.state.item.title, searchResults => {
			this.setState({ searchResults })
		});
	}

	render() {
		const item = this.state.item;
		const props = this.props;
		const active = props.active ? 'is-active' : '';
		const stepData = [[1, 'Select the game'], [2, 'Complete the form']];

		let modalBody = null;
		let modalButtons = null;
		if (this.state.step === 0) {
			modalBody = <ItemCreationSearch item={item} searchResults={this.state.searchResults} handleChange={(e) => this.handleChange(e)}
				nextStep={(i) => this.goToFormStep(i)} search={() => this.searchItem()} />;
		} else {
			modalBody = <ItemCreationForm item={item} imageUrl={this.state.imageUrl} platforms={this.state.platforms}
				handleChange={(e) => this.handleChange(e)} />;
			const disableSave = Object.values(this.state.item).some(value => value == false);
			modalButtons = (
				<div>
					<button className='button is-danger' onClick={() => this.goToPreviousStep()}>
						Back
					</button>
					<button className='button is-success' disabled={disableSave} onClick={() => this.createItem()}>
						<span className='icon'>
							<i className='fas fa-save' />
						</span>
					</button>
				</div>
			);
		}

		return (
			<div className={'modal ' + active}>
				<div className='modal-background' onClick={() => props.closeModal()} />
				<div className='modal-card' style={{ width: '80%', height: '80%' }}>
					<header className='modal-card-head'>
						<p className='modal-card-title'>Create a new entry</p>
						<div className='item-creation-steps'>
							<Steps className='has-gaps has-width-250' stepData={stepData} currentStep={this.state.step} />
						</div>
						<button className='delete' onClick={() => props.closeModal()} />
					</header>
					<section className='modal-card-body is-flex'>
						{modalBody}
					</section>
					<footer className='modal-card-foot is-flex-end'>
						{modalButtons}
					</footer>
				</div>
			</div>
		);
	}
}

export default ItemCreationModal;
