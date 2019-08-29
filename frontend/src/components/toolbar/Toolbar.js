// import React from 'react';
// import { connect } from 'react-redux';
// import { Actions } from '../../actions';
// import { Icon } from '../../elements';
// import './styles.scss';

// class Toolbar extends React.Component {

//     constructor(props) {
//         super(props);
//         this.state = { 'search': '' };
//     }

//     updateRequirements(newRequirements) {
//         (new Promise(resolve =>
//             resolve(this.props.changeGameRequirements(newRequirements))
//         )).then(() => this.props.getGames());
//     }

//     clearChanges() {
//         this.setState({ 'search': '' });
//         new Promise(resolve =>
//             resolve(this.props.removeGameRequirements())
//         ).then(() => this.props.getGames());
//     }

//     handleSearchChange(e) {
//         this.setState({ 'search': e.target.value });
//     }

//     handleSearchSubmit(e) {
//         e.preventDefault();
//         this.updateRequirements({ 'search': this.state.search });
//     }

//     handleSort(option, order) {
//         this.updateRequirements({ 'sort': option, 'order': order });
//     }

//     handleFilter(filter, option) {
//         let newFilter = this.props.gameRequirements[filter];
//         if (newFilter) {
//             const index = newFilter.indexOf(option);
//             if (index === -1) { // add the filter option
//                 newFilter.push(option);
//             } else { // remove the filter option
//                 newFilter.splice(index, 1);
//             }
//         } else {
//             newFilter = [option];
//         }
//         this.updateRequirements({ [filter]: newFilter });
//     }

//     render() {
//         // TODO make platform options dynamic
//         const platformOptions = ['PS4', 'PS3', '3DS'].map(option => {
//             return (
//                 <div key={option}>
//                     <label className="checkbox">
//                         <input type="checkbox" onClick={() => this.handleFilter('platform', option)} />
//                         {option}
//                     </label>
//                 </div>
//             );
//         });

//         const completionOptions = ['Completed', 'Uncompleted'].map(option => {
//             return (
//                 <div key={option}>
//                     <label className="checkbox">
//                         <input type="checkbox" onClick={() => { }} />
//                         {option}
//                     </label>
//                 </div>
//             );
//         });

//         const sortOptions = [
//             { label: 'Purchase Date', value: 'purchaseDate' },
//             { label: 'Title', value: 'title' },
//             { label: 'Rating', value: 'rating' }
//         ].map(option => {
//             return (
//                 <div key={option.value} className="dropdown-option" >
//                     <Icon className='dropdown-icon is-small' icon='fas fa-angle-up fa-lg'
//                         onClick={() => this.handleSort(option.value, 'asc')} />
//                     <Icon className='dropdown-icon is-small' icon='fas fa-angle-down fa-lg'
//                         onClick={() => this.handleSort(option.value, 'desc')} />
//                     <p>{option.label}</p>
//                 </div>
//             )
//         });

//         return (
//             <div className="toolbar">
//                 <form className="field has-addons toolbar-item">
//                     <p className="control">
//                         <input name='search' className="input" type="text" placeholder="Search for a Game" autoComplete="off"
//                             value={this.state.search} onChange={e => this.handleSearchChange(e)} />
//                     </p>
//                     <p className="control">
//                         <button className="button" type='submit' onClick={e => this.handleSearchSubmit(e)}>
//                             Search
//                         </button>
//                     </p>
//                 </form>

//                 <div className="dropdown is-hoverable toolbar-item">
//                     <div className="dropdown-trigger">
//                         <button className="button">
//                             <span>Filter/Sort</span>
//                             <Icon className="is-small" icon='fas fa-angle-down' />
//                         </button>
//                     </div>
//                     <div className="dropdown-menu" id="dropdown-menu" role="menu">
//                         <div className="dropdown-content is-flex">
//                             <div className='filter-dropdown dropdown-column'>
//                                 <p className='title is-5'>Filter</p>
//                                 <div className='is-flex'>
//                                     <div className='dropdown-column'>
//                                         <p className='subtitle is-6'>Platform</p>
//                                         {platformOptions}
//                                     </div>
//                                     <div className='dropdown-column'>
//                                         <p className='subtitle is-6'>Completion</p>
//                                         {completionOptions}
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className='sort-dropdown dropdown-column'>
//                                 <p className='title is-5'>Sort</p>
//                                 <div className='dropdown-column'>
//                                     <p className='subtitle is-6'>Options</p>
//                                     {sortOptions}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <p className="toolbar-item">
//                     <button className='button is-danger' onClick={() => this.clearChanges()}>Clear Filters/Sorts</button>
//                 </p>

//                 <p className="toolbar-item">
//                     <a className='button is-link' href='http://localhost:3001/api/games/csv' download>Export to CSV</a>
//                 </p>
//             </div>
//         );
//     }
// }

// function mapStateToProps(state) {
//     return {
//         gameRequirements: state.itemRequirements.gameRequirements,
//     };
// }

// function mapDispatchToProps(dispatch) {
//     return {
//         changeGameRequirements: (requirements) => dispatch(Actions.changeGameRequirements(requirements)),
//         removeGameRequirements: () => dispatch(Actions.removeGameRequirements()),
//     };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
