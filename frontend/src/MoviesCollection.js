import React, { useState } from 'react';
import Item from './components/Item';
import { ItemModal, SearchModal, FormModal } from './modals';
import Toolbar from './components/toolbar/Toolbar'
import { MoviesApi } from './api';
import { Icon, Steps } from './elements';
import './styles/collection.scss';

export default function MoviesCollection(props) {

	const [modalData, setModalData] = useState(null);

	const movieComponents = props.movies.map(movie =>
		<Item key={movie.title} item={movie} onClick={() => setModalData({ type: 'ItemModal', item: movie })} />
	);

	return (
		<div>
			{/* <Toolbar getGames={() => this.getGames()} /> */}
			<div className='item-group'>
				{movieComponents}
			</div>
			<div className='new-item-btn button is-link is-large' onClick={() => setModalData({ type: 'SearchModal', item: {} })}>
				<Icon icon='fas fa-plus fa-lg' />
			</div>
			{getModal(modalData, setModalData, props.setMovies)}
		</div>
	);
}

const movieSchema = [
	{ type: 'text', key: 'summary', label: 'Description', readonly: true },
	{ type: 'list', key: 'genres', label: 'Genres', readonly: true },
	{ type: 'text', key: 'watchedOnDate', label: 'Watched on Date', readonly: true },
	{ type: 'rating', key: 'rating', label: 'Rating', readonly: false },
];
const movieFormSchema = [
	{ type: 'date', key: 'watchedOnDate', label: 'Watched on' },
	{ type: 'rating', key: 'rating', label: 'Rating' },
];
const stepData = [[1, 'Select the movie'], [2, 'Fill the form']];

function getModal(modalData, setModalData, setMovies) {
	const getMovies = () => MoviesApi.getItems({}, response => setMovies(response));
	const createItem = (item) => {
		MoviesApi.createItem(item, getMovies);
		setModalData(null);
	}
	const updateMovie = (e) => {
		const update = { id: modalData.item.id, [e.target.name]: e.target.value };
		MoviesApi.updateItem(update, getMovies)
		// .then(res => {
		// 	const updatedItem = res.find(m => m.id === modalData.item.id);
		// 	setModalData({ ...modalData, item: updatedItem });
		// });
	}
	const deleteMovie = () => {
		MoviesApi.deleteItem(modalData.item.id, getMovies);
		setModalData(null);
	}
	const searchMovie = (searchText) =>
		MoviesApi.searchItem(searchText, searchResults => setModalData({ ...modalData, searchResults }));
	const showSearchModal = (item) => setModalData({ ...modalData, type: 'SearchModal', item });
	const showFormModal = (item) => setModalData({ ...modalData, type: 'FormModal', item });

	switch (modalData && modalData.type) {
		case 'ItemModal':
			return <ItemModal item={modalData.item} schema={movieSchema} onUpdate={updateMovie} onDelete={deleteMovie} />;
		case 'SearchModal':
			return <SearchModal
				title='Create a new entry'
				header={<Steps stepData={stepData} currentStep={0} />}
				itemTitle={modalData.item.title || ''}
				searchResults={modalData.searchResults || []}
				doneSearch={showFormModal}
				search={searchMovie}
			/>;
		case 'FormModal':
			return <FormModal
				title='Create a new entry'
				header={<Steps stepData={stepData} currentStep={1} />}
				item={modalData.item}
				schema={movieFormSchema}
				previousStep={showSearchModal}
				validateItem={() => true}
				createItem={createItem}
			/>;
		default:
			return;
	}
}
