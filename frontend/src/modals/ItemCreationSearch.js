import React, { useState } from 'react';
import { FormElement } from '../elements';
import './styles.scss';

function ItemCreationSearch(props) {

    const [searchText, setSearchText] = useState(props.searchText);
    const onSearchChange = e => setSearchText(e.target.value);

    let searchItems = props.searchResults.map(item =>
        <div key={item.apiId} className='search-item' onClick={() => props.nextStep(item)}>
            <img className='item-creation-img' src={item.image.thumb} alt={item.title} />
            <p className='search-item-title'>{item.title}</p>
        </div>
    );

    const searchEvent = e => {
        e.preventDefault();
        props.search(searchText);
    }

    return (
        <div style={{ width: '100%' }}>
            <FormElement label='Title'>
                <form className='field has-addons' onSubmit={searchEvent}>
                    <div className='control' style={{ width: '70%' }}>
                        <input name='title' className='input' type='text' placeholder='Name'
                            value={searchText} autoComplete="off" onChange={onSearchChange} />
                    </div>
                    <div className='control'>
                        <div className='button is-info' type='submit' onClick={searchEvent}>Search</div>
                    </div>
                </form>
            </FormElement>
            <div className='search-items'>
                {searchItems}
            </div>
        </div>

    );
}

export default ItemCreationSearch;
