import React, { useState } from 'react';
import Item from './components/Item';
import { FormModal, ItemModal, SearchModal } from './modals';
import Toolbar from './components/toolbar/Toolbar'
import { GamesApi } from './api';
import { Icon, Steps } from './elements';
import './styles/collection.scss';

export default function GamesCollection(props) {
	const [modalData, setModalData] = useState(null);

	const getGames = () => props.getGames();

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
			{getModal(modalData, setModalData, getGames)}
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

function getModal(modalData, setModalData, getGames) {
	const createItem = (item) => {
		GamesApi.createItem(item).then(getGames);
		setModalData(null);
	}
	const updateGame = (e) => {
		const update = { id: modalData.item.id, [e.target.name]: e.target.value };
		GamesApi.updateItem(update)
			.then(getGames)
			.then(games => {
				const updatedItem = games.find(m => m.id === modalData.item.id);
				setModalData({ ...modalData, item: updatedItem });
			});
	}
	const deleteGame = () => {
		GamesApi.deleteItem(modalData.item.id).then(getGames);
		setModalData(null);
	}
	const searchGame = (searchText) =>
		GamesApi.searchItem(searchText).then(searchResults => setModalData({ ...modalData, searchResults }));
	const showSearchModal = (item) => setModalData({ ...modalData, type: 'SearchModal', item });
	const showFormModal = (item) => setModalData({ ...modalData, type: 'FormModal', item: { ...item, platform: item.platforms[0] } });

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
