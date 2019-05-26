import React from 'react';
import FormElement from '../FormElement';
import './itemCreation.scss';

function ItemCreationForm(props) {
    const item = props.item;
    const platformOptions = props.platforms.map(p => <option key={p}>{p}</option>);
    return (
        <div className='is-flex' style={{ width: '100%' }}>
            <img className='modal-pic' src={props.imageUrl} alt={item.title} />
            <div style={{ marginLeft: '10px', width: '100%' }}>
                <h1 className='title'>{item.title}</h1>

                <FormElement label='Platform'>
                    <div className='select'>
                        <select name='platform' value={item.platform} onChange={(e) => props.handleChange(e)}>
                            {platformOptions}
                        </select>
                    </div>
                </FormElement>

                <FormElement label='Cost'>
                    <div className='control has-icons-left' style={{ width: '100px' }}>
                        <input name='cost' className='input' maxLength='6' type='text' placeholder='0'
                            value={item.cost} onChange={(e) => props.handleChange(e)} />
                        <span className='icon is-left'>
                            <i className='fas fa-dollar-sign' />
                        </span>
                    </div>
                </FormElement>

                <FormElement label='Rating'>
                    <div className='control'>
                        <input name='rating' className='input' type='text' placeholder='4/5'
                            value={item.rating} onChange={(e) => props.handleChange(e)} />
                    </div>
                </FormElement>
            </div>
        </div>
    );
}

export default ItemCreationForm;
