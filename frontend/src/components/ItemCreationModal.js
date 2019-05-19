import React from 'react';
import axios from 'axios';
import FormElement from './FormElement';
import './styles/itemModal.scss';

class ItemCreationModal extends React.Component {
	constructor(props) {
		super(props);
		this.initialState = {
			item: { igdbId: 0, title: '', platform: '', cost: '', rating: '' },
			searchResults: [],
			platforms: []
		};
		this.state = { ...this.initialState };
		this.handleChange = this.handleChange.bind(this);
		this.resetState = this.resetState.bind(this);
		this.createItem = this.createItem.bind(this);
		this.searchItem = this.searchItem.bind(this);
		this.selectTitle = this.selectTitle.bind(this);
	}

	handleChange(e) {
		const { name, value } = e.target;
		const item = Object.assign({}, this.state.item, {
			[name]: value
		});
		this.setState({ item });
	}

	resetState() {
		this.setState({ ...this.initialState });
	}

	createItem() {
		const newItem = this.state.item;
		newItem.cost = Number(newItem.cost);
		this.props.createItem(newItem);
		this.resetState();
		this.props.closeModal();
	}

	searchItem() {
		axios.get(`http://localhost:3001/api/search/${this.state.item.title}`).then(response => {
			this.setState({ ...this.state, searchResults: response.data });
		}).catch(err => console.log(err));
	}

	selectTitle(selected) {
		const item = Object.assign({}, this.state.item, {
			igdbId: selected.igdbId,
			title: selected.title,
			platform: selected.platforms[0],
		});
		this.setState({
			...this.state,
			item,
			platforms: selected.platforms
		});
	}

	render() {
		const props = this.props;
		const item = this.state.item;
		const modalClass = props.active ? 'modal is-active' : 'modal';
		const platformOptions = this.state.platforms.map(p => <option key={p}>{p}</option>);
		return (
			<div className={modalClass}>
				<div className='modal-background' onClick={() => props.closeModal()} />
				<div className='modal-card' style={{ width: '80%', height: '80%' }}>
					<header className='modal-card-head'>
						<p className='modal-card-title'>Create a new entry</p>
						<button className='delete' onClick={() => props.closeModal()} />
					</header>
					<section className='modal-card-body is-flex'>
						<div style={{ width: '500px' }}>

							<FormElement label='Title'>
								<div className='field has-addons'>
									<div className='control'>
										<input name='title' className='input' type='text' placeholder='Name'
											value={item.title} autoComplete="off" onChange={this.handleChange} />
									</div>
									<div className='control'>
										<div className='button is-info' onClick={() => this.searchItem()}>Search</div>
									</div>
								</div>
							</FormElement>

							<FormElement label='Platform'>
								<div className='select'>
									<select name='platform' value={item.platform} onChange={this.handleChange}>
										{platformOptions}
									</select>
								</div>
							</FormElement>

							<FormElement label='Cost'>
								<div className='control has-icons-left'>
									<input name='cost' className='input' type='text' placeholder='0' value={item.cost}
										onChange={this.handleChange} />
									<span className='icon is-left'>
										<i className='fas fa-dollar-sign' />
									</span>
								</div>
							</FormElement>

							<FormElement label='Rating'>
								<div className='control'>
									<input name='rating' className='input' type='text' placeholder='4/5'
										value={item.rating} onChange={this.handleChange} />
								</div>
							</FormElement>
						</div>
						{searchResultsComponent(this.state.searchResults, this.selectTitle)}
					</section>
					<footer className='modal-card-foot is-flex-end'>
						<button className='button is-success' onClick={this.createItem}>
							<span className='icon'>
								<i className='fas fa-save' />
							</span>
						</button>
						<button className='button is-danger' onClick={this.resetState}>
							<span className='icon'>
								<i className='fas fa-trash' />
							</span>
						</button>
					</footer>
				</div>
			</div>
		);
	}
}

function searchResultsComponent(searchResults, selectTitle) {
	if (searchResults.length === 0) return null;
	const searchItems = searchResults.map(item => {
		return (
			<div key={item.igdbId}>
				<div key={item.igdbId} className='search-item' onClick={() => selectTitle(item)}>
					<img src={item.imageUrl} alt={item.title} />
					<p className='search-item-title'>{item.title}</p>
				</div>
				<hr />
			</div>
		);
	});
	return (
		<div className='search-items'>{searchItems}</div>
	);
}

export default ItemCreationModal;
