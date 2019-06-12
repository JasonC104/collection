import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Actions } from './actions';
import Item from './components/Item';
import { ItemCreationModal } from './modals';
import Toolbar from './components/toolbar/Toolbar'
import * as ItemApi from './api/itemApi';
import { Icon } from './elements';
import './styles/collection.scss';

class GamesCollection extends Component {
	constructor(props) {
		super(props);
		this.state = { showModal: false };
	}

	getGames() {
		ItemApi.getItems(this.props.gameRequirements, response => {
			this.props.setGames(response.data);
		});
	}

	showModal() {
		this.setState({ showModal: true });
	}

	closeModal() {
		this.setState({ showModal: false });
	}

	render() {
		const gameElements = [];
		for (let game of this.props.games) {
			gameElements.push(
				<Item key={game.title} item={game} deleteItem={i => ItemApi.deleteItem(i.id, () => this.getGames())} />
			);
		}

		return (
			<div>
				<Toolbar getGames={() => this.getGames()} />
				<div className='item-group'>
					{gameElements}
				</div>
				<div className='new-item-btn button is-link is-large' onClick={() => this.showModal()}>
					<Icon icon='fas fa-plus fa-lg' />
				</div>
				<ItemCreationModal active={this.state.showModal} createItem={i => ItemApi.createItem(i, () => this.getGames())}
					closeModal={() => this.closeModal()} />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		gameRequirements: state.gameRequirements,
		games: state.items.filteredGames
	};
}

function mapDispatchToProps(dispatch) {
	return {
		setGames: (games) => dispatch(Actions.setGames(games))
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(GamesCollection);
