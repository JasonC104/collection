import React from 'react';
import FormElement from '../FormElement';
import './itemCreation.scss';

function ItemCreationSearch(props) {
    const item = props.item;

    let searchItems = null;
    if (props.searchResults.length !== 0) {
        searchItems = props.searchResults.map(result => {
            return (
                <div key={result.igdbId} className='search-item' onClick={() => props.nextStep(result)}>
                    <img className='item-creation-img' src={result.imageUrl} alt={result.title} />
                    <p className='search-item-title'>{result.title}</p>
                </div>
            );
        });
    }

    return (
        <div style={{ width: '100%' }}>
            <FormElement label='Title'>
                <div className='field has-addons'>
                    <div className='control' style={{ width: '70%' }}>
                        <input name='title' className='input' type='text' placeholder='Name'
                            value={item.title} autoComplete="off" onChange={(e) => props.handleChange(e)} />
                    </div>
                    <div className='control'>
                        <div className='button is-info' onClick={() => props.search()}>Search</div>
                    </div>
                </div>
            </FormElement>
            <div className='search-items'>
                {searchItems}
            </div>
        </div>

    );
}

export default ItemCreationSearch;
