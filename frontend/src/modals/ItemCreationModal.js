import React from 'react';
import ItemCreationSearch from './ItemCreationSearch';
import ItemCreationForm from './ItemCreationForm';
import { Icon, Steps } from '../elements';
import * as ItemApi from '../api/itemApi';
import './styles.scss';

class ItemCreationModal extends React.Component {
	constructor(props) {
		super(props);
		this.initialState = {
			step: 0,
			item: {
				igdbId: 0,
				title: '',
				platform: '',
				cost: '',
				purchaseDate: null,
				type: '',
				rating: 0,
				completed: false,
				gift: false
			},
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
			platform: selectedItem.platforms[0],
			image: selectedItem.image
		}
		this.setState({
			step,
			item,
			platforms: selectedItem.platforms,
		});
	}

	createItem() {
		const newItem = { ...this.state.item };
		newItem.cost = Number(newItem.cost);
		newItem.completed = Boolean(newItem.completed);
		newItem.gift = Boolean(newItem.gift);
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
		if (!this.props.active) return null;

		const item = this.state.item;
		const props = this.props;
		const stepData = [[1, 'Select the game'], [2, 'Complete the form']];

		let modalBody = null;
		let modalButtons = null;
		if (this.state.step === 0) {
			modalBody = <ItemCreationSearch item={item} searchResults={this.state.searchResults} handleChange={(e) => this.handleChange(e)}
				nextStep={(i) => this.goToFormStep(i)} search={() => this.searchItem()} />;
		} else {
			modalBody = <ItemCreationForm item={item} platforms={this.state.platforms}
				handleChange={(e) => this.handleChange(e)} />;
			const enableSave = validateItem(item);
			modalButtons = (
				<div>
					<button className='button is-danger' onClick={() => this.goToPreviousStep()}>
						Back
					</button>
					<button className='button is-success' disabled={!enableSave} onClick={() => this.createItem()}>
						<Icon icon='fas fa-save' />
					</button>
				</div>
			);
		}

		return (
			<div className='modal is-active'>
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

function validateItem(item) {
	if (item.title === '') return false;
	if (item.platform === '') return false;
	if (item.type === '') return false;
	if (item.cost === '' || isNaN(item.cost)) return false;
	if (item.purchaseDate === null) return false;
	if (item.igdbId === 0) return false;
	return true;
}

export default ItemCreationModal;
