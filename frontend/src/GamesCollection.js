import React, { useState } from 'react';
import Item from './components/Item2';
import ItemModal from './modals/ItemModal2';
import SearchModal from './modals/SearchModal';
import FormModal from './modals/FormModal';
// import { connect } from 'react-redux';
// import { Actions } from './actions';
// import Item from './components/Item';
// import { ItemCreationModal, ItemModal } from './modals';
import Toolbar from './components/toolbar/Toolbar'
import { GamesApi } from './api';
import { Icon, Steps } from './elements';
import './styles/collection.scss';

export default function GamesCollection(props) {
	const [modalData, setModalData] = useState(null);

	const gameComponents = props.games.map(game =>
		<Item key={game.title} item={game} onClick={() => setModalData({ type: 'ItemModal', item: game })} />
	);

	return (
		<div>
			{/* <Toolbar getGames={() => this.getGames()} /> */}
			<div className='item-group'>
				{gameComponents}
			</div>
			<div className='new-item-btn button is-link is-large' onClick={() => setModalData({ type: 'SearchModal', item: {} })}>
				<Icon icon='fas fa-plus fa-lg' />
			</div>
			{getModal(modalData, setModalData, props.setGames)}
		</div>
	);
}

const gameSchema = [
	{ type: 'text', key: 'summary', label: 'Description', readonly: true },
	{ type: 'list', key: 'genres', label: 'Genres', readonly: true },
	{ type: 'list', key: 'themes', label: 'Themes', readonly: true },
	{ type: 'text', key: 'platform', label: 'Platform', readonly: true },
	{ type: 'money', key: 'cost', label: 'Cost', readonly: true },
	{ type: 'text', key: 'type', label: 'Type', readonly: true },
	{ type: 'text', key: 'purchaseDate', label: 'Purchase Date', readonly: true },
	{ type: 'rating', key: 'rating', label: 'Rating', readonly: false },
	{ type: 'checkbox', key: 'completed', label: 'Completed', readonly: false },
	{ type: 'checkbox', key: 'gift', label: 'Gift', readonly: false },
];
const stepData = [[1, 'Select the game'], [2, 'Fill the form']];
function getFormSchema(platformOptions) {
	return [
		{ type: 'list', key: 'platform', label: 'Platform', options: platformOptions },
		{ type: 'money', key: 'cost', label: 'Cost' },
		{ type: 'radio', key: 'type', label: 'Type', options: ['Physical', 'Digital'] },
		{ type: 'date', key: 'purchaseDate', label: 'Purchase Date' },
		{ type: 'rating', key: 'rating', label: 'Rating' },
		{ type: 'checkbox', key: 'completed', label: 'Completed' },
		{ type: 'checkbox', key: 'gift', label: 'Gift' }
	];
}

function getModal(modalData, setModalData, setGames) {
	const getGames = () => GamesApi.getItems({}, response => setGames(response));
	const createItem = (item) => {
		GamesApi.createItem(item, getGames);
		setModalData(null);
	}
	const updateGame = (e) => {
		const update = { id: modalData.item.id, [e.target.name]: e.target.value };
		GamesApi.updateItem(update, getGames)
		// .then(res => {
		// 	const updatedItem = res.find(m => m.id === modalData.item.id);
		// 	setModalData({ ...modalData, item: updatedItem });
		// });
	}
	const deleteGame = () => {
		GamesApi.deleteItem(modalData.item.id, getGames);
		setModalData(null);
	}
	const searchGame = (searchText) =>
		GamesApi.searchItem(searchText, searchResults => setModalData({ ...modalData, searchResults }));
	const showSearchModal = (item) => setModalData({ ...modalData, type: 'SearchModal', item });
	const showFormModal = (item) => setModalData({ ...modalData, type: 'FormModal', item });

	switch (modalData && modalData.type) {
		case 'ItemModal':
			return <ItemModal item={modalData.item} schema={gameSchema} onUpdate={updateGame} onDelete={deleteGame} />;
		case 'SearchModal':
			return <SearchModal
				title='Create a new entry'
				header={<Steps stepData={stepData} currentStep={0} />}
				itemTitle={modalData.item.title || ''}
				searchResults={modalData.searchResults || []}
				doneSearch={showFormModal}
				search={searchGame}
			/>;
		case 'FormModal':
			return <FormModal
				title='Create a new entry'
				header={<Steps stepData={stepData} currentStep={1} />}
				item={modalData.item}
				schema={getFormSchema(modalData.item.platforms)}
				previousStep={showSearchModal}
				validateItem={validateItem}
				createItem={createItem}
			/>;
		default:
			return;
	}
}

function validateItem(item) {
	if (item.type === undefined || item.type === '') return false;
	if (item.cost === undefined || item.cost === '' || isNaN(item.cost)) return false;
	return true;
}


// class GamesCollection extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = { showModal: false };
// 	}

// 	getGames() {
// 		GamesApi.getItems(this.props.gameRequirements, response => this.props.setGames(response));
// 	}

// 	showModal() {
// 		this.setState({ showModal: true });
// 	}

// 	closeModal() {
// 		this.setState({ showModal: false });
// 	}

// 	toggleDelete() {
// 		GamesApi.deleteItem(this.props.itemModal.item.id, () => this.getGames());
// 		this.props.closeItemModal();
// 	}

// 	updateItem(id, key, value) {
// 		const update = { id, [key]: value };
// 		GamesApi.updateItem(update, () => this.getGames())
// 		// update the item modal with the change otherwise it won't be refreshed
// 		this.props.updateItemModal(update);
// 	}

// 	render() {
// 		// if there are filters/sort/search or filtered games is populated, then get the filtered games, otherwise get all games
// 		const games = (Object.keys(this.props.gameRequirements).length || this.props.filteredGames.length)
// 			? this.props.filteredGames : this.props.games;

// 		const gameComponents = games.map(game =>
// 			<Item key={game.title} item={game} updateItem={(key, value) => this.updateItem(game.id, key, value)} />
// 		);

// 		return (
// 			<div>
// 				<Toolbar getGames={() => this.getGames()} />
// 				<div className='item-group'>
// 					{gameComponents}
// 				</div>
// 				<div className='new-item-btn button is-link is-large' onClick={() => this.showModal()}>
// 					<Icon icon='fas fa-plus fa-lg' />
// 				</div>
// 				<ItemCreationModal active={this.state.showModal} createItem={i => GamesApi.createItem(i, () => this.getGames())}
// 					closeModal={() => this.closeModal()} />
// 				<ItemModal footer={
// 					<TwoClickButton className='is-danger' onClick={() => this.toggleDelete()}>
// 						<Icon icon='fas fa-trash' />
// 					</TwoClickButton>
// 				} />
// 			</div>
// 		);
// 	}
// }

// function mapStateToProps(state) {
// 	return {
// 		gameRequirements: state.itemRequirements.gameRequirements,
// 		filteredGames: state.items.filteredGames,
// 		itemModal: state.modals.itemModal
// 	};
// }

// function mapDispatchToProps(dispatch) {
// 	return {
// 		updateItemModal: (update) => dispatch(Actions.updateItemModal(update)),
// 		closeItemModal: () => dispatch(Actions.closeItemModal()),
// 	};
// }

// export default connect(mapStateToProps, mapDispatchToProps)(GamesCollection);
