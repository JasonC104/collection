import React from 'react';
import { Icon } from '../../elements';
import './styles.scss';

class Toolbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = { search: '', sort: '', order: '', platform: [] };
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSort(option, order) {
        this.setState({ sort: option, order });
        this.props.changeItemRequirements({ 'sort': option, 'order': order });
    }

    handleFilter(filter, option) {
        const newFilter = this.state[filter];
        const index = newFilter.indexOf(option);
        if (index === -1) { // add the filter option
            newFilter.push(option);
        } else { // remove the filter option
            newFilter.splice(index, 1);
        }
        this.setState({
            [filter]: newFilter
        });
        this.props.changeItemRequirements({ [filter]: newFilter });
    }

    render() {

        const platformOptions = ['PS4', 'PS3', '3DS'].map(option => {
            return (
                <div key={option}>
                    <label className="checkbox">
                        <input type="checkbox" onClick={() => this.handleFilter('platform', option)} />
                        {option}
                    </label>
                </div>
            );
        });

        const completionOptions = ['Completed', 'Uncompleted'].map(option => {
            return (
                <div key={option}>
                    <label className="checkbox">
                        <input type="checkbox" onClick={() => { }} />
                        {option}
                    </label>
                </div>
            );
        });

        const sortOptions = ['date', 'title', 'rating'].map(option => {
            return (
                <div key={option} className="dropdown-option" >
                    <Icon className='dropdown-icon is-small' icon='fas fa-angle-up fa-lg'
                        onClick={() => this.handleSort(option, 'asc')} />
                    <Icon className='dropdown-icon is-small' icon='fas fa-angle-down fa-lg'
                        onClick={() => this.handleSort(option, 'desc')} />
                    <p>{option}</p>
                </div>
            )
        });

        return (
            <div className="level toolbar">
                <div className="level-item">
                    <form className="field has-addons">
                        <p className="control">
                            <input name='search' className="input" type="text" placeholder="Search for a Game" autoComplete="off"
                                value={this.state.search} onChange={(e) => this.handleChange(e)} />
                        </p>
                        <p className="control">
                            <button className="button" type='submit'
                                onClick={e => { e.preventDefault(); this.props.changeItemRequirements({ 'search': this.state.search }) }}>
                                Search
                            </button>
                        </p>
                    </form>
                </div>

                <div className="level-item">
                    <div className="dropdown is-hoverable">
                        <div className="dropdown-trigger">
                            <button className="button">
                                <span>Filter/Sort</span>
                                <Icon className="is-small" icon='fas fa-angle-down' />
                            </button>
                        </div>
                        <div className="dropdown-menu" id="dropdown-menu" role="menu">
                            <div className="dropdown-content is-flex">
                                <div className='filter-dropdown dropdown-column'>
                                    <p className='title is-5'>Filter</p>
                                    <div className='is-flex'>
                                        <div className='dropdown-column'>
                                            <p className='subtitle is-6'>Platform</p>
                                            {platformOptions}
                                        </div>
                                        <div className='dropdown-column'>
                                            <p className='subtitle is-6'>Completion</p>
                                            {completionOptions}
                                        </div>
                                    </div>
                                </div>
                                <div className='sort-dropdown dropdown-column'>
                                    <p className='title is-5'>Sort</p>
                                    <div className='dropdown-column'>
                                        <p className='subtitle is-6'>Options</p>
                                        {sortOptions}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="level-item">
                    <a className='button is-link' href='http://localhost:3001/api/items/csv' download>Export to CSV</a>
                </p>
            </div>
        );
    }
}

export default Toolbar;
