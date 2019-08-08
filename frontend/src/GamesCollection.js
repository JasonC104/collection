import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from './actions';
import Item from './components/Item';
import { ItemCreationModal, ItemModal } from './modals';
import Toolbar from './components/toolbar/Toolbar'
import { GamesApi } from './api';
import { Icon } from './elements';
import './styles/collection.scss';

class GamesCollection extends Component {
	constructor(props) {
		super(props);
		this.state = { showModal: false, deleteClicked: false };
	}

	getGames() {
		GamesApi.getItems(this.props.gameRequirements, response => this.props.setGames(response));
	}

	showModal() {
		this.setState({ showModal: true });
	}

	closeModal() {
		this.setState({ showModal: false });
	}

	toggleDelete() {
		const deleteClicked = this.state.deleteClicked;
		if (deleteClicked) {
			GamesApi.deleteItem(this.props.itemModal.item.id, () => this.getGames());
			this.props.closeItemModal();
		}
		this.setState({ deleteClicked: !deleteClicked });
	}

	updateItem(id, key, value) {
		const update = { id, [key]: value };
		GamesApi.updateItem(update, () => this.getGames())
		// update the item modal with the change otherwise it won't be refreshed
		this.props.updateItemModal(update);
	}

	render() {
		// if there are filters/sort/search or filtered games is populated, then get the filtered games, otherwise get all games
		const games = (Object.keys(this.props.gameRequirements).length || this.props.filteredGames.length)
			? this.props.filteredGames : this.props.games;

		const gameComponents = games.map(game =>
			<Item key={game.title} item={game} updateItem={(key, value) => this.updateItem(game.id, key, value)} />
		);

		const activeTooltip = this.state.deleteClicked ? 'tooltip' : '';
		const modalButtons = (
			<div>
				<button className={'button is-danger is-tooltip-left ' + activeTooltip}
					data-tooltip='Click again to confirm delete' onClick={() => this.toggleDelete()}>
					<Icon icon='fas fa-trash' />
				</button>
			</div>
		);

		return (
			<div>
				<Toolbar getGames={() => this.getGames()} />
				<div className='item-group'>
					{gameComponents}
				</div>
				<div className='new-item-btn button is-link is-large' onClick={() => this.showModal()}>
					<Icon icon='fas fa-plus fa-lg' />
				</div>
				<ItemCreationModal active={this.state.showModal} createItem={i => GamesApi.createItem(i, () => this.getGames())}
					closeModal={() => this.closeModal()} />
				<ItemModal footer={modalButtons} />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		gameRequirements: state.itemRequirements.gameRequirements,
		filteredGames: state.items.filteredGames,
		itemModal: state.modals.itemModal
	};
}

function mapDispatchToProps(dispatch) {
	return {
		updateItemModal: (update) => dispatch(Actions.updateItemModal(update)),
		closeItemModal: () => dispatch(Actions.closeItemModal()),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(GamesCollection);
