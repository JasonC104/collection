import React from 'react';
import { FormElement } from '../elements';
import './styles.scss';

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

    const searchEvent = e => {
        e.preventDefault();
        props.search();
    }

    return (
        <div style={{ width: '100%' }}>
            <FormElement label='Title'>
                <form className='field has-addons' onSubmit={e => searchEvent(e)}>
                    <div className='control' style={{ width: '70%' }}>
                        <input name='title' className='input' type='text' placeholder='Name'
                            value={item.title} autoComplete="off" onChange={(e) => props.handleChange(e)} />
                    </div>
                    <div className='control'>
                        <div className='button is-info' type='submit' onClick={e => searchEvent(e)}>Search</div>
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
